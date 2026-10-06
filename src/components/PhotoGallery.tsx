/* ==========================================
   PhotoGallery Component - Living Polaroid Gallery

   Tap a card to view it full-size in a lightbox.
   Tap the heart to mark a memory as a favorite —
   it gets a soft permanent glow and a little
   heart-burst moment.
   ========================================== */

// import { useMemo, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import confetti from "canvas-confetti";
// import styles from "./PhotoGallery.module.css";
// import { useInView } from "../hooks/useInView";
// import type { MediaItem } from "../config";

// interface PhotoGalleryProps {
//   title: string;
//   photos: MediaItem[];
//   buttonText: string;
//   onNextSection: () => void;
// }

// const ROTATIONS = [-3, 2, -2, 3, -1, 2, -3, 2, -2];

// function MemoryCard({
//   item,
//   index,
//   wobble,
//   isFavorited,
//   onToggleFavorite,
//   onExpand,
// }: {
//   item: MediaItem;
//   index: number;
//   wobble: { base: number; keyframes: number[]; duration: number; delay: number };
//   isFavorited: boolean;
//   onToggleFavorite: (index: number, cardEl: HTMLDivElement | null) => void;
//   onExpand: (index: number) => void;
// }) {
//   const { ref, isInView } = useInView("250px");
//   const [isLoaded, setIsLoaded] = useState(false);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const cardObserver = useInView("0px");
//   const cardElRef = useRef<HTMLDivElement | null>(null);

//   return (
//     <motion.div
//       ref={(node) => {
//         (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
//         (cardObserver.ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
//         cardElRef.current = node;
//       }}
//       className={styles.photoFrame}
//       initial={{ opacity: 0, scale: 0.9, rotate: wobble.base }}
//       animate={{ opacity: 1, scale: 1, rotate: wobble.keyframes }}
//       transition={{
//         opacity: { duration: 0.5, delay: index * 0.08, ease: "easeOut" },
//         scale: { duration: 0.5, delay: index * 0.08, ease: "easeOut" },
//         rotate: {
//           duration: wobble.duration,
//           delay: index * 0.08 + wobble.delay,
//           repeat: Infinity,
//           repeatType: "mirror",
//           ease: "easeInOut",
//         },
//       }}
//       whileHover={{
//         scale: 1.08,
//         rotate: 0,
//         zIndex: 20,
//         transition: { duration: 0.25, ease: "easeOut" },
//       }}
//       whileTap={{ scale: 1.03 }}
//     >
//       <div
//         className={`${styles.polaroid} ${isFavorited ? styles.polaroidFavorited : ""}`}
//         onClick={() => onExpand(index)}
//       >
//         {!isLoaded && <div className={styles.shimmer} />}

//         {isInView && item.type === "video" && (
//           <video
//             ref={videoRef}
//             className={styles.photo}
//             src={item.src}
//             poster={item.poster}
//             autoPlay={cardObserver.isInView}
//             loop
//             muted
//             playsInline
//             preload="metadata"
//             disablePictureInPicture
//             onLoadedData={() => setIsLoaded(true)}
//             style={{ opacity: isLoaded ? 1 : 0 }}
//           />
//         )}

//         {isInView && item.type === "photo" && (
//           <img
//             src={item.src}
//             alt={`Memory ${index + 1}`}
//             className={styles.photo}
//             draggable={false}
//             loading="lazy"
//             decoding="async"
//             onLoad={() => setIsLoaded(true)}
//             style={{ opacity: isLoaded ? 1 : 0 }}
//           />
//         )}

//         {item.type === "video" && isLoaded && (
//           <span className={styles.videoBadge}>♥</span>
//         )}

//         {isLoaded && (
//           <button
//             className={`${styles.favoriteButton} ${isFavorited ? styles.favoriteButtonActive : ""}`}
//             onClick={(e) => {
//               e.stopPropagation(); // don't also trigger the lightbox
//               onToggleFavorite(index, cardElRef.current);
//             }}
//             aria-label={isFavorited ? "Remove from favorites" : "Mark as favorite"}
//           >
//             {isFavorited ? "❤" : "🤍"}
//           </button>
//         )}

//         {isLoaded && (
//           <span className={styles.caption}>{item.caption ?? " "}</span>
//         )}
//       </div>
//     </motion.div>
//   );
// }

