import { team } from "../team";
export function TeamPortrait({ person, hero = false }: { person: (typeof team)[number]; hero?: boolean }) {
  return <span className={`dm-team-portrait dm-team-portrait-${person.key}`}>
    <img src={`${import.meta.env.BASE_URL}${person.image}`} alt={hero ? "" : person.name} width={person.width} height={person.height} loading={hero ? "eager" : "lazy"} decoding="async" />
  </span>;
}
