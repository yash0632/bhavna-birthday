// /* ==========================================
//    LetterSection Component

//    Displays a heartfelt message inside a letter-style
//    card with natural-paced typewriter animation.
//    One specific paragraph (the emotional core) types
//    slower and is visually set apart so it lands deeper.
//    ========================================== */

// import { useState, useEffect, useRef } from "react";
// import { motion, useInView } from "framer-motion";
// import styles from "./LetterSection.module.css";
// import { config } from "../config";

// const BASE_SPEED = 35;

// const PAUSE_AFTER: Record<string, number> = {
//   ",": 150,
//   "—": 150,
//   ":": 200,
//   ";": 200,
//   ".": 450,
//   "!": 450,
//   "?": 450,
// };

// const START_DELAY = 500;

// const EMPHASIS_INDEX = 4;
// const EMPHASIS_SPEED_MULTIPLIER = 1.9;
// const PRE_EMPHASIS_PAUSE = 1100;
// const POST_EMPHASIS_PAUSE = 1600;

// export default function LetterSection() {
//   // How many paragraphs (from the start) are fully typed.
//   // Derived rendering from this count makes duplicates structurally
//   // impossible — even if something fires this update twice for the
//   // same paragraph, Math.max() below makes it a harmless no-op.
//   const [completedCount, setCompletedCount] = useState(0);
//   const [currentTypedText, setCurrentTypedText] = useState("");
//   const [isTypingComplete, setIsTypingComplete] = useState(false);

//   const sectionRef = useRef<HTMLElement>(null);
//   const contentRef = useRef<HTMLDivElement>(null);
//   const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
//   const isUserScrolledAwayRef = useRef(false);

//   // Guards against the whole typing sequence ever starting twice
//   const hasStartedTypingRef = useRef(false);
//   // Extra safety net: if the effect is ever cleaned up mid-sequence
//   // (unmount, dev double-invoke, fast refresh), any timers already
//   // in flight check this before touching state, so a stray leftover
//   // callback can never sneak in an update after the fact
//   const cancelledRef = useRef(false);

//   const paragraphs = config.message;

//   useEffect(() => {
//     cancelledRef.current = false;

//     if (!isInView || hasStartedTypingRef.current) return;
//     hasStartedTypingRef.current = true;

//     let paraIndex = 0;
//     let charIndex = 0;
//     let timeoutId: ReturnType<typeof setTimeout>;

//     const typeParagraph = () => {
//       if (cancelledRef.current) return;

//       if (paraIndex >= paragraphs.length) {
//         setIsTypingComplete(true);
//         return;
//       }

//       const text = paragraphs[paraIndex];
//       const isEmphasis = paraIndex === EMPHASIS_INDEX;
//       const speedMultiplier = isEmphasis ? EMPHASIS_SPEED_MULTIPLIER : 1;

//       const typeNextChar = () => {
//         if (cancelledRef.current) return;

//         if (charIndex >= text.length) {
//           const finishedIndex = paraIndex;
//           // Math.max guarantees this can never move the count backwards
//           // or double-count — even a stray duplicate call is a no-op
//           setCompletedCount((prev) => Math.max(prev, finishedIndex + 1));
//           setCurrentTypedText("");
//           paraIndex++;
//           charIndex = 0;

//           const holdBeforeNext = isEmphasis ? POST_EMPHASIS_PAUSE : 250;
//           timeoutId = setTimeout(typeParagraph, holdBeforeNext);
//           return;
//         }

//         const char = text[charIndex];
//         charIndex++;
//         setCurrentTypedText(text.slice(0, charIndex));

//         const extraPause = (PAUSE_AFTER[char] ?? 0) * speedMultiplier;
//         timeoutId = setTimeout(
//           typeNextChar,
//           BASE_SPEED * speedMultiplier + extraPause
//         );
//       };

//       const startPause = isEmphasis ? PRE_EMPHASIS_PAUSE : 0;
//       timeoutId = setTimeout(typeNextChar, startPause);
//     };

//     const startTimeout = setTimeout(typeParagraph, START_DELAY);

//     return () => {
//       cancelledRef.current = true;
//       clearTimeout(startTimeout);
//       clearTimeout(timeoutId);
//     };
//   }, [isInView, paragraphs]);

//   useEffect(() => {
//     const el = contentRef.current;
//     if (!el) return;

//     const handleScroll = () => {
//       const distanceFromBottom =
//         el.scrollHeight - el.scrollTop - el.clientHeight;
//       isUserScrolledAwayRef.current = distanceFromBottom > 40;
//     };

//     el.addEventListener("scroll", handleScroll, { passive: true });
//     return () => el.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     if (contentRef.current && !isUserScrolledAwayRef.current) {
//       contentRef.current.scrollTop = contentRef.current.scrollHeight;
//     }
//   }, [completedCount, currentTypedText]);

//   const skipToEnd = () => {
//     if (!isTypingComplete) {
//       cancelledRef.current = true; // stop any in-flight timers immediately
//       setCompletedCount(paragraphs.length);
//       setCurrentTypedText("");
//       setIsTypingComplete(true);
//       isUserScrolledAwayRef.current = false;
//     }
//   };

