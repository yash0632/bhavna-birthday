/* ==========================================
   LetterSection Component

   Displays a heartfelt message inside a letter-style
   card with natural-paced typewriter animation.
   One specific paragraph (the emotional core) types
   slower and is visually set apart so it lands deeper.
   ========================================== */

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./LetterSection.module.css";
import { config } from "../config";

const BASE_SPEED = 35;

const PAUSE_AFTER: Record<string, number> = {
  ",": 150,
  "—": 150,
  ":": 200,
  ";": 200,
  ".": 450,
  "!": 450,
  "?": 450,
};

const START_DELAY = 500;

const EMPHASIS_INDEX = 4;
const EMPHASIS_SPEED_MULTIPLIER = 1.9;
const PRE_EMPHASIS_PAUSE = 1100;
const POST_EMPHASIS_PAUSE = 1600;

export default function LetterSection() {
  // How many paragraphs (from the start) are fully typed.
  // Derived rendering from this count makes duplicates structurally
  // impossible — even if something fires this update twice for the
  // same paragraph, Math.max() below makes it a harmless no-op.
  const [completedCount, setCompletedCount] = useState(0);
  const [currentTypedText, setCurrentTypedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const isUserScrolledAwayRef = useRef(false);

  // Guards against the whole typing sequence ever starting twice
  const hasStartedTypingRef = useRef(false);
  // Extra safety net: if the effect is ever cleaned up mid-sequence
  // (unmount, dev double-invoke, fast refresh), any timers already
  // in flight check this before touching state, so a stray leftover
  // callback can never sneak in an update after the fact
  const cancelledRef = useRef(false);

  const paragraphs = config.message;

  useEffect(() => {
    cancelledRef.current = false;

    if (!isInView || hasStartedTypingRef.current) return;
    hasStartedTypingRef.current = true;

    let paraIndex = 0;
    let charIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const typeParagraph = () => {
      if (cancelledRef.current) return;

      if (paraIndex >= paragraphs.length) {
        setIsTypingComplete(true);
        return;
      }

      const text = paragraphs[paraIndex];
      const isEmphasis = paraIndex === EMPHASIS_INDEX;
      const speedMultiplier = isEmphasis ? EMPHASIS_SPEED_MULTIPLIER : 1;

      const typeNextChar = () => {
        if (cancelledRef.current) return;

        if (charIndex >= text.length) {
          const finishedIndex = paraIndex;
          // Math.max guarantees this can never move the count backwards
          // or double-count — even a stray duplicate call is a no-op
          setCompletedCount((prev) => Math.max(prev, finishedIndex + 1));
          setCurrentTypedText("");
          paraIndex++;
          charIndex = 0;

          const holdBeforeNext = isEmphasis ? POST_EMPHASIS_PAUSE : 250;
          timeoutId = setTimeout(typeParagraph, holdBeforeNext);
          return;
        }

        const char = text[charIndex];
        charIndex++;
        setCurrentTypedText(text.slice(0, charIndex));

        const extraPause = (PAUSE_AFTER[char] ?? 0) * speedMultiplier;
        timeoutId = setTimeout(
          typeNextChar,
          BASE_SPEED * speedMultiplier + extraPause
        );
      };

      const startPause = isEmphasis ? PRE_EMPHASIS_PAUSE : 0;
      timeoutId = setTimeout(typeNextChar, startPause);
    };

    const startTimeout = setTimeout(typeParagraph, START_DELAY);

    return () => {
      cancelledRef.current = true;
      clearTimeout(startTimeout);
      clearTimeout(timeoutId);
    };
  }, [isInView, paragraphs]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const handleScroll = () => {
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;
      isUserScrolledAwayRef.current = distanceFromBottom > 40;
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (contentRef.current && !isUserScrolledAwayRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [completedCount, currentTypedText]);

  const skipToEnd = () => {
    if (!isTypingComplete) {
      cancelledRef.current = true; // stop any in-flight timers immediately
      setCompletedCount(paragraphs.length);
      setCurrentTypedText("");
      setIsTypingComplete(true);
      isUserScrolledAwayRef.current = false;
    }
  };

  return (
    <section ref={sectionRef} className={styles.letter}>
      <motion.h2
        className={styles.heading}
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        {config.messageTitle}
      </motion.h2>

      <motion.div
        className={styles.letterCard}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        onClick={skipToEnd}
      >
        <div className={styles.cornerTopLeft} />
        <div className={styles.cornerTopRight} />
        <div className={styles.cornerBottomLeft} />
        <div className={styles.cornerBottomRight} />

        <div className={styles.letterContent} ref={contentRef}>
          {paragraphs.slice(0, completedCount).map((text, i) => (
            <p
              key={i}
              className={
                i === EMPHASIS_INDEX
                  ? `${styles.messageParagraph} ${styles.emphasisParagraph}`
                  : styles.messageParagraph
              }
            >
              {text}
            </p>
          ))}

          {!isTypingComplete && currentTypedText && (
            <p
              className={
                completedCount === EMPHASIS_INDEX
                  ? `${styles.messageParagraph} ${styles.emphasisParagraph}`
                  : styles.messageParagraph
              }
            >
              {currentTypedText}
              <span className={styles.cursor}>|</span>
            </p>
          )}
        </div>

        {!isTypingComplete && (
          <span className={styles.skipHint}>tap to read the whole letter</span>
        )}
      </motion.div>

      <div className={styles.bgDecor1} />
      <div className={styles.bgDecor2} />
      <div className={styles.bgDecor3} />
    </section>
  );
}