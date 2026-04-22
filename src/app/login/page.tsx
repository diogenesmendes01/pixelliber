"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "./_components/LoginForm";
import FirstAccessWizard from "./_components/FirstAccessWizard";
import ForgotPasswordForm from "./_components/ForgotPasswordForm";
import BlockedAccount from "./_components/BlockedAccount";
import LoginLayout from "./_components/LoginLayout";

type Flow = "login" | "first-access" | "forgot" | "blocked";

function LoginPageInner() {
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");

  const initialFlow: Flow =
    stepParam === "forgot" || stepParam === "esq-1"
      ? "forgot"
      : stepParam === "err-bloq" || stepParam === "blocked"
        ? "blocked"
        : "login";

  const [flow, setFlow] = useState<Flow>(initialFlow);
  const [initialPassword, setInitialPassword] = useState("");
  const [blockedInfo, setBlockedInfo] = useState<{ cnpj?: string; releaseAt?: number }>({});

  useEffect(() => {
    if (stepParam === "err-bloq" || stepParam === "blocked") {
      setFlow("blocked");
      setBlockedInfo({
        cnpj: searchParams.get("cnpj") ?? undefined,
        releaseAt: Date.now() + 15 * 60 * 1000, // 15 min from now
      });
    }
  }, [stepParam, searchParams]);

  if (flow === "blocked") {
    return (
      <BlockedAccount
        cnpj={blockedInfo.cnpj}
        releaseAt={blockedInfo.releaseAt ?? Date.now() + 15 * 60 * 1000}
        onRecover={() => setFlow("forgot")}
        onBack={() => setFlow("login")}
      />
    );
  }

  if (flow === "first-access") {
    return (
      <LoginLayout>
        <FirstAccessWizard
          initialPassword={initialPassword}
          onComplete={() => { window.location.href = "/vitrine"; }}
          onBack={() => setFlow("login")}
        />
      </LoginLayout>
    );
  }
  if (flow === "forgot") {
    return (
      <LoginLayout>
        <ForgotPasswordForm onBack={() => setFlow("login")} />
      </LoginLayout>
    );
  }
  return (
    <LoginLayout>
      <LoginForm
        onSuccess={({ firstAccess, password }) => {
          if (firstAccess) {
            setInitialPassword(password);
            setFlow("first-access");
          } else {
            window.location.href = "/vitrine";
          }
        }}
        onForgotPassword={() => setFlow("forgot")}
        onBlocked={(cnpj) => {
          setBlockedInfo({ cnpj, releaseAt: Date.now() + 15 * 60 * 1000 });
          setFlow("blocked");
        }}
      />
    </LoginLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--muted)",
          }}
        >
          Carregando…
        </div>
      }
    >
      <LoginPageInner />
    </Suspense>
  );
}
