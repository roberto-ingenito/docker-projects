import { Reveal } from "./Reveal";
import { EMAIL } from "../constants/data";

export function Contact() {
  return (
    <section className="section cta" id="contatti">
      <Reveal>
        <div className="cta__inner">
          <span className="mono cta__label">Vuoi metterti in contatto?</span>
          <h2 className="cta__title">
            Scrivimi
            <br />
            <em>pure.</em>
          </h2>
          <a href={`mailto:${EMAIL}`} className="cta__link">
            <span>{EMAIL}</span>
            <span className="cta__arrow">↗</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
