import Link from "next/link";

export default function Footer() {
  return (
    <footer className="ft">
      <div className="container ft-inner">
        <div>© Pixel Liber · EST. 2024</div>
        <div style={{ display: "flex", gap: 14 }}>
          <Link href="#">Termos</Link>
          <Link href="#">Privacidade</Link>
          <Link href="/#contato">Contato</Link>
        </div>
      </div>
    </footer>
  );
}
