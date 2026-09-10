// Shared portraits and contact details for the hero and team section.
export const team = [
  {
    key: "johannes", name: "Johannes Kaluc", role: "Head of Customer Success",
    description: "Johannes ist Ihr Ansprechpartner für den Einstieg. Er hört zu, fragt nach Ihren Zielen und schaut mit Ihnen darauf, was Ihr Marketing bisher bringt. Gemeinsam klären Sie, welche Schritte für Ihr Unternehmen sinnvoll sind.",
    image: "brand/team/johannes-kaluc.jpg", width: 1553, height: 1600,
    phone: "+49 160 577 4845", phoneHref: "tel:+491605774845", whatsappHref: "https://wa.me/491605774845", email: "office@digitalmovement.eu",
  },
  {
    key: "raoul", name: "Raoul Müller", role: "Head of Customer Care",
    description: "Raoul begleitet Sie während der Zusammenarbeit. Er bringt Erfahrung aus einer der vier großen Unternehmensberatungen sowie aus KI und Kundenbetreuung mit. Er hält Sie auf dem Laufenden, erklärt den Stand Ihres Projekts und ist bei Fragen für Sie da.",
    image: "brand/team/raoul-mueller.jpg", width: 570, height: 570,
    phone: "+49 176 23296439", phoneHref: "tel:+4917623296439", whatsappHref: null, email: "office@digitalmovement.eu",
  },
] as const;
