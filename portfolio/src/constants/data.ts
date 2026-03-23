import type { Service } from "../types";

export const INTERACTIVE_SERVICES: Service[] = [
  {
    id: "01",
    title: "Cashly",
    category: "Finance",
    desc: "Gestore delle finanze personali con tracciamento spese e dashboard intuitiva.",
    url: "/cashly/",
  },
  {
    id: "02",
    title: "Mr. White",
    category: "Gaming",
    desc: "Un gioco di deduzione sociale online. Scopri chi è l'infiltrato prima che sia troppo tardi.",
    url: "/mr-white/",
  },
  {
    id: "03",
    title: "Calcolatore Finanze",
    category: "Finance",
    desc: "Strumento rapido per proiezioni finanziarie e calcoli di risparmio.",
    url: "/calcolatore-finanze/",
  },
  {
    id: "04",
    title: "Calcolatore Tasse",
    category: "Finance",
    desc: "Calcolatore per la tassazione italiana, utile per stime di stipendio netto e imposte.",
    url: "/calcolatore-tasse/",
  },
];

export const INFRA_SERVICES: Service[] = [
  {
    id: "05",
    title: "Nextcloud",
    category: "Cloud & Productivity",
    desc: "La mia nuvola personale per file, contatti e calendari. Sicurezza e privacy sotto il mio controllo.",
    url: "/cloud/",
  },
  {
    id: "06",
    title: "Timesheet",
    category: "Utility",
    desc: "Sistema di gestione e generazione di timesheet lavorativi in formato Excel.",
    url: "/timesheet/",
  },
  {
    id: "07",
    title: "CouchDB",
    category: "Database",
    desc: "Server database dedicato alla sincronizzazione in tempo reale per Obsidian LiveSync.",
    url: "/couchdb-obsidian/",
  },
];

export const NAV_LINKS: [string, string][] = [
  ["Servizi", "#servizi"],
  ["Chi sono", "#about"],
  ["Contatti", "#contatti"],
];

export const EMAIL = "robe.ingenito@gmail.com";

export const SOCIAL_LINKS: [string, string][] = [
  ["GitHub", "https://github.com/roberto-ingenito"],
  ["LinkedIn", "https://linkedin.com/in/roberto-ingenito-a883b91a2"],
  ["Email", `mailto:${EMAIL}`],
];

export const STATS: [string, string][] = [
  [(INTERACTIVE_SERVICES.length + INFRA_SERVICES.length).toString(), "servizi attivi"],
  ["24/7", "uptime"],
  ["100%", "self-hosted"],
];

export const MARQUEE_WORDS = ["Servizi", "Self-hosted", "Open source", "Privacy", "Controllo", "Tecnologia"];
