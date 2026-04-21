import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { company: true },
        });

        if (!user || !user.isActive) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        const assinaturaAtiva = user.company?.statusAssinatura === "ativa";

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId,
          assinaturaAtiva,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.companyId = (user as any).companyId;
        token.assinaturaAtiva = (user as any).assinaturaAtiva;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).companyId = token.companyId;
        (session.user as any).assinaturaAtiva = token.assinaturaAtiva;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  // Fail loudly in production if NEXTAUTH_SECRET is not set
  secret: (() => {
    const secret = process.env.NEXTAUTH_SECRET;
    const isBuildTime = process.env.NEXT_PHASE === "phase-production-build";

    if (!secret) {
      if (process.env.NODE_ENV === "production") {
        if (isBuildTime) {
          // During `next build`: fail immediately so CI/CD fails fast if secret is missing.
          throw new Error(
            "[auth] NEXTAUTH_SECRET environment variable is not set. " +
              "Set it in your production environment to secure authentication sessions."
          );
        }
        // At runtime in production, fail immediately — auth is broken without a secret.
        throw new Error(
          "[auth] NEXTAUTH_SECRET environment variable is not set. " +
            "Set it in your production environment to secure authentication sessions."
        );
      }
      // In development, warn but allow build to proceed
      console.warn(
        "[auth] NEXTAUTH_SECRET is not set. " +
          "This is insecure for production. Set NEXTAUTH_SECRET in your environment variables."
      );
      return undefined;
    }
    return secret;
  })(),
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      },
    },
  },
  session: { strategy: "jwt" },
};

export function auth() {
  return getServerSession(authOptions);
}
