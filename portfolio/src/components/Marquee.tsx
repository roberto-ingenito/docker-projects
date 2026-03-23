import { Fragment } from "react";
import { MARQUEE_WORDS } from "../constants/data";
import "../styles/Marquee.css";

export function Marquee() {
  return (
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
  );
}
