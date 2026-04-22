"use client";

import { useState } from "react";
import LoginForm from "./_components/LoginForm";
import FirstAccessWizard from "./_components/FirstAccessWizard";
import ForgotPasswordForm from "./_components/ForgotPasswordForm";
import LoginLayout from "./_components/LoginLayout";

type Flow = "login" | "first-access" | "forgot";

export default function LoginPage() {
  const [flow, setFlow] = useState<Flow>("login");
  const [initialPassword, setInitialPassword] = useState("");

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
      />
    </LoginLayout>
  );
}