//   return (
//     <section ref={sectionRef} className={styles.letter}>
//       <motion.h2
//         className={styles.heading}
//         initial={{ opacity: 0, y: -20 }}
//         animate={isInView ? { opacity: 1, y: 0 } : {}}
//         transition={{ duration: 0.6 }}
//       >
//         {config.messageTitle}
//       </motion.h2>

//       <motion.div
//         className={styles.letterCard}
//         initial={{ opacity: 0, y: 30, scale: 0.95 }}
//         animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
//         transition={{ duration: 0.6, delay: 0.2 }}
//         onClick={skipToEnd}
//       >
//         <div className={styles.cornerTopLeft} />
//         <div className={styles.cornerTopRight} />
//         <div className={styles.cornerBottomLeft} />
//         <div className={styles.cornerBottomRight} />

//         <div className={styles.letterContent} ref={contentRef}>
//           {paragraphs.slice(0, completedCount).map((text, i) => (
//             <p
//               key={i}
//               className={
//                 i === EMPHASIS_INDEX
//                   ? `${styles.messageParagraph} ${styles.emphasisParagraph}`
//                   : styles.messageParagraph
//               }
//             >
//               {text}
//             </p>
//           ))}

//           {!isTypingComplete && currentTypedText && (
//             <p
//               className={
//                 completedCount === EMPHASIS_INDEX
//                   ? `${styles.messageParagraph} ${styles.emphasisParagraph}`
//                   : styles.messageParagraph
//               }
//             >
//               {currentTypedText}
//               <span className={styles.cursor}>|</span>
//             </p>
//           )}
//         </div>

//         {!isTypingComplete && (
//           <span className={styles.skipHint}>tap to read the whole letter</span>
//         )}
//       </motion.div>

//       <div className={styles.bgDecor1} />
//       <div className={styles.bgDecor2} />
//       <div className={styles.bgDecor3} />
//     </section>
//   );
// }

