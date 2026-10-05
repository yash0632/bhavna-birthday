/* ==========================================
   HeroSection Component

   Displays the initial surprise with animated
   banner, cake GIF, floating ambience, a
   personalized shimmer greeting, and an
   interactive "make a wish" cake tap moment.
   ========================================== */

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import styles from "./HeroSection.module.css";
import { config } from "../config";
import bannerImg from "../assets/banner.gif";
import cakeImg from "../assets/cake.gif";
import wishChime from "../assets/wish-chime.mp3";

interface HeroSectionProps {
  onNextSection: () => void;
}

const PARTICLES = ["💗", "✨", "🎈", "💫", "🌸"];

const BALLOON_COLORS = [
  { body: "#f472b6", shade: "#be185d" }, // pink
  { body: "#fbcfe8", shade: "#ec4899" }, // light pink
  { body: "#c084fc", shade: "#7e22ce" }, // lavender
  { body: "#fde68a", shade: "#d97706" }, // soft gold
];

interface Balloon {
  id: number;
  left: number;
  color: { body: string; shade: string };
  riseDuration: number;
}

function makeBalloon(id: number): Balloon {
  return {
    id,
    left: 10 + Math.random() * 75,
    color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
    riseDuration: 7 + Math.random() * 4, // 7-11 seconds to float all the way up
  };
}

export default function HeroSection({ onNextSection }: HeroSectionProps) {
  const [showButton, setShowButton] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [wishMade, setWishMade] = useState(false);
  const [wishSent, setWishSent] = useState(false); // NEW
  const cakeWrapRef = useRef<HTMLDivElement>(null);
  const chimeRef = useRef<HTMLAudioElement>(null); // NEW
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const balloonIdRef = useRef(0);

  useEffect(() => {
    const greetingTimer = setTimeout(() => setShowGreeting(true), 200);
    const buttonTimer = setTimeout(() => setShowButton(true), 5000);
    return () => {
      clearTimeout(greetingTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        emoji: PARTICLES[i % PARTICLES.length],
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 8 + Math.random() * 6,
        size: 0.9 + Math.random() * 0.9,
      })),
    [],
  );

  // Little celebratory moment triggered by her, not just played at her.
  // A gentle heart-burst confetti fired from wherever the cake actually
  // sits on screen, plus a bounce + glow shift on the cake itself.
  const handleMakeWish = () => {
    if (wishMade) return;
    setWishMade(true);

    // Play the chime immediately on tap — the audio cue IS the
    // moment, so it should fire with zero delay, same instant as the tap
    if (chimeRef.current) {
      chimeRef.current.currentTime = 0;
      chimeRef.current.volume = 0.5; // soft, not jarring
      chimeRef.current.play().catch(() => {
        // Autoplay restrictions sometimes block this on first interaction
        // in some browsers — safe to ignore, confetti still plays regardless
      });
    }

    const rect = cakeWrapRef.current?.getBoundingClientRect();
    const origin = rect
      ? {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        }
      : { x: 0.5, y: 0.55 };

    confetti({
      particleCount: 40,
      spread: 70,
      startVelocity: 28,
      scalar: 0.9,
      shapes: ["circle"],
      colors: ["#f472b6", "#ec4899", "#fbcfe8", "#ffffff"],
      origin,
    });

    setTimeout(() => {
      setWishSent(true);
    }, 1200);

    setTimeout(() => {
      const initial = Array.from({ length: 8 }, () => {
        balloonIdRef.current += 1;
        return makeBalloon(balloonIdRef.current);
      });
      setBalloons(initial);
    }, 1800);
  };

  const popBalloon = (id: number, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 10,
      spread: 50,
      startVelocity: 14,
      scalar: 0.5,
      gravity: 0.9,
      colors: ["#f472b6", "#fbcfe8", "#ffffff"],
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
    });

    // Remove the popped one, add a fresh one in its place
    balloonIdRef.current += 1;
    const replacement = makeBalloon(balloonIdRef.current);

    setBalloons((prev) => [...prev.filter((b) => b.id !== id), replacement]);
  };

  const replaceBalloon = (id: number) => {
  setBalloons((prev) => {
    // Only replace if it's still in the list (wasn't already popped manually)
    const stillPresent = prev.some((b) => b.id === id);
    if (!stillPresent) return prev;

    balloonIdRef.current += 1;
    const replacement = makeBalloon(balloonIdRef.current);
    return [...prev.filter((b) => b.id !== id), replacement];
  });
};

  return (
    <section className={styles.hero}>
      {/* Soft cinematic spotlight breathing behind everything */}
      <motion.div
        className={styles.spotlight}
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating ambient particles */}
      <div className={styles.particleField} aria-hidden="true">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className={styles.particle}
            style={{ left: `${p.left}%`, fontSize: `${p.size}rem` }}
            initial={{ y: "110vh", opacity: 0 }}
            animate={{ y: "-10vh", opacity: [0, 1, 1, 0] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </div>

      {/* Personalized shimmer greeting */}
      {showGreeting && (
        <motion.p
          className={styles.greeting}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Happy Birthday,{" "}
          <span className={styles.shimmerName}>{config.recipientName}</span> 🎂
        </motion.p>
      )}

      {/* Banner Image */}
      <motion.img
        src={bannerImg}
        alt="Banner"
        className={styles.banner}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
      />
      <audio ref={chimeRef} src={wishChime} preload="auto" />
      {/* Birthday Cake — tappable to make a wish */}
      <div
  className={styles.cakeWrap}
  ref={cakeWrapRef}
  onClick={handleMakeWish}
  role="button"
  tabIndex={0}
  aria-label="Tap the cake to make a wish"
  onKeyDown={(e) => e.key === "Enter" && handleMakeWish()}
>
  {/* Existing ambient glow stays as-is */}
  <motion.div
    className={styles.cakeGlow}
    animate={
      wishMade
        ? { opacity: [0.4, 0.9, 0.5], scale: [0.9, 1.25, 1.05] }
        : { opacity: [0.4, 0.7, 0.4], scale: [0.9, 1.05, 0.9] }
    }
    transition={{
      duration: wishMade ? 1 : 3,
      repeat: wishMade ? 0 : Infinity,
      ease: "easeInOut",
      delay: wishMade ? 0 : 1.2,
    }}
  />

  {/* NEW — pulsing "tap me" rings, only shown before the wish is made */}
  {!wishMade && (
  <>
    <motion.div
      className={styles.tapRing}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: [0.5, 1.4], opacity: [0, 0.8, 0] }}
      transition={{
        duration: 2.4,
        repeat: Infinity,
        ease: "easeOut",
        delay: 2,
        times: [0, 0.3, 1],
      }}
    />
    <motion.div
      className={styles.tapRing}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: [0.5, 1.4], opacity: [0, 0.8, 0] }}
      transition={{
        duration: 2.4,
        repeat: Infinity,
        ease: "easeOut",
        delay: 3.2,
        times: [0, 0.3, 1],
      }}
    />
  </>
)}

  <motion.img
    src={cakeImg}
    alt="Birthday Cake"
    className={styles.cakeGif}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={
      wishMade
        ? { opacity: 1, scale: [1, 1.12, 1], rotate: [0, -3, 3, 0] }
        : { opacity: 1, scale: 1 }
    }
    transition={{
      duration: wishMade ? 0.6 : 0.6,
      delay: wishMade ? 0 : 0.8,
      ease: "easeOut",
    }}
    whileHover={!wishMade ? { scale: 1.04 } : {}}
  />

  {!wishMade && (
    <motion.span
      className={styles.wishHint}
      initial={{ opacity: 0, y: 6 }}
      animate={{
        opacity: [0.85, 1, 0.85],
        y: [0, -4, 0],
      }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2, // sync with the rings starting
      }}
    >
      tap to make a wish ✨
    </motion.span>
  )}

  {wishMade && (
    <motion.span
      className={styles.wishMadeText}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      wish made 🌟 may it come true
    </motion.span>
  )}
