import Image from "next/image";
import type { Localized } from "@/lib/i18n";
import { t, type Locale } from "@/lib/i18n";

type ScreenshotProps = {
  locale: Locale;
  src: string;
  alt: Localized;
  caption: Localized;
  width: number;
  height: number;
  priority?: boolean;
};

export function Screenshot({
  locale,
  src,
  alt,
  caption,
  width,
  height,
  priority = false,
}: ScreenshotProps) {
  return (
    <figure className="shot">
      <Image
        src={src}
        alt={t(alt, locale)}
        width={width}
        height={height}
        sizes="(max-width: 900px) 100vw, 56rem"
        priority={priority}
      />
      <figcaption className="meta mt-2 px-0.5">{t(caption, locale)}</figcaption>
    </figure>
  );
}