/* ==========================================
   LetterSection Component

   A letter-style card with a natural-paced typewriter.

   She is given a choice right after the first greeting:
   read the whole letter, or just the birthday wishes.
   Neither is framed as the "right" one, nothing records
   what she picks, and she can change her mind any time:
     - while reading: "skip to the birthday wishes"
     - after the birthday wishes: "there's a longer note too"
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

const EMPHASIS_SPEED_MULTIPLIER = 1.9;
const PRE_EMPHASIS_PAUSE = 1100;
const POST_EMPHASIS_PAUSE = 1600;

// These two paragraphs are found by their opening words, so editing or
// reordering the message in config never breaks the choice or the emphasis.
const BIRTHDAY_MARKER = "Happy Birthday Once Again"; // where "just the wishes" begins
const EMPHASIS_MARKER = "I know making up this website"; // the emotional-core paragraph

type Phase = "greeting" | "choice" | "reading" | "done";
type Mode = "none" | "full" | "birthday";

const range = (from: number, to: number) =>
  Array.from({ length: Math.max(0, to - from) }, (_, i) => from + i);

export default function LetterSection() {
  const paragraphs = config.message;
  const total = paragraphs.length;

  const birthdayIndex = paragraphs.findIndex((p) =>
    p.trim().startsWith(BIRTHDAY_MARKER)
  );
  const emphasisIndex = paragraphs.findIndex((p) =>
    p.trim().startsWith(EMPHASIS_MARKER)
  );
  const canChoose = birthdayIndex > 1;

  const [completed, setCompleted] = useState<number[]>([]);
  const [current, setCurrent] = useState<{ index: number; text: string } | null>(
    null
  );
  const [phase, setPhase] = useState<Phase>("greeting");
  const [mode, setMode] = useState<Mode>("none");

  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const isUserScrolledAwayRef = useRef(false);

  // Typing engine bookkeeping. Every run gets an id; bumping the id cancels
  // whatever was in flight, so stale timers can never touch state.
  const runIdRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const activeQueueRef = useRef<number[]>([]);
  const activeDoneRef = useRef<() => void>(() => {});
  const hasStartedRef = useRef(false);

  const stopTyping = () => {
    runIdRef.current += 1;
    clearTimeout(timeoutRef.current);
  };

  /** Types the given paragraphs one after another, then calls onDone. */
  const runQueue = (queue: number[], onDone: () => void, delay = START_DELAY) => {
    stopTyping();
    const runId = runIdRef.current;
    const alive = () => runIdRef.current === runId;
    activeQueueRef.current = queue;
    activeDoneRef.current = onDone;

    let q = 0;

    const nextParagraph = () => {
      if (!alive()) return;
      if (q >= queue.length) {
        setCurrent(null);
        onDone();
        return;
      }

      const pIndex = queue[q];
      const chars = Array.from(paragraphs[pIndex]); // emoji-safe
      const isEmphasis = pIndex === emphasisIndex;
      const mult = isEmphasis ? EMPHASIS_SPEED_MULTIPLIER : 1;
      let charIndex = 0;

      const typeChar = () => {
        if (!alive()) return;

        if (charIndex >= chars.length) {
          setCompleted((prev) => (prev.includes(pIndex) ? prev : [...prev, pIndex]));
          setCurrent(null);
          q += 1;
          timeoutRef.current = setTimeout(
            nextParagraph,
            isEmphasis ? POST_EMPHASIS_PAUSE : 250
          );
          return;
        }

        charIndex += 1;
        setCurrent({ index: pIndex, text: chars.slice(0, charIndex).join("") });
        const pause = (PAUSE_AFTER[chars[charIndex - 1]] ?? 0) * mult;
        timeoutRef.current = setTimeout(typeChar, BASE_SPEED * mult + pause);
      };

      timeoutRef.current = setTimeout(
        typeChar,
        isEmphasis ? PRE_EMPHASIS_PAUSE : 0
      );
    };

    timeoutRef.current = setTimeout(nextParagraph, delay);
  };

  /* ---------- Flow ---------- */

  const startFullLetter = (fromScratch = false) => {
    setMode("full");
    setPhase("reading");
    if (fromScratch) {
      setCompleted([0]);
      setCurrent(null);
      isUserScrolledAwayRef.current = false;
      contentRef.current?.scrollTo({ top: 0 });
    }
    runQueue(range(1, total), () => setPhase("done"), fromScratch ? 700 : 400);
  };

  const startBirthdayOnly = () => {
    setMode("birthday");
    setPhase("reading");
    runQueue(range(birthdayIndex, total), () => setPhase("done"), 400);
  };

  // She changed her mind mid-way: stop and go straight to the birthday wishes
  const jumpToBirthday = () => {
    setCurrent(null);
    startBirthdayOnly();
  };

  // First, the greeting types on its own. Then she is asked.
  useEffect(() => {
    if (!isInView || hasStartedRef.current) return;
    hasStartedRef.current = true;

    runQueue([0], () => {
      if (canChoose) setPhase("choice");
      else startFullLetter();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  useEffect(() => () => stopTyping(), []);

  // Tap the card to show everything in the current stretch at once
  const finishNow = () => {
    if (phase !== "greeting" && phase !== "reading") return;
    stopTyping();
    const queue = activeQueueRef.current;
    setCompleted((prev) => Array.from(new Set([...prev, ...queue])));
    setCurrent(null);
    isUserScrolledAwayRef.current = false;
    activeDoneRef.current();
  };

  /* ---------- Scrolling ---------- */

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const handleScroll = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      isUserScrolledAwayRef.current = distanceFromBottom > 40;
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (contentRef.current && !isUserScrolledAwayRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [completed, current, phase]);

  /* ---------- Render helpers ---------- */

  const shown = [...completed].sort((a, b) => a - b);
  const paraClass = (i: number) =>
    i === emphasisIndex
      ? `${styles.messageParagraph} ${styles.emphasisParagraph}`
      : styles.messageParagraph;

  const reachedBirthday =
    completed.includes(birthdayIndex) ||
    (current !== null && current.index >= birthdayIndex);

  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation(); // don't also trigger "show it all at once"
    fn();
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
        onClick={finishNow}
      >
        <div className={styles.cornerTopLeft} />
        <div className={styles.cornerTopRight} />
        <div className={styles.cornerBottomLeft} />
        <div className={styles.cornerBottomRight} />

        <div className={styles.letterContent} ref={contentRef}>
          {shown.map((i) => (
            <p key={i} className={paraClass(i)}>
              {paragraphs[i]}
            </p>
          ))}

          {current && (
            <p className={paraClass(current.index)}>
              {current.text}
              <span className={styles.cursor}>|</span>
            </p>
          )}

          {/* The choice. Both options look the same on purpose. */}
          {phase === "choice" && (
            <motion.div
              className={styles.choiceBox}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className={styles.choiceText}>
                The rest of this has two parts: some thoughts and apologies from
                me, and then a birthday wish. Read whichever you like. It's your
                day, and both are completely fine.
              </p>
              <div className={styles.choiceButtons}>
                <button className={styles.choiceBtn} onClick={startBirthdayOnly}>
                  Just the birthday wishes 🎂
                </button>
                <button className={styles.choiceBtn} onClick={() => startFullLetter()}>
                  The whole letter ✉️
                </button>
              </div>
              <p className={styles.choiceNote}>you can change your mind any time</p>
            </motion.div>
          )}
        </div>

        {/* Quiet footer: hints and gentle ways to change course */}
        <div className={styles.cardFooter}>
          {(phase === "greeting" || phase === "reading") && (
            <span className={styles.skipHint}>tap to show it all at once</span>
          )}

          {phase === "reading" && mode === "full" && canChoose && !reachedBirthday && (
            <button className={styles.softLink} onClick={stop(jumpToBirthday)}>
              skip to the birthday wishes →
            </button>
          )}

          {phase === "done" && mode === "birthday" && canChoose && (
            <button className={styles.softLink} onClick={stop(() => startFullLetter(true))}>
              there's a longer note too, if you ever feel like reading it
            </button>
          )}
        </div>
      </motion.div>

      <div className={styles.bgDecor1} />
      <div className={styles.bgDecor2} />
      <div className={styles.bgDecor3} />
    </section>
  );
}