// export default function PhotoGallery({
//   title,
//   photos,
//   buttonText,
//   onNextSection,
// }: PhotoGalleryProps) {
//   const [favorited, setFavorited] = useState<Set<number>>(new Set());
//   const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

//   const wobbles = useMemo(
//     () =>
//       photos.map((_, i) => {
//         const base = ROTATIONS[i % ROTATIONS.length];
//         return {
//           base,
//           keyframes: [base - 1.8, base + 1.8, base - 1.8],
//           duration: 3.2 + (i % 4) * 0.4,
//           delay: (i % 5) * 0.3,
//         };
//       }),
//     [photos]
//   );

//   const handleToggleFavorite = (index: number, cardEl: HTMLDivElement | null) => {
//     setFavorited((prev) => {
//       const next = new Set(prev);
//       const wasAlreadyFavorited = next.has(index);

//       if (wasAlreadyFavorited) {
//         next.delete(index);
//       } else {
//         next.add(index);

//         // Little heart burst right from where the card actually sits
//         const rect = cardEl?.getBoundingClientRect();
//         const origin = rect
//           ? {
//               x: (rect.left + rect.width / 2) / window.innerWidth,
//               y: (rect.top + rect.height / 2) / window.innerHeight,
//             }
//           : { x: 0.5, y: 0.5 };

//         confetti({
//           particleCount: 18,
//           spread: 50,
//           startVelocity: 18,
//           scalar: 0.7,
//           gravity: 0.6,
//           colors: ["#f472b6", "#ec4899", "#fbcfe8"],
//           origin,
//         });
//       }

//       return next;
//     });
//   };

//   const favoritedCount = favorited.size;

//   return (
//     <section className={styles.gallery}>
//       <div className={styles.sideBorderLeft}>
//         <span className={styles.borderDot} />
//         <span className={styles.borderHeart}>♡</span>
//         <span className={styles.borderDot} />
//         <span className={styles.borderHeart}>❤</span>
//         <span className={styles.borderDot} />
//         <span className={styles.borderHeart}>♡</span>
//         <span className={styles.borderDot} />
//       </div>
//       <div className={styles.sideBorderRight}>
//         <span className={styles.borderDot} />
//         <span className={styles.borderHeart}>♡</span>
//         <span className={styles.borderDot} />
//         <span className={styles.borderHeart}>❤</span>
//         <span className={styles.borderDot} />
//         <span className={styles.borderHeart}>♡</span>
//         <span className={styles.borderDot} />
//       </div>

//       <motion.h2
//         className={styles.heading}
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         {title}
//       </motion.h2>

//       <motion.p
//         className={styles.gallerySubtitle}
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.4, duration: 0.6 }}
//       >
//         tap any memory to look closer, tap the heart to keep it close ✨
//       </motion.p>

//       <div className={styles.photoGrid}>
//         {photos.map((item, index) => (
//           <MemoryCard
//             key={index}
//             item={item}
//             index={index}
//             wobble={wobbles[index]}
//             isFavorited={favorited.has(index)}
//             onToggleFavorite={handleToggleFavorite}
//             onExpand={setExpandedIndex}
//           />
//         ))}
//       </div>

//       {favoritedCount > 0 && (
//         <motion.p
//           className={styles.favoriteCount}
//           initial={{ opacity: 0, y: 6 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           {favoritedCount} {favoritedCount === 1 ? "memory" : "memories"} close to your heart 💕
//         </motion.p>
//       )}

//       <motion.button
//         className={`btn-primary ${styles.continueButton}`}
//         onClick={onNextSection}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 1, duration: 0.5 }}
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.98 }}
//       >
//         {buttonText}
//       </motion.button>

//       {/* Lightbox — full-size view of the tapped memory */}
//       <AnimatePresence>
//         {expandedIndex !== null && (
//           <motion.div
//             className={styles.lightboxOverlay}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setExpandedIndex(null)}
//           >
//             <motion.div
//               className={styles.lightboxContent}
//               initial={{ scale: 0.85, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               transition={{ type: "spring", stiffness: 260, damping: 22 }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <button
//                 className={styles.lightboxClose}
//                 onClick={() => setExpandedIndex(null)}
//                 aria-label="Close"
//               >
//                 ✕
//               </button>

