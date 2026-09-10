import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { site, whatsappUrl } from "@/lib/site";

type Props = {
  title?: string;
  body?: string;
};

export function CtaBand({
  title = "Ready when you are.",
  body = `Fill the enquiry form and our team will review your details — usually ${site.responseSla}.`,
}: Props) {
  return (
    <section className="pb-[clamp(5rem,10vw,8rem)]">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2rem] bg-foreground px-8 py-16 text-center text-background md:px-16">
          <div className="pointer-events-none absolute inset-0 opacity-25">
            <Image
              src={site.images.groupCloseup}
              alt=""
              fill
              className="object-cover object-[center_42%]"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-foreground/85" />
          <div className="relative">
            <p className="text-xs font-semibold tracking-[0.18em] text-gold-soft uppercase">Next step</p>
            <h2 className="mt-4 font-display text-4xl md:text-6xl">{title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-background/70 md:text-lg">{body}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                nativeButton={false}
                render={<Link href="/enquire" />}
                size="lg"
                className="h-12 rounded-full bg-white px-6 text-foreground hover:bg-white/90"
              >
                Fill the enquiry form
              </Button>
              <Button
                nativeButton={false}
                  render={<Link href={whatsappUrl()} target="_blank" rel="noreferrer" />}
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  WhatsApp Tommy
                </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
