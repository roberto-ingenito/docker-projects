import { SOCIAL_LINKS } from "../constants/data";
import "../styles/Footer.css";

export function Footer() {
  return (
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
  );
}