//               {photos[expandedIndex].type === "video" ? (
//                 <video
//                   className={styles.lightboxMedia}
//                   src={photos[expandedIndex].src}
//                   poster={photos[expandedIndex].poster}
//                   autoPlay
//                   loop
//                   muted
//                   playsInline
//                   controls
//                 />
//               ) : (
//                 <img
//                   className={styles.lightboxMedia}
//                   src={photos[expandedIndex].src}
//                   alt={`Memory ${expandedIndex + 1}`}
//                 />
//               )}

//               {photos[expandedIndex].caption && (
//                 <p className={styles.lightboxCaption}>
//                   {photos[expandedIndex].caption}
//                 </p>
//               )}
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </section>
//   );
// }


/* ==========================================
   PhotoGallery - Living Polaroid Gallery

   Entrance: the photos are "dealt" from the bottom of the
   screen, one by one, tilted, landing with a little bounce.
   Captions and hearts appear once everything has settled.
   Exit: the photos are gathered up and tucked away toward
   the centre, like being slipped into an envelope.
   Tap anywhere while dealing to skip straight to the end.
   ========================================== */

// import { useEffect, useMemo, useRef, useState } from "react";
// import {
//   motion,
//   AnimatePresence,
//   useAnimationControls,
// } from "framer-motion";
// import confetti from "canvas-confetti";
// import styles from "./PhotoGallery.module.css";
// import { useInView } from "../hooks/useInView";
// import type { MediaItem } from "../config";

// interface PhotoGalleryProps {
//   title: string;
//   photos: MediaItem[];
//   buttonText: string;
//   onNextSection: () => void;
// }

// const ROTATIONS = [-3, 2, -2, 3, -1, 2, -3, 2, -2];

// const START_DELAY = 0.7; // the table is empty for a beat first
// const STAGGER = 0.12; // flick, flick, flick
// const SETTLE = 0.9; // time for the last card to finish bouncing
// const GATHER_MS = 1050; // how long the tuck-away takes

// type Wobble = { base: number; duration: number; delay: number };

// function MemoryCard({
//   item,
//   index,
//   total,
//   wobble,
//   isFavorited,
//   revealed,
//   skip,
//   gathering,
//   onToggleFavorite,
//   onExpand,
// }: {
//   item: MediaItem;
//   index: number;
//   total: number;
//   wobble: Wobble;
//   isFavorited: boolean;
//   revealed: boolean;
//   skip: boolean;
//   gathering: boolean;
//   onToggleFavorite: (index: number, cardEl: HTMLDivElement | null) => void;
//   onExpand: (index: number) => void;
// }) {
//   const [isLoaded, setIsLoaded] = useState(false);
//   const cardObserver = useInView("0px");
//   const cardElRef = useRef<HTMLDivElement | null>(null);
//   const controls = useAnimationControls();

//   // Each card starts below the screen, fanned out from the bottom centre,
//   // thrown at its own random angle.
//   const start = useMemo(
//     () => ({
//       x: (1 - (index % 3)) * 160,
//       y: typeof window !== "undefined" ? window.innerHeight : 900,
//       rotate: Math.random() * 44 - 22,
//     }),
//     [index]
//   );

//   const landed = {
//     x: 0,
//     y: 0,
//     scale: 1,
//     opacity: 1,
//     rotate: wobble.base,
//   };

//   // The deal
//   useEffect(() => {
//     const delay = START_DELAY + index * STAGGER;
//     controls.start({
//       ...landed,
//       transition: {
//         type: "spring",
//         stiffness: 150,
//         damping: 13,
//         mass: 0.9,
//         delay,
//         opacity: { duration: 0.25, delay },
//       },
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Skip: everything lands right now
//   useEffect(() => {
//     if (!skip) return;
//     controls.start({
//       ...landed,
//       transition: { type: "tween", duration: 0.25, ease: "easeOut" },
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [skip]);

//   // Exit: gather toward the centre of the screen, last card first
//   useEffect(() => {
//     if (!gathering) return;
//     const r = cardElRef.current?.getBoundingClientRect();
//     const dx = r ? window.innerWidth / 2 - (r.left + r.width / 2) : 0;
//     const dy = r ? window.innerHeight / 2 - (r.top + r.height / 2) : 0;
//     controls.start({
//       x: dx,
//       y: dy,
//       scale: 0.25,
//       opacity: 0,
//       rotate: wobble.base + (index % 2 ? 14 : -14),
//       transition: {
//         duration: 0.6,
//         delay: (total - 1 - index) * 0.04,
//         ease: [0.6, 0, 0.4, 1],
//       },
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [gathering]);

