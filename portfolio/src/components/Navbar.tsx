import { NAV_LINKS } from "../constants/data";
import "../styles/NavBar.css";

export function Navbar() {
  return (
    <nav className="nav">
      <span className="logo-name">R.I.</span>

      <div className="links">
        {NAV_LINKS.map(([label, href]) => (
          <a href={href} className="link" key={label}>
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
