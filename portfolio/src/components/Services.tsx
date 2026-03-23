import { useState } from "react";
import { Reveal } from "./Reveal";
import { INTERACTIVE_SERVICES, INFRA_SERVICES } from "../constants/data";

export function Services() {
  const [activeService, setActiveService] = useState<string | null>(null);

  return (
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
  );
}