//   const fade = {
//     opacity: revealed ? 1 : 0,
//     transition: "opacity 0.6s ease",
//   };

//   return (
//     <motion.div
//       ref={(node) => {
//         (cardObserver.ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
//         cardElRef.current = node;
//       }}
//       className={styles.photoFrame}
//       initial={{ opacity: 0, scale: 0.7, ...start }}
//       animate={controls}
//       whileHover={{ zIndex: 20 }}
//     >
//       {/* Inner layer: the gentle idle wobble starts only after landing */}
//       <motion.div
//         animate={{ rotate: [0, 1.8, 0, -1.8, 0] }}
//         transition={{
//           duration: wobble.duration * 1.6,
//           delay: START_DELAY + index * STAGGER + SETTLE + wobble.delay,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//         whileHover={{
//           scale: 1.08,
//           rotate: -wobble.base,
//           transition: { duration: 0.25, ease: "easeOut" },
//         }}
//         whileTap={{ scale: 1.03 }}
//       >
//         <div
//           className={`${styles.polaroid} ${isFavorited ? styles.polaroidFavorited : ""}`}
//           onClick={() => onExpand(index)}
//         >
//           {!isLoaded && <div className={styles.shimmer} />}

//           {item.type === "video" && (
//             <video
//               className={styles.photo}
//               src={item.src}
//               poster={item.poster}
//               autoPlay={cardObserver.isInView}
//               loop
//               muted
//               playsInline
//               preload="metadata"
//               disablePictureInPicture
//               onLoadedData={() => setIsLoaded(true)}
//               style={{ opacity: isLoaded ? 1 : 0 }}
//             />
//           )}

//           {item.type === "photo" && (
//             <img
//               src={item.src}
//               alt={`Memory ${index + 1}`}
//               className={styles.photo}
//               draggable={false}
//               decoding="async"
//               onLoad={() => setIsLoaded(true)}
//               style={{ opacity: isLoaded ? 1 : 0 }}
//             />
//           )}

//           {item.type === "video" && isLoaded && (
//             <span className={styles.videoBadge} style={fade}>
//               ♥
//             </span>
//           )}

//           {isLoaded && (
//             <button
//               className={`${styles.favoriteButton} ${isFavorited ? styles.favoriteButtonActive : ""}`}
//               style={fade}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onToggleFavorite(index, cardElRef.current);
//               }}
//               aria-label={isFavorited ? "Remove from favorites" : "Mark as favorite"}
//             >
//               {isFavorited ? "❤" : "🤍"}
//             </button>
//           )}

//           {isLoaded && (
//             <span className={styles.caption} style={fade}>
//               {item.caption ?? " "}
//             </span>
//           )}
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

// export default function PhotoGallery({
//   title,
//   photos,
//   buttonText,
//   onNextSection,
// }: PhotoGalleryProps) {
//   const [favorited, setFavorited] = useState<Set<number>>(new Set());
//   const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
//   const [revealed, setRevealed] = useState(false);
//   const [skip, setSkip] = useState(false);
//   const [gathering, setGathering] = useState(false);

//   // Once the last polaroid has landed, bring in captions, hearts and the button
//   useEffect(() => {
//     const t = setTimeout(
//       () => setRevealed(true),
//       (START_DELAY + (photos.length - 1) * STAGGER + SETTLE) * 1000
//     );
//     return () => clearTimeout(t);
//   }, [photos.length]);

//   const handleSkip = () => {
//     if (revealed || skip) return;
//     setSkip(true);
//     setRevealed(true);
//   };

//   const handleContinue = () => {
//     if (gathering) return;
//     setGathering(true);
//     setTimeout(onNextSection, GATHER_MS);
//   };

//   const wobbles = useMemo<Wobble[]>(
//     () =>
//       photos.map((_, i) => ({
//         base: ROTATIONS[i % ROTATIONS.length],
//         duration: 3.2 + (i % 4) * 0.4,
//         delay: (i % 5) * 0.3,
//       })),
//     [photos]
//   );

