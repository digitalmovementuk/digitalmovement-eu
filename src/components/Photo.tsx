/**
 * A self-hosted photograph, served as WebP with a JPEG fallback and a real
 * srcset.
 *
 * Every raster image on this site used to be hot-linked from
 * images.unsplash.com. That cost us four things at once:
 *
 * - a third-party connection on page load, fired before anyone had agreed to
 *   anything, which is the sort of thing a privacy review asks about;
 * - no WebP — Unsplash's `auto=format` does serve it, but only to browsers
 *   that ask, and it never appears in the markup, so nothing that reads the
 *   HTML can tell;
 * - no srcset, so a phone downloaded the 2400px desktop file;
 * - a hard dependency on someone else's CDN staying up and staying free.
 *
 * The files now live in public/brand/photos, generated at three widths in
 * both formats. The build copies brand/ into the theme wholesale, so the
 * WordPress render picks them up with no extra wiring.
 *
 * `display: contents` on the <picture> matters. Several of these images are
 * positioned by a parent (`absolute inset-0 h-full w-full`), and an ordinary
 * inline <picture> would sit between the image and that parent and become the
 * box `h-full` resolves against — which collapses the image to nothing.
 * Contents removes the wrapper from layout entirely, so the markup renders
 * exactly as the bare <img> did.
 */

type Props = {
  /** Basename in /brand/photos — e.g. "about-hero" for about-hero-1800.webp. */
  name: string;
  /** Generated widths, ascending. Must match what the files on disk are. */
  widths: number[];
  /** Intrinsic size of the largest file, so the box is reserved up front. */
  width: number;
  height: number;
  /** "" for decorative images, which must also be aria-hidden by the caller. */
  alt: string;
  /** How wide the image renders. Getting this wrong wastes the srcset. */
  sizes: string;
  className?: string;
  /** Above the fold. Skips lazy-loading and raises fetch priority. */
  eager?: boolean;
};

export function Photo({
  name,
  widths,
  width,
  height,
  alt,
  sizes,
  className,
  eager = false,
}: Props) {
  const base = import.meta.env.BASE_URL;
  const dir = `${base}brand/photos`;
  const set = (ext: string) => widths.map((w) => `${dir}/${name}-${w}.${ext} ${w}w`).join(", ");
  // Fallback src for anything too old to understand srcset. The middle width
  // keeps that case from pulling the largest file down a slow connection.
  const fallback = widths[Math.floor(widths.length / 2)];

  return (
    <picture className="contents">
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={`${dir}/${name}-${fallback}.jpg`}
        srcSet={set("jpg")}
        sizes={sizes}
        alt={alt}
        {...(alt === "" ? { "aria-hidden": true } : {})}
        width={width}
        height={height}
        className={className}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}
