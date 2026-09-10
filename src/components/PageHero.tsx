import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  eyebrow?: string;
  title: string;
  body?: string;
  image: string;
  objectPosition?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function PageHero({
  eyebrow,
  title,
  body,
  image,
  objectPosition = "center 42%",
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: Props) {
  return (
    <section className="relative min-h-[58vh] overflow-hidden bg-burgundy pt-16 text-white md:min-h-[64vh] md:pt-[4.5rem]">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt=""
          fill
          priority
          quality={95}
          className="object-cover"
          style={{ objectPosition }}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/35 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/15" />
      </div>

      <div className="relative z-10 container-page flex min-h-[calc(58vh-4rem)] flex-col justify-end pb-12 pt-20 md:min-h-[calc(64vh-4.5rem)] md:pb-16">
        {eyebrow ? <p className="eyebrow !text-gold-soft">{eyebrow}</p> : null}
        <h1 className="mt-4 max-w-3xl font-display text-4xl md:text-6xl lg:text-7xl">{title}</h1>
        {body ? (
          <p className="mt-5 max-w-2xl text-base text-white/85 md:text-lg">{body}</p>
        ) : null}
        {(primaryHref || secondaryHref) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryHref && primaryLabel ? (
              <Button
                nativeButton={false}
                render={<Link href={primaryHref} />}
                size="lg"
                className="h-12 rounded-full bg-white px-6 text-foreground hover:bg-white/90"
              >
                {primaryLabel}
                <ArrowUpRight className="size-4" />
              </Button>
            ) : null}
            {secondaryHref && secondaryLabel ? (
              <Button
                nativeButton={false}
                render={<Link href={secondaryHref} />}
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-white/30 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
              >
                {secondaryLabel}
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
