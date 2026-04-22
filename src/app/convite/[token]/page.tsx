import ConviteClient from "./ConviteClient";

export default async function ConvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ email?: string; name?: string; company?: string; role?: string }>;
}) {
  const { token } = await params;
  const { email, name, company, role } = await searchParams;

  return (
    <ConviteClient
      token={token}
      invitedName={name ?? "Colega"}
      invitedEmail={email ?? ""}
      companyName={company ?? "sua empresa"}
      invitedRole={role ?? "Leitor"}
    />
  );
}
