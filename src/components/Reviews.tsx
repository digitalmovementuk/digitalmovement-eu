import { googleRating } from "../content";
import trust from "../trust-content.json";
export function Reviews() {
  return <section id="reviews" data-surface="light" className="surface-light py-20 sm:py-24">
    <div className="container-v3">
      <div className="rounded-[28px] border border-ink/10 bg-surface-2 p-7 sm:p-10 text-center lg:text-left">
        <h2 className="text-[26px] sm:text-[32px] font-bold tracking-tight text-ink">{trust.reviews.heading}</h2>
        <p className="mt-5 max-w-[75ch] text-[16px] text-ink-soft leading-relaxed mx-auto lg:mx-0">{trust.reviews.body}</p>
        <a href={googleRating.reviewsUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-[15px] font-semibold text-ink underline underline-offset-4">{trust.reviews.linkLabel}</a>
      </div>
    </div>
  </section>;
}
