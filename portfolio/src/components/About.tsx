import { Reveal } from "./Reveal";
import { STATS } from "../constants/data";
import "../styles/About.css";

export function About() {
  return (
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
  );
}
