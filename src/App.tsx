/* ==========================================
   Birthday Surprise App

   Single page with 4 sections that transition
   one by one (not scrollable)
   ========================================== */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { config, type MediaItem } from "./config";
import NameGate from "./components/NameGate";
import HeroSection from "./components/HeroSection";
import PhotoGallery from "./components/PhotoGallery";
import LetterSection from "./components/LetterSection";
import backgroundMusic from "./assets/music.mp3";
import "./App.css";
import GlimpseReveal from "./components/GlimpseReveal";
import { useSessionTracking } from "./hooks/useSessionTracking"; // NEW
// Import photos from assets/solo

//import p1 from "./assets/solo/p1.jpeg"
import p2 from "./assets/solo/p2.jpeg"
//import p3 from "./assets/solo/p3.jpeg"
import p4 from "./assets/solo/p4.jpeg"
import p7 from "./assets/solo/p7.jpeg"
import p8 from "./assets/solo/p8.jpeg"
import p9 from "./assets/solo/p9.jpeg"

import m1 from "./assets/solo/m1.mp4";
import m2 from "./assets/solo/m2.mp4";
import m3 from "./assets/solo/m3.mp4";
import m4 from "./assets/solo/m4.mp4";
//import m5 from "./assets/solo/m5.mp4";
//import m6 from "./assets/solo/m6.mp4";
import m1_poster from "./assets/solo/m1-poster.jpeg";
import m2_poster from "./assets/solo/m2-poster.jpeg";
import m3_poster from "./assets/solo/m3-poster.jpeg";
import m4_poster from "./assets/solo/m4-poster.jpeg";
//import m5_poster from "./assets/solo/m5-poster.jpeg";
//import m6_poster from "./assets/solo/m6-poster.jpeg";
import onlyplansImg from "./assets/onlyplans.jpg";
import bannerImg from "./assets/banner.gif";
import cakeImg from "./assets/cake.gif";




// Photo arrays
const SOLO_PHOTOS: MediaItem[] = [
  { type: "photo", src: p8 },
  { type: "video", src: m1, poster: m1_poster, caption: "strike😂" },
  { type: "photo", src: p2 },
  { type: "video", src: m4, poster: m4_poster },
  { type: "photo", src: p7 },
  { type: "video", src: m3, poster: m3_poster },
  { type: "video", src: m2 ,poster: m2_poster},
  { type: "photo", src: p4 },
  { type: "photo", src: p9 },
];


// Calculate total sections and indices based on config
// Sections: 0 = Hero, 1 = Solo Photos, 2 = Letter
const TOTAL_SECTIONS = 3;
const SECTION_LETTER = 2;

export default function App() {
  // Track which section is currently active (0 = Hero, 1 = Solo Photos, 2 = Together Photos, 3 = Letter)
  const [currentSection, setCurrentSection] = useState(0);

  // Audio state
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [phase, setPhase] = useState<"gate" | "glimpse" | "main">("gate");

  // NEW — logs a session (device, duration, sections reached) to your
  // Google Sheet whenever she leaves or backgrounds the tab
  useSessionTracking(() => currentSection + 1);

  useEffect(() => {
  // Preload the glimpse image
  new Image().src = onlyplansImg;

  // Preload the Hero section's banner + cake GIFs so they're
  // already cached by the time she reaches Hero — these are the
  // very first visuals she sees after the glimpse, and GIFs can
  // be surprisingly heavy files, so give them a head start too
  new Image().src = bannerImg;
  new Image().src = cakeImg;

  // Preload every photo and video poster in the gallery — these are
  // small (a few KB–hundred KB each) so it's safe to load them all
  // upfront, meaning by the time she reaches the gallery, every card
  // already has something to show instantly instead of a blank frame
  SOLO_PHOTOS.forEach((item) => {
    if (item.type === "photo") {
      new Image().src = item.src;
    } else if (item.poster) {
      new Image().src = item.poster;
    }
  });

  // Only warm up the actual video files for the first couple of clips
  // she'll reach almost immediately when scrolling the gallery.
  // The rest stay lazy — loaded only when they scroll into view,
  // exactly as PhotoGallery already handles.
  const videosToPreload = SOLO_PHOTOS.filter((item) => item.type === "video").slice(0, 2);

  videosToPreload.forEach((item) => {
    const video = document.createElement("video");
    video.src = item.src;
    video.preload = "auto";
  });
}, []);
  

  // Confetti effect - fires from both sides
  const runConfetti = () => {
    const end = Date.now() + 10 * 1000;
    const colors = [
      config.colors.primary,
      config.colors.medium,
      "#ffffff",
      config.colors.light,
    ];

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  // Handle successful name verification
  const handleVerified = () => {
    setPhase("glimpse");

    // Let the NameGate exit + glimpse animation play out, then reveal Hero
    setTimeout(() => {
      setPhase("main");
      runConfetti();
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }, 3400); // tune this — see note below
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Navigate to next section
  const goToNextSection = () => {
    setCurrentSection((prev) => Math.min(prev + 1, TOTAL_SECTIONS - 1));
  };

  // Animation variants for section transitions
  const sectionVariants = {
    initial: {
      opacity: 0,
      x: 100,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <div className="app">
      {/* Background Music */}
      <audio ref={audioRef} src={backgroundMusic} loop preload="auto" />

      <AnimatePresence mode="wait">
        {phase === "gate" && <NameGate key="gate" onVerified={handleVerified} />}
        {phase === "glimpse" && <GlimpseReveal key="glimpse" />}
      </AnimatePresence>


      {phase === "main" && (
        <button
          className="music-toggle"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute music" : "Mute music"}
        >
          {isMuted ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>
      )}

      {/* Main Content - only show after start */}
      {phase === "main" && (
        <AnimatePresence mode="wait">
          {currentSection === 0 && (
            <motion.div
              key="hero"
              variants={sectionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="section-wrapper"
            >
              <HeroSection onNextSection={goToNextSection} />
            </motion.div>
          )}

          {currentSection === 1 && (
            <motion.div
              key="solo-gallery"
              variants={sectionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="section-wrapper"
            >
              <PhotoGallery
                title={config.soloGalleryTitle}
                photos={SOLO_PHOTOS}
                buttonText={config.buttons.soloGallery}
                onNextSection={goToNextSection}
              />
            </motion.div>
          )}

          

          {currentSection === SECTION_LETTER && (
            <motion.div
              key="letter"
              variants={sectionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="section-wrapper"
            >
              <LetterSection />

              {/* Footer only shows on last section */}
              <footer className="footer">
                <p>{config.footerText}</p>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}