//   const handleToggleFavorite = (index: number, cardEl: HTMLDivElement | null) => {
//     setFavorited((prev) => {
//       const next = new Set(prev);
//       if (next.has(index)) {
//         next.delete(index);
//       } else {
//         next.add(index);
//         const rect = cardEl?.getBoundingClientRect();
//         const origin = rect
//           ? {
//               x: (rect.left + rect.width / 2) / window.innerWidth,
//               y: (rect.top + rect.height / 2) / window.innerHeight,
//             }
//           : { x: 0.5, y: 0.5 };
//         confetti({
//           particleCount: 18,
//           spread: 50,
//           startVelocity: 18,
//           scalar: 0.7,
//           gravity: 0.6,
//           colors: ["#f472b6", "#ec4899", "#fbcfe8"],
//           origin,
//         });
//       }
//       return next;
//     });
//   };

//   const favoritedCount = favorited.size;
//   const chromeFade = { opacity: gathering ? 0 : 1, transition: "opacity 0.4s ease" };

//   return (
//     <section className={styles.gallery} onClick={handleSkip}>
//       <div className={styles.sideBorderLeft} style={chromeFade}>
//         <span className={styles.borderDot} />
//         <span className={styles.borderHeart}>♡</span>
//         <span className={styles.borderDot} />
//         <span className={styles.borderHeart}>❤</span>
//         <span className={styles.borderDot} />
//         <span className={styles.borderHeart}>♡</span>
//         <span className={styles.borderDot} />
//       </div>
//       <div className={styles.sideBorderRight} style={chromeFade}>
//         <span className={styles.borderDot} />
//         <span className={styles.borderHeart}>♡</span>
//         <span className={styles.borderDot} />
//         <span className={styles.borderHeart}>❤</span>
//         <span className={styles.borderDot} />
//         <span className={styles.borderHeart}>♡</span>
//         <span className={styles.borderDot} />
//       </div>

//       <motion.h2
//         className={styles.heading}
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: gathering ? 0 : 1, y: 0 }}
//         transition={{ duration: 0.6, delay: 0.2 }}
//       >
//         {title}
//       </motion.h2>

//       <motion.p
//         className={styles.gallerySubtitle}
//         initial={{ opacity: 0 }}
//         animate={{ opacity: revealed && !gathering ? 1 : 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         tap any memory to look closer, tap the heart to keep it close ✨
//       </motion.p>

//       <div className={styles.photoGrid}>
//         {photos.map((item, index) => (
//           <MemoryCard
//             key={index}
//             item={item}
//             index={index}
//             total={photos.length}
//             wobble={wobbles[index]}
//             isFavorited={favorited.has(index)}
//             revealed={revealed}
//             skip={skip}
//             gathering={gathering}
//             onToggleFavorite={handleToggleFavorite}
//             onExpand={setExpandedIndex}
//           />
//         ))}
//       </div>

//       {favoritedCount > 0 && !gathering && (
//         <motion.p
//           className={styles.favoriteCount}
//           initial={{ opacity: 0, y: 6 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           {favoritedCount} {favoritedCount === 1 ? "memory" : "memories"} close to your heart 💕
//         </motion.p>
//       )}

//       <motion.button
//         className={`btn-primary ${styles.continueButton}`}
//         onClick={(e) => {
//           e.stopPropagation();
//           handleContinue();
//         }}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{
//           opacity: revealed && !gathering ? 1 : 0,
//           y: revealed ? 0 : 20,
//         }}
//         transition={{ duration: 0.6, delay: revealed ? 0.3 : 0 }}
//         style={{ pointerEvents: revealed && !gathering ? "auto" : "none" }}
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.98 }}
//       >
//         {buttonText}
//       </motion.button>

//       <AnimatePresence>
//         {expandedIndex !== null && (
//           <motion.div
//             className={styles.lightboxOverlay}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={(e) => {
//               e.stopPropagation();
//               setExpandedIndex(null);
//             }}
//           >
//             <motion.div
//               className={styles.lightboxContent}
//               initial={{ scale: 0.85, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               transition={{ type: "spring", stiffness: 260, damping: 22 }}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <button
//                 className={styles.lightboxClose}
//                 onClick={() => setExpandedIndex(null)}
//                 aria-label="Close"
//               >
//                 ✕
//               </button>

