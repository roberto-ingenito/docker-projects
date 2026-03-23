import { useState, useEffect, useRef, type ReactNode, Fragment } from "react";
import "./App.css";

// ── Types ──────────────────────────────────────────────────────────────────

interface Service {
  id: string;
  title: string;
  category: string;
  desc: string;
  url: string;
}

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// ── Data ───────────────────────────────────────────────────────────────────

const INTERACTIVE_SERVICES: Service[] = [
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

const INFRA_SERVICES: Service[] = [
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

const NAV_LINKS: [string, string][] = [
  ["Servizi", "#servizi"],
  ["Chi sono", "#about"],
  ["Contatti", "#contatti"],
];

const EMAIL = "robe.ingenito@gmail.com";

const SOCIAL_LINKS: [string, string][] = [
  ["GitHub", "#"],
  ["LinkedIn", "#"],
  ["Email", `mailto:${EMAIL}`],
];

const STATS: [string, string][] = [
  ["7", "servizi attivi"],
  ["24/7", "uptime"],
  ["100%", "self-hosted"],
];

// ── Hooks ──────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

// ── Components ─────────────────────────────────────────────────────────────

function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`reveal ${inView ? "visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onMove = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const MARQUEE_WORDS = ["Servizi", "Self-hosted", "Open source", "Privacy", "Controllo", "Tecnologia"];

  return (
    <>
      {/* Cursore personalizzato */}
      <div className="cursor" style={{ left: cursorPos.x, top: cursorPos.y }} />

      {/* Sfumatura di sfondo */}
      <div className="bg-glow" />

      {/* ── Navigazione ─────────────────────────────── */}
      <nav className={`nav ${mounted ? "nav--mounted" : ""}`}>
        <span className="logo-name">R.I.</span>
        <ul className="nav__links">
          {NAV_LINKS.map(([label, href]) => (
            <li key={label}>
              <a href={href} className="nav__link">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__content">
          <div className={`hero__eyebrow ${mounted ? "hero__eyebrow--in" : ""}`}>
            <span className="mono">Software Developer</span>
            <span className="divider">—</span>
            <span className="mono">Server personale</span>
          </div>

          <h1 className={`hero__title ${mounted ? "hero__title--in" : ""}`}>
            <span className="hero__title-line">Roberto</span>
            <span className="hero__title-line hero__title-line--gold">Ingenito</span>
          </h1>

          <p className={`hero__sub ${mounted ? "hero__sub--in" : ""}`}>
            Benvenuto nel mio spazio personale.
            <br />
            Qui trovi tutti i servizi che ho costruito e che ospito.
          </p>

          <div className={`hero__cta-wrap ${mounted ? "hero__cta-wrap--in" : ""}`}>
            <a href="#servizi" className="hero__btn">
              <span>Esplora i servizi</span>
              <span className="hero__btn-arrow">↓</span>
            </a>
          </div>
        </div>

        <div className="hero__footer">
          <div className="hero__scroll">
            <div className="scroll-line" />
            <span className="mono hero__scroll-label">Scorri</span>
          </div>
          <div className="hero__year mono">2026</div>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────── */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {Array.from({ length: 4 }, (_, setIndex) => (
            <div key={setIndex} className="marquee-set">
              {MARQUEE_WORDS.map((word, wordIndex) => (
                <Fragment key={wordIndex}>
                  <span>{word}</span>
                  <span className="marquee-dot" aria-hidden="true" />
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Servizi ──────────────────────────────────── */}
      <section className="section" id="servizi">
        <Reveal>
          <div className="section__header">
            <span className="mono section__label">Servizi disponibili</span>
            <div className="section__line" />
          </div>
        </Reveal>

        <div className="services__list">
          {INTERACTIVE_SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={i * 70}>
              <a
                href={s.url}
                className={`service-item ${activeService === s.id ? "service-item--active" : ""}`}
                onMouseEnter={() => setActiveService(s.id)}
                onMouseLeave={() => setActiveService(null)}
                target="_blank"
                rel="noopener noreferrer">
                <span className="service-item__num mono">{s.id}</span>
                <div className="service-item__main">
                  <h3 className="service-item__title">{s.title}</h3>
                  <p className="service-item__desc">{s.desc}</p>
                </div>
                <div className="service-item__meta">
                  <span className="mono service-item__category">{s.category}</span>
                  <span className="service-item__url mono">{s.url}</span>
                </div>
                <div className="service-item__arrow">↗</div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="section__header" style={{ marginTop: "5rem", marginBottom: "2rem" }}>
            <span className="mono section__label">Infrastruttura & Backend</span>
            <div className="section__line" />
          </div>
        </Reveal>

        <div className="services__list">
          {INFRA_SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={i * 70}>
              <div className="service-item">
                <span className="service-item__num mono">{s.id}</span>
                <div className="service-item__main">
                  <h3 className="service-item__title">{s.title}</h3>
                  <p className="service-item__desc">{s.desc}</p>
                </div>
                <div className="service-item__meta">
                  <span className="mono service-item__category">{s.category}</span>
                </div>
                <div className="service-item__arrow" style={{ opacity: 0 }}>
                  ↗
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Chi sono ─────────────────────────────────── */}
      <section className="section about" id="about">
        <div className="about__grid">
          <Reveal className="about__left">
            <span className="mono section__label">Chi sono</span>
            <h2 className="about__title">
              Un server,
              <br />
              <em>mille possibilità</em>
            </h2>
          </Reveal>
          <div className="about__right">
            <Reveal delay={100}>
              <p className="about__text">
                Sono Roberto Ingenito. Questo è il mio server personale, un ambiente che ho costruito e configuro con cura per ospitare progetti,
                strumenti e servizi che utilizzo ogni giorno.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="about__text">
                Credo nel self-hosting come forma di autonomia digitale: controllo sui propri dati, libertà di configurazione, e la soddisfazione di
                costruire qualcosa di proprio.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="about__stats">
                {STATS.map(([num, label]) => (
                  <div key={label} className="stat">
                    <span className="stat__num">{num}</span>
                    <span className="stat__label mono">{label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Contatti ─────────────────────────────────── */}
      <section className="section cta" id="contatti">
        <Reveal>
          <div className="cta__inner">
            <span className="mono cta__label">Vuoi metterti in contatto?</span>
            <h2 className="cta__title">
              Scrivimi
              <br />
              <em>pure.</em>
            </h2>
            {/* ← Sostituisci con la tua email */}
            <a href={`mailto:${EMAIL}`} className="cta__link">
              <span>{EMAIL}</span>
              <span className="cta__arrow">↗</span>
            </a>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="footer">
        <span className="mono footer__copy">Roberto Ingenito</span>
        <div className="footer__links">
          {SOCIAL_LINKS.map(([label, href]) => (
            <a key={label} href={href} className="footer__link mono">
              {label}
            </a>
          ))}
        </div>
      </footer>
    </>
  );
}
