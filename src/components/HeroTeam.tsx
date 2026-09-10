import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { team } from "../team";
import { TeamPortrait } from "./TeamPortrait";
import "../styles/team.css";
export function HeroTeam() {
  return <Link className="dm-hero-team" to="/#founder">
    <span className="dm-hero-team-faces">{team.map(person => <TeamPortrait key={person.key} person={person} hero />)}</span>
    <span className="dm-hero-team-caption"><strong>Johannes &amp; Raoul</strong><span>Ihre Ansprechpartner <ArrowUpRight size={14} aria-hidden="true" /></span></span>
  </Link>;
}
