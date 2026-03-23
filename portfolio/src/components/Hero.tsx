interface HeroProps {
  mounted: boolean;
}

export function Hero({ mounted }: HeroProps) {
  return (
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
  );
}
