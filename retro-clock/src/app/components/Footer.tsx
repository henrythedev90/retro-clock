"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import styles from "./Footer.module.css";

// Contact links - replace with your own if needed
const CONTACT_LINKS = [
  {
    href: "https://github.com/henrythedev90/retro-clock",
    label: "GitHub",
    devicon: "devicon-github-original",
  },
  {
    href: "https://linkedin.com/in/yourusername",
    label: "LinkedIn",
    devicon: "devicon-linkedin-plain",
  },
  {
    href: "https://yourwebsite.com",
    label: "Website",
    devicon: "",
  },
];

export default function Footer() {
  const NA = "🌎";
  const AF = "🌍";
  const AS = "🌏";

  const globalEmoji = useMemo(() => [NA, AF, AS], []);
  const [currentEmoji, setCurrentEmoji] = useState(globalEmoji[0]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
      setCurrentEmoji(globalEmoji[counter % globalEmoji.length]);
    }, 500);
    return () => clearInterval(interval);
  }, [counter, globalEmoji]);

  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        {CONTACT_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className={styles.link}>
            {link.devicon ? (
              <div className={styles.icon}>
                <i className={link.devicon}></i>
                <label>{link.label}</label>
              </div>
            ) : (
              <span className={styles.textLink}>
                Visit Creator!{" "}
                <span className={styles.emoji}>{currentEmoji}</span>
              </span>
            )}
          </Link>
        ))}
      </div>
    </footer>
  );
}
