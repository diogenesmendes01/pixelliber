import Image from "next/image";
import Link from "next/link";

type Variant =
  | "default"      // horizontal colorido (fundos claros e backdrop blur escuro com transparência)
  | "on-dark"      // monocromático branco p/ fundos escuros sólidos
  | "on-gold"      // monocromático preto p/ fundos dourados/claros fortes
  | "on-colored";  // monocromático branco p/ gradientes coloridos (auth-brand)

interface Props {
  href?: string;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

const WIDTHS: Record<NonNullable<Props["size"]>, number> = {
  sm: 110,
  md: 140,
  lg: 200,
};

function sourceFor(variant: Variant): { src: string; ratio: number; alt: string } {
  switch (variant) {
    case "on-dark":
    case "on-colored":
      // Vertical mono-white — stacked, funciona em preto puro e gradientes escuros
      return { src: "/logo/vertical/vertical-mono-white.png", ratio: 1, alt: "Pixel Liber" };
    case "on-gold":
      return { src: "/logo/vertical/vertical-mono-black.png", ratio: 1, alt: "Pixel Liber" };
    case "default":
    default:
      // Horizontal colorido — base do sistema
      return { src: "/logo/horizontal/horizontal-300x64.png", ratio: 300 / 64, alt: "Pixel Liber" };
  }
}

export default function Logo({
  href,
  variant = "default",
  size = "md",
  className,
  style,
}: Props) {
  const { src, ratio, alt } = sourceFor(variant);
  const w = WIDTHS[size];
  const h = Math.round(w / ratio);

  const img = (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      priority
      style={{ height: h, width: "auto", display: "block" }}
    />
  );

  if (!href) {
    return (
      <span
        className={className}
        style={{ display: "inline-flex", alignItems: "center", ...style }}
      >
        {img}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", ...style }}
      aria-label={`${alt} — página inicial`}
    >
      {img}
    </Link>
  );
}