</div>

      {/* The wish itself, drifting upward and away a few seconds after being made */}
      <AnimatePresence>
        {wishSent && (
          <motion.div
            className={styles.wishOrb}
            initial={{
              opacity: 0,
              scale: 0.6,
              left: cakeWrapRef.current
                ? cakeWrapRef.current.getBoundingClientRect().left +
                  cakeWrapRef.current.getBoundingClientRect().width / 2
                : "50%",
              top: cakeWrapRef.current
                ? cakeWrapRef.current.getBoundingClientRect().top
                : "55%",
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.6, 1, 0.8, 0.4],
              y: -400,
              x: [0, 15, -10, 20],
            }}
            transition={{
              duration: 4.5,
              ease: "easeOut",
              times: [0, 0.15, 0.7, 1],
            }}
            onAnimationComplete={() => setWishSent(false)}
          >
            ✨
          </motion.div>
        )}
      </AnimatePresence>

      {/* Soft encouraging subtitle */}
      <motion.p
        className={styles.subtitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
      >
        a little something made just for you...
      </motion.p>

      {/* Next Surprise Button */}
      <motion.button
        className={`btn-primary ${styles.nextButton}`}
        onClick={onNextSection}
        initial={{ opacity: 0, y: 12 }}
        animate={{
          opacity: showButton ? 1 : 0,
          y: showButton ? 0 : 12,
        }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        whileHover={
          showButton
            ? { scale: 1.05, transition: { duration: 0.4, ease: "easeOut" } }
            : {}
        }
        whileTap={showButton ? { scale: 0.95 } : {}}
        style={{
          pointerEvents: showButton ? "auto" : "none",
          marginTop: "3rem",
        }}
      >
        <span className={styles.buttonShine} />
        {config.buttons.hero} <span className={styles.arrow}>→</span>
      </motion.button>

      {/* Decorative Elements */}
      <div className={styles.decorativeCircle1} />
      <div className={styles.decorativeCircle2} />

      {/* ==========================================
    Quiet callback — the train rides home,
    Ludo on the phone between stations
   ========================================== */}
      <div className={styles.railwayScene} aria-hidden="true">
        {/* Realistic track — ballast bed, wooden sleepers, twin rails */}
        <div className={styles.track}>
          <div className={styles.ballast} />
          <div className={styles.sleepers}>
            {Array.from({ length: 40 }).map((_, i) => (
              <span key={i} className={styles.sleeper} />
            ))}
          </div>
          <div className={styles.railTop} />
          <div className={styles.railBottom} />
        </div>

        {/* The train — a commuter EMU, side profile, crossing once */}
        <motion.div
          className={styles.train}
          initial={{ x: "-18vw", scaleX: 1 }}
          animate={{
            x: ["-18vw", "118vw", "118vw", "-18vw", "-18vw"],
            scaleX: [1, 1, -1, -1, 1],
          }}
          transition={{
            duration: 18,
            delay: 2.5,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.47, 0.5, 0.97, 1],
          }}
        >
          <svg viewBox="0 0 400 110" className={styles.trainSvg}>
            {/* Pantograph (the arm on top that connects to overhead wires) */}
            <line
              x1="60"
              y1="18"
              x2="80"
              y2="2"
              stroke="#4a4a5e"
              strokeWidth="2"
            />
            <line
              x1="80"
              y1="2"
              x2="100"
              y2="18"
              stroke="#4a4a5e"
              strokeWidth="2"
            />
            <rect x="56" y="16" width="8" height="3" fill="#4a4a5e" />
            <rect x="96" y="16" width="8" height="3" fill="#4a4a5e" />

            {/* Main coach body */}
            <rect x="4" y="18" width="392" height="58" rx="10" fill="#ec4899" />
            <rect
              x="4"
              y="18"
              width="392"
              height="58"
              rx="10"
              fill="url(#bodyShade)"
            />

            {/* Roof line accent */}
            <rect x="4" y="18" width="392" height="8" rx="4" fill="#be185d" />

            {/* Lower skirt / undercarriage band */}
            <rect x="4" y="68" width="392" height="10" fill="#9d174d" />

            {/* Row of commuter windows */}
            {/* Row of commuter windows — three carry the ludo/train memory */}
            {Array.from({ length: 9 }).map((_, i) => {
              const x = 22 + i * 42;

              // Window index 3: boy
              if (i === 3) {
                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y="30"
                      width="28"
                      height="24"
                      rx="4"
                      fill="#fff7fb"
                      stroke="#be185d"
                      strokeWidth="1.5"
                    />
                    <text x={x + 14} y="49" fontSize="15" textAnchor="middle">
                      🧑
                    </text>
                  </g>
                );
              }

              // Window index 4: the dice, between them
              if (i === 4) {
                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y="30"
                      width="28"
                      height="24"
                      rx="4"
                      fill="#fff7fb"
                      stroke="#be185d"
                      strokeWidth="1.5"
                    />
                    <text x={x + 14} y="49" fontSize="15" textAnchor="middle">
                      🎲
                    </text>
                  </g>
                );
              }

              // Window index 5: girl
              if (i === 5) {
                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y="30"
                      width="28"
                      height="24"
                      rx="4"
                      fill="#fff7fb"
                      stroke="#be185d"
                      strokeWidth="1.5"
                    />
                    <text x={x + 14} y="49" fontSize="15" textAnchor="middle">
                      👧
                    </text>
                  </g>
                );
              }

              // All other windows: plain, as before
              return (
                <rect
                  key={i}
                  x={x}
                  y="30"
                  width="28"
                  height="24"
                  rx="4"
                  fill="#fdf2f8"
                  stroke="#be185d"
                  strokeWidth="1.5"
                />
              );
            })}
            {/* {Array.from({ length: 9 }).map((_, i) => (
              <rect
                key={i}
                x={22 + i * 42}
                y="30"
                width="28"
                height="24"
                rx="4"
                fill="#fdf2f8"
                stroke="#be185d"
                strokeWidth="1.5"
              />
            ))} */}

            {/* The one window with a tiny glimpse inside — ludo die on the sill */}
            {/* <rect
              x="190"
              y="30"
              width="28"
              height="24"
              rx="4"
              fill="#fff7fb"
              stroke="#be185d"
              strokeWidth="1.5"
            />
            <text x="204" y="49" fontSize="15" textAnchor="middle">
              🎲
            </text> */}

            {/* Door */}
            <rect
              x="352"
              y="28"
              width="26"
              height="42"
              rx="3"
              fill="#fbcfe8"
              stroke="#be185d"
              strokeWidth="1.5"
            />
            <line
              x1="365"
              y1="28"
              x2="365"
              y2="70"
              stroke="#be185d"
              strokeWidth="1"
            />

            {/* Destination board */}
            <rect x="120" y="20" width="60" height="7" rx="2" fill="#1a1a2e" />
            <g transform={`scale(${/* this needs runtime access */ 1}, 1)`}>
              <text
                x="150"
                y="25.5"
                fontSize="5"
                fill="#fbcfe8"
                textAnchor="middle"
              >
                HOME ↠
              </text>
            </g>

            {/* Wheel bogies */}
            <rect x="40" y="76" width="70" height="8" rx="2" fill="#4a4a5e" />
            <rect x="290" y="76" width="70" height="8" rx="2" fill="#4a4a5e" />

            {/* <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
              style={{ originX: "58px", originY: "92px" }}
            >
              <circle cx="58" cy="92" r="9" fill="#2d2d3f" />
              <circle cx="58" cy="92" r="3" fill="#8b8b9e" />
            </motion.g>
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
              style={{ originX: "92px", originY: "92px" }}
            >
              <circle cx="92" cy="92" r="9" fill="#2d2d3f" />
              <circle cx="92" cy="92" r="3" fill="#8b8b9e" />
            </motion.g>
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
              style={{ originX: "308px", originY: "92px" }}
            >
              <circle cx="308" cy="92" r="9" fill="#2d2d3f" />
              <circle cx="308" cy="92" r="3" fill="#8b8b9e" />
            </motion.g>
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
              style={{ originX: "342px", originY: "92px" }}
            >
              <circle cx="342" cy="92" r="9" fill="#2d2d3f" />
              <circle cx="342" cy="92" r="3" fill="#8b8b9e" />
            </motion.g> */}

            {/* Static wheels — visual only, no rotation */}
            {/* <circle cx="58" cy="92" r="9" fill="#2d2d3f" />
            <circle cx="58" cy="92" r="3" fill="#8b8b9e" />
            <circle cx="92" cy="92" r="9" fill="#2d2d3f" />
            <circle cx="92" cy="92" r="3" fill="#8b8b9e" />
            <circle cx="308" cy="92" r="9" fill="#2d2d3f" />
            <circle cx="308" cy="92" r="3" fill="#8b8b9e" />
            <circle cx="342" cy="92" r="9" fill="#2d2d3f" />
            <circle cx="342" cy="92" r="3" fill="#8b8b9e" /> */}

            <defs>
              <linearGradient id="bodyShade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>

      {/* Bonus balloons — unlocked after the wish, poppable, replenishing */}
      <AnimatePresence>
  {balloons.map((balloon) => (
    <motion.div
      key={balloon.id}
      className={styles.balloonWrap}
      style={{ left: `${balloon.left}%` }}
      initial={{ y: "20vh", opacity: 0, scale: 0.7 }}
      animate={{
        y: "-120vh",
        opacity: [0, 1, 1, 0.8, 0],
        x: [0, 12, -10, 15, 0],
        scale: 1,
      }}
      exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
      transition={{
        y: { duration: balloon.riseDuration, ease: "linear" },
        x: { duration: balloon.riseDuration, ease: "easeInOut" },
        opacity: { duration: balloon.riseDuration, times: [0, 0.08, 0.75, 0.9, 1] },
        scale: { duration: 0.5, ease: "easeOut" },
      }}
      onAnimationComplete={() => replaceBalloon(balloon.id)}
      onClick={(e) => popBalloon(balloon.id, e)}
      whileTap={{ scale: 0.85 }}
    >
      <svg viewBox="0 0 60 80" className={styles.balloonSvg}>
        <defs>
          <radialGradient id={`balloonGrad-${balloon.id}`} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="35%" stopColor={balloon.color.body} stopOpacity="1" />
            <stop offset="100%" stopColor={balloon.color.shade} stopOpacity="1" />
          </radialGradient>
        </defs>
        <ellipse cx="30" cy="32" rx="26" ry="30" fill={`url(#balloonGrad-${balloon.id})`} />
        <ellipse cx="21" cy="18" rx="7" ry="10" fill="#ffffff" opacity="0.4" />
        <path d="M26 60 Q30 66 34 60 L30 56 Z" fill={balloon.color.shade} />
        <path
          d="M30 62 Q24 68 30 74 Q36 80 30 86"
          stroke={balloon.color.shade}
          strokeWidth="1.2"
          fill="none"
          opacity="0.6"
        />
      </svg>
    </motion.div>
  ))}
</AnimatePresence>
    </section>
  );
}
