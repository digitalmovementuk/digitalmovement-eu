import { team } from "../team";
export function TeamPortrait({ person, hero = false }: { person: (typeof team)[number]; hero?: boolean }) {
  const base = `${import.meta.env.BASE_URL}${person.image.replace(/\.jpg$/, "")}`;
  const largest = Math.min(640, person.width);
  return <span className={`dm-team-portrait dm-team-portrait-${person.key}`}>
    <img src={`${base}-320.jpg`} srcSet={`${base}-160.jpg 160w, ${base}-320.jpg 320w, ${base}-${largest}.jpg ${largest}w`} sizes={hero ? "84px" : "(min-width: 1024px) 320px, (min-width: 640px) 40vw, 75vw"} alt={hero ? "" : person.name} width={person.width} height={person.height} loading={hero ? "eager" : "lazy"} decoding="async" />
  </span>;
}
