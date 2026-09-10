import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

type Props = {
  className?: string;
  /** Compact for nav; full shows more of the mark */
  size?: "nav" | "footer" | "hero";
  showWordmark?: boolean;
};

export function BrandLogo({ className, size = "nav", showWordmark = false }: Props) {
  const dims =
    size === "nav"
      ? { wrap: "h-10 w-10 sm:h-11 sm:w-11", img: 88 }
      : size === "footer"
        ? { wrap: "h-24 w-24 md:h-28 md:w-28", img: 224 }
        : { wrap: "h-36 w-36 md:h-44 md:w-44", img: 352 };

  return (
    <Link href="/" className={cn("inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "relative shrink-0 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(18,17,15,0.12)] ring-1 ring-black/5",
          dims.wrap,
        )}
      >
        <Image
          src="/images/logo.png"
          alt={site.name}
          width={dims.img}
          height={dims.img}
          className="h-full w-full object-contain p-0.5"
          quality={95}
          priority={size === "nav"}
        />
      </span>
      {showWordmark ? (
        <span className="min-w-0">
          <span className="block text-[15px] font-semibold tracking-tight">{site.shortName}</span>
          <span className="block text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Students Network
          </span>
        </span>
      ) : null}
    </Link>
  );
}