//               {photos[expandedIndex].type === "video" ? (
//                 <video
//                   className={styles.lightboxMedia}
//                   src={photos[expandedIndex].src}
//                   poster={photos[expandedIndex].poster}
//                   autoPlay
//                   loop
//                   muted
//                   playsInline
//                   controls
//                 />
//               ) : (
//                 <img
//                   className={styles.lightboxMedia}
//                   src={photos[expandedIndex].src}
//                   alt={`Memory ${expandedIndex + 1}`}
//                 />
//               )}

//               {photos[expandedIndex].caption && (
//                 <p className={styles.lightboxCaption}>
//                   {photos[expandedIndex].caption}
//                 </p>
//               )}
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </section>
//   );
// }


/* ==========================================
   PhotoGallery - Living Polaroid Gallery

   Entrance: the photos drift down softly, one by one, and
   "develop" into focus like real polaroids. Captions and
   hearts appear once everything has settled.
   Exit: the photos are gathered up and tucked away toward
   the centre, like being slipped into an envelope.
   Tap anywhere while dealing to skip straight to the end.
   ========================================== */

/* ==========================================
   PhotoGallery - Living Polaroid Gallery

   Entrance: the photos drift down softly, one by one, and
   "develop" into focus like real polaroids. Captions and
   hearts appear once everything has settled.
   Exit: the photos are gathered up and tucked away toward
   the centre, like being slipped into an envelope.
   Tap anywhere while dealing to skip straight to the end.
   ========================================== */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useAnimationControls,
} from "framer-motion";
import confetti from "canvas-confetti";
import styles from "./PhotoGallery.module.css";
import { useInView } from "../hooks/useInView";
import type { MediaItem } from "../config";

interface PhotoGalleryProps {
  title: string;
  photos: MediaItem[];
  buttonText: string;
  onNextSection: () => void;
}

const ROTATIONS = [-3, 2, -2, 3, -1, 2, -3, 2, -2];

const START_DELAY = 0.9; // a calm, empty beat first
const STAGGER = 0.32; // unhurried, one memory at a time
const SETTLE = 1.5; // last card finishes drifting and developing
const EASE_SOFT = [0.22, 1, 0.36, 1] as const;
const GATHER_MS = 1300; // how long the tuck-away takes

type Wobble = { base: number; duration: number; delay: number };

