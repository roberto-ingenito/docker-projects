import { useState, useEffect } from "react";
import "./App.css";

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Services } from "./components/Services";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function App() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onMove = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      {/* Cursore personalizzato */}
      <div className="cursor" style={{ left: cursorPos.x, top: cursorPos.y }} />

      {/* Sfumatura di sfondo */}
      <div className="bg-glow" />

      <Navbar mounted={mounted} />

      <Hero mounted={mounted} />

      <Marquee />

      <Services />

      <About />

      <Contact />

      <Footer />
    </>
  );
}
