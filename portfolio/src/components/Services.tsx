import { useState } from "react";
import { Reveal } from "./Reveal";
import { INTERACTIVE_SERVICES, INFRA_SERVICES } from "../constants/data";
import "../styles/Services.css";

export function Services() {
  const [activeService, setActiveService] = useState<string | null>(null);

  const delay = 70;

  return (
    <section className="services__section" id="servizi">
      <Reveal>
        <div className="section__header" style={{ margin: "0 3rem 1rem" }}>
          <span className="mono section__label">Servizi disponibili</span>
          <div className="section__line" />
        </div>
      </Reveal>

      <div className="services__list">
        {INTERACTIVE_SERVICES.map((s, i) => (
          <Reveal key={s.id} delay={i * delay}>
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

      <Reveal delay={INTERACTIVE_SERVICES.length * delay}>
        <div className="section__header" style={{ margin: "5rem 3rem 1rem" }}>
          <span className="mono section__label">Infrastruttura & Backend</span>
          <div className="section__line" />
        </div>
      </Reveal>

      <div className="services__list">
        {INFRA_SERVICES.map((s, i) => (
          <Reveal key={s.id} delay={(INTERACTIVE_SERVICES.length + 1) * delay + i * delay}>
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
  );
}