function MemoryCard({
  item,
  index,
  total,
  wobble,
  isFavorited,
  revealed,
  skip,
  gathering,
  onToggleFavorite,
  onExpand,
}: {
  item: MediaItem;
  index: number;
  total: number;
  wobble: Wobble;
  isFavorited: boolean;
  revealed: boolean;
  skip: boolean;
  gathering: boolean;
  onToggleFavorite: (index: number, cardEl: HTMLDivElement | null) => void;
  onExpand: (index: number) => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const cardObserver = useInView("0px");
  const cardElRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controls = useAnimationControls();

  const [developed, setDeveloped] = useState(false);

  // Each card starts a short, gentle distance below its spot,
  // tilted just a few degrees off its resting angle.
  const start = useMemo(
    () => ({
      x: 0,
      y: 50,
      rotate: wobble.base + (Math.random() * 8 - 4),
    }),
    [wobble.base]
  );

  const landed = {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    rotate: wobble.base,
  };

  // Mobile browsers are strict about video. React doesn't reliably put the
  // `muted` attribute on the element, and `autoPlay` is ignored when it changes
  // after mount, so we mute and play/pause the video ourselves.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || item.type !== "video") return;
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    if (cardObserver.isInView) {
      v.play().catch(() => {
        /* Low Power Mode / data saver: the first frame still shows */
      });
    } else {
      v.pause();
    }
  }, [cardObserver.isInView, item.type]);

  // Phones often never fire "loadeddata" for preload="metadata",
  // which left the video invisible. Show it after a moment regardless.
  useEffect(() => {
    if (item.type !== "video") return;
    const t = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(t);
  }, [item.type]);

  // The deal
  useEffect(() => {
    const delay = START_DELAY + index * STAGGER;
    controls.start({
      ...landed,
      transition: {
        type: "tween",
        duration: 1.3,
        ease: EASE_SOFT,
        delay,
        opacity: { duration: 1.0, delay, ease: "easeOut" },
      },
    });
    // the photo itself comes into focus just after the card lands
    const t = setTimeout(() => setDeveloped(true), (delay + 0.5) * 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Skip: everything lands right now
  useEffect(() => {
    if (!skip) return;
    setDeveloped(true);
    controls.start({
      ...landed,
      transition: { type: "tween", duration: 0.25, ease: "easeOut" },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);

  // Exit: gather toward the centre of the screen, last card first
  useEffect(() => {
    if (!gathering) return;
    const r = cardElRef.current?.getBoundingClientRect();
    const dx = r ? window.innerWidth / 2 - (r.left + r.width / 2) : 0;
    const dy = r ? window.innerHeight / 2 - (r.top + r.height / 2) : 0;
    controls.start({
      x: dx,
      y: dy,
      scale: 0.25,
      opacity: 0,
      rotate: wobble.base + (index % 2 ? 14 : -14),
      transition: {
        duration: 0.8,
        delay: (total - 1 - index) * 0.06,
        ease: [0.65, 0, 0.35, 1],
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gathering]);

  const develop = {
    filter: developed
      ? "none"
      : "blur(7px) sepia(0.55) brightness(1.12) saturate(0.8)",
    transition: "opacity 0.4s ease, filter 2.4s ease",
  };

  const fade = {
    opacity: revealed ? 1 : 0,
    transition: "opacity 0.6s ease",
  };

  return (
    <motion.div
      ref={(node) => {
        (cardObserver.ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        cardElRef.current = node;
      }}
      className={styles.photoFrame}
      initial={{ opacity: 0, scale: 0.7, ...start }}
      animate={controls}
      whileHover={{ zIndex: 20 }}
    >
      {/* Inner layer: the gentle idle wobble starts only after landing */}
      <motion.div
        animate={{ rotate: [0, 1.8, 0, -1.8, 0] }}
        transition={{
          duration: wobble.duration * 1.6,
          delay: START_DELAY + index * STAGGER + SETTLE + wobble.delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{
          scale: 1.08,
          rotate: -wobble.base,
          transition: { duration: 0.25, ease: "easeOut" },
        }}
        whileTap={{ scale: 1.03 }}
      >
        <div
          className={`${styles.polaroid} ${isFavorited ? styles.polaroidFavorited : ""}`}
          onClick={() => onExpand(index)}
        >
          {!isLoaded && <div className={styles.shimmer} />}

          {item.type === "video" && (
            <video
              ref={videoRef}
              className={styles.photo}
              // "#t=0.001" makes iPhones draw the first frame as a preview
              src={item.src.includes("#") ? item.src : `${item.src}#t=0.001`}
              poster={item.poster}
              loop
              muted
              playsInline
              preload="metadata"
              disablePictureInPicture
              onLoadedMetadata={() => setIsLoaded(true)}
              onLoadedData={() => setIsLoaded(true)}
              onCanPlay={() => setIsLoaded(true)}
              style={{ opacity: isLoaded ? 1 : 0, ...develop }}
            />
          )}

          {item.type === "photo" && (
            <img
              src={item.src}
              alt={`Memory ${index + 1}`}
              className={styles.photo}
              draggable={false}
              decoding="async"
              onLoad={() => setIsLoaded(true)}
              style={{ opacity: isLoaded ? 1 : 0, ...develop }}
            />
          )}

          {item.type === "video" && isLoaded && (
            <span className={styles.videoBadge} style={fade}>
              ♥
            </span>
          )}

          {isLoaded && (
            <button
              className={`${styles.favoriteButton} ${isFavorited ? styles.favoriteButtonActive : ""}`}
              style={fade}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(index, cardElRef.current);
              }}
              aria-label={isFavorited ? "Remove from favorites" : "Mark as favorite"}
            >
              {isFavorited ? "❤" : "🤍"}
            </button>
          )}

          {isLoaded && (
            <span className={styles.caption} style={fade}>
              {item.caption ?? " "}
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PhotoGallery({
  title,
  photos,
  buttonText,
  onNextSection,
}: PhotoGalleryProps) {
  const [favorited, setFavorited] = useState<Set<number>>(new Set());
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [skip, setSkip] = useState(false);
  const [gathering, setGathering] = useState(false);

  // Once the last polaroid has landed, bring in captions, hearts and the button
  useEffect(() => {
    const t = setTimeout(
      () => setRevealed(true),
      (START_DELAY + (photos.length - 1) * STAGGER + SETTLE) * 1000
    );
    return () => clearTimeout(t);
  }, [photos.length]);

  const handleSkip = () => {
    if (revealed || skip) return;
    setSkip(true);
    setRevealed(true);
  };

  const handleContinue = () => {
    if (gathering) return;
    setGathering(true);
    setTimeout(onNextSection, GATHER_MS);
  };

  const wobbles = useMemo<Wobble[]>(
    () =>
      photos.map((_, i) => ({
        base: ROTATIONS[i % ROTATIONS.length],
        duration: 3.2 + (i % 4) * 0.4,
        delay: (i % 5) * 0.3,
      })),
    [photos]
  );

  const handleToggleFavorite = (index: number, cardEl: HTMLDivElement | null) => {
    setFavorited((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
        const rect = cardEl?.getBoundingClientRect();
        const origin = rect
          ? {
              x: (rect.left + rect.width / 2) / window.innerWidth,
              y: (rect.top + rect.height / 2) / window.innerHeight,
            }
          : { x: 0.5, y: 0.5 };
        confetti({
          particleCount: 18,
          spread: 50,
          startVelocity: 18,
          scalar: 0.7,
          gravity: 0.6,
          colors: ["#f472b6", "#ec4899", "#fbcfe8"],
          origin,
        });
      }
      return next;
    });
  };

  const favoritedCount = favorited.size;
  const chromeFade = { opacity: gathering ? 0 : 1, transition: "opacity 0.4s ease" };

  return (
    <section className={styles.gallery} onClick={handleSkip}>
      <div className={styles.sideBorderLeft} style={chromeFade}>
        <span className={styles.borderDot} />
        <span className={styles.borderHeart}>♡</span>
        <span className={styles.borderDot} />
        <span className={styles.borderHeart}>❤</span>
        <span className={styles.borderDot} />
        <span className={styles.borderHeart}>♡</span>
        <span className={styles.borderDot} />
      </div>
      <div className={styles.sideBorderRight} style={chromeFade}>
        <span className={styles.borderDot} />
        <span className={styles.borderHeart}>♡</span>
        <span className={styles.borderDot} />
        <span className={styles.borderHeart}>❤</span>
        <span className={styles.borderDot} />
        <span className={styles.borderHeart}>♡</span>
        <span className={styles.borderDot} />
      </div>

      <motion.h2
        className={styles.heading}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: gathering ? 0 : 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {title}
      </motion.h2>

      <motion.p
        className={styles.gallerySubtitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed && !gathering ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        tap any memory to look closer, tap the heart to keep it close ✨
      </motion.p>

      <div className={styles.photoGrid}>
        {photos.map((item, index) => (
          <MemoryCard
            key={index}
            item={item}
            index={index}
            total={photos.length}
            wobble={wobbles[index]}
            isFavorited={favorited.has(index)}
            revealed={revealed}
            skip={skip}
            gathering={gathering}
            onToggleFavorite={handleToggleFavorite}
            onExpand={setExpandedIndex}
          />
        ))}
      </div>

      {favoritedCount > 0 && !gathering && (
        <motion.p
          className={styles.favoriteCount}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {favoritedCount} {favoritedCount === 1 ? "memory" : "memories"} close to your heart 💕
        </motion.p>
      )}

      <motion.button
        className={`btn-primary ${styles.continueButton}`}
        onClick={(e) => {
          e.stopPropagation();
          handleContinue();
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: revealed && !gathering ? 1 : 0,
          y: revealed ? 0 : 20,
        }}
        transition={{ duration: 0.6, delay: revealed ? 0.3 : 0 }}
        style={{ pointerEvents: revealed && !gathering ? "auto" : "none" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        {buttonText}
      </motion.button>

      <AnimatePresence>
        {expandedIndex !== null && (
          <motion.div
            className={styles.lightboxOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              setExpandedIndex(null);
            }}
          >
            <motion.div
              className={styles.lightboxContent}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.lightboxClose}
                onClick={() => setExpandedIndex(null)}
                aria-label="Close"
              >
                ✕
              </button>

              {photos[expandedIndex].type === "video" ? (
                <video
                  className={styles.lightboxMedia}
                  src={photos[expandedIndex].src}
                  poster={photos[expandedIndex].poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              ) : (
                <img
                  className={styles.lightboxMedia}
                  src={photos[expandedIndex].src}
                  alt={`Memory ${expandedIndex + 1}`}
                />
              )}

              {photos[expandedIndex].caption && (
                <p className={styles.lightboxCaption}>
                  {photos[expandedIndex].caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}