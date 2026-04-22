import Link from "next/link";
import Image from "next/image";

export interface BookData {
  id: number | string;
  t: string;
  a: string;
  tag: string;
  cat?: string;
  hue: number;
  img?: string | null;
  isNew?: boolean;
}

export function bookBg(hue: number) {
  return `linear-gradient(150deg, oklch(0.42 0.1 ${hue}), oklch(0.22 0.08 ${(hue + 30) % 360}))`;
}

interface Props {
  book: BookData;
  extraClass?: string;
  href?: string;
  style?: React.CSSProperties;
}

export default function BookCover({ book, extraClass = "", href, style }: Props) {
  const linkHref = href ?? `/vitrine/${book.id}`;
  return (
    <Link
      href={linkHref}
      className={`cover ${extraClass}`.trim()}
      style={{ background: bookBg(book.hue), ...style }}
      aria-label={`${book.t} — ${book.a}`}
    >
      {book.img && (
        <Image
          className="cover-img"
          src={book.img}
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 720px) 40vw, 160px"
        />
      )}
      {book.isNew && <span className="cover-new">novo</span>}
      <span className="cover-tag">{book.tag}</span>
      <span>
        <span className="cover-title">{book.t}</span>
        <span className="cover-author" style={{ display: "block" }}>
          {book.a}
        </span>
      </span>
    </Link>
  );
}
