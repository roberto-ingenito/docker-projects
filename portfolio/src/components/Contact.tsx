import { Reveal } from "./Reveal";
import { EMAIL } from "../constants/data";
import "../styles/Contact.css";

export function Contact() {
  return (
    <section className="section contact" id="contatti">
      <Reveal>
        <div className="contact__inner">
          <span className="mono contact__label">Vuoi metterti in contatto?</span>
          <h2 className="contact__title">
            Scrivimi
            <br />
            <em>pure.</em>
          </h2>
          <a href={`mailto:${EMAIL}`} className="contact__link">
            <span>{EMAIL}</span>
            <span className="contact__arrow">↗</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
