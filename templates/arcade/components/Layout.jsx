"use client";

import { useEffect } from "react";
import { useEmailJsKeepalive } from "@/lib/emailjs";
import { setPersistedTemplate } from "@/lib/portfolioCookies";
import "./globals.css";
import ArcadeBlast from "./ui/ArcadeBlast";
import PixelStars from "./ui/PixelStars";
import Scanlines from "./ui/Scanlines";
import ScoreBar from "./ui/ScoreBar";

export default function Layout({ children, personal, Sections = [] }) {
  useEmailJsKeepalive();
  const name = personal?.name || "";
  const initials =
    personal?.monogram ||
    personal?.logoText ||
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("");
  const links = [
    { id: "home", label: "Start" },
    { id: "about", label: "Player" },
    { id: "skills", label: "Loadout" },
    ...Sections.map((section) => ({ id: section.id, label: section.name })),
    { id: "contact", label: "Connect" },
  ];

  useEffect(() => {
    setPersistedTemplate("arcade");
  }, []);

  const go = (event, id) => {
    if (id === "home") return;
    event.preventDefault();
    window.dispatchEvent(new CustomEvent("arcade:select-tab", { detail: id }));
    document
      .getElementById("arcade-sections")
      ?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="arcade-app">
      <ScoreBar />
      <Scanlines />
      <PixelStars />
      <ArcadeBlast />
      <div className="arcade-grid-bg" aria-hidden="true" />
      <header className="arcade-header">
        <a className="arcade-brand" href="#home" aria-label={`${name} home`}>
          <span className="arcade-brand-badge">{initials || "P"}</span>
          <span>
            <strong>{name || "Player one"}</strong>
          </span>
        </a>
        <nav aria-label="Primary navigation">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.id === "home" ? "#home" : "#arcade-sections"}
              onClick={(event) => go(event, link.id)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a className="arcade-status" href="#contact">
          <i /> Online
        </a>
        <button
          className="arcade-menu"
          type="button"
          aria-label="Toggle navigation"
          onClick={(event) =>
            event.currentTarget.closest("header").classList.toggle("is-open")
          }
        >
          Menu
        </button>
      </header>
      <main>{children}</main>
      <footer className="arcade-footer">
        <span>GG / {initials || name}</span>
        <span>{personal?.location || ""}</span>
        <span className="arcade-footer-copy">
          © {new Date().getFullYear()} {name}.{" "}
          {personal?.footerText || "Thanks for playing."}
        </span>
        <a href="#home" aria-label="Back to top">
          Top
        </a>
      </footer>
    </div>
  );
}
