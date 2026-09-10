import { Mail, Phone } from "lucide-react";
import { Reveal } from "../lib/Reveal";
import { team } from "../team";
import { TeamPortrait } from "./TeamPortrait";
import { WhatsAppIcon } from "./WhatsAppIcon";
import "../styles/team.css";
export function FounderNote() {
  return <section id="founder" data-surface="light" className="dm-team-section surface-light" aria-labelledby="team-heading">
    <div className="container-v3">
      <Reveal><div className="dm-team-heading">
        <div><p className="eyebrow text-ink-muted">Wer hinter Digital Movement steht</p><h2 id="team-heading">Lernen Sie Ihre<br /><span>Ansprechpartner kennen.</span></h2></div>
        <p>Vom ersten Gespräch bis zum laufenden Projekt: Johannes und Raoul begleiten Sie persönlich.</p>
      </div></Reveal>
      <div className="dm-team-grid">{team.map((person, index) => <Reveal key={person.key} delay={index * 0.08}>
        <article className="dm-team-card" id={person.key}>
          <TeamPortrait person={person} /><h3>{person.name}</h3><p className="dm-team-role">{person.role}</p>
          <p className="dm-team-description">{person.description}</p>
          <div className="dm-team-contact">
            <a href={person.phoneHref} aria-label={`${person.name} anrufen: ${person.phone}`}><Phone size={17} aria-hidden="true" />{person.phone}</a>
            <a href={`mailto:${person.email}`} aria-label={`E-Mail an ${person.name}: ${person.email}`}><Mail size={17} aria-hidden="true" />{person.email}</a>
            {person.whatsappHref && <a href={person.whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="Johannes Kaluc per WhatsApp schreiben (neuer Tab)"><WhatsAppIcon width="17" height="17" />Johannes per WhatsApp</a>}
          </div>
        </article>
      </Reveal>)}</div>
    </div>
  </section>;
}
