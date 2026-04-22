import { redirect } from "next/navigation";

export default function EsqueceuSenhaRedirect() {
  redirect("/login?step=forgot");
}
