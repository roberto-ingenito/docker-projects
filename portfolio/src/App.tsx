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

  useEffect(() => {
    const onMove = (e: MouseEvent) => setCursorPos({ x: e.clientX - 2, y: e.clientY - 2 });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      {/* Cursore personalizzato */}
      <div className="cursor" style={{ left: cursorPos.x, top: cursorPos.y }} />

      <Navbar />

      <Hero />

      <Marquee />

      <Services />

      <About />

      <Contact />

      <Footer />
    </>
  );
}
