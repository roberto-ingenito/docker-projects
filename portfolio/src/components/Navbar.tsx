import { NAV_LINKS } from "../constants/data";

interface NavbarProps {
  mounted: boolean;
}

export function Navbar({ mounted }: NavbarProps) {
  return (
    <nav className={`nav ${mounted ? "nav--mounted" : ""}`}>
      <span className="logo-name">R.I.</span>
      <ul className="nav__links">
        {NAV_LINKS.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="nav__link">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
