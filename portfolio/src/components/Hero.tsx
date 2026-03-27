import "../styles/Hero.css";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__content">
        <div className="hero_content__eyebrow">
          <span className="mono">Software Developer</span>
          <div className="divider" />
          <span className="mono">Server personale</span>
        </div>

        <div>
          <h1 className="hero_content__title">
            <span className="hero_content__title-line">Roberto</span>
            <span className="hero_content__title-line hero_content__title-line--gold">Ingenito</span>
          </h1>
          <p className="hero_content__sub">
            Benvenuto nel mio spazio personale.
            <br />
            Qui trovi tutti i servizi che ho costruito e che ospito.
          </p>
        </div>

        <div>
          <a href="#servizi" className="hero__btn">
            <span>Esplora i servizi</span>
            <span className="hero__btn-arrow">↓</span>
          </a>
        </div>
      </div>

      <div className="hero_footer">
        <div className="hero_footer__scroll-container">
          <div className="hero_footer__scroll-line" />
          <span className="mono hero_footer__label">Scorri</span>
        </div>
        <div className="mono hero_footer__label">2026</div>
      </div>
    </section>
  );
}
