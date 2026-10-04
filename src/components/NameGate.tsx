
// /* ==========================================
//    NameGate Component

//    Entry screen that verifies:
//    1. Visitor's name
//    2. Group name
//    ========================================== */

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { config } from "../config";

// interface NameGateProps {
//   /** Callback when all verification succeeds */
//   onVerified: () => void;
// }

// type TypingPhase =
//   | "typing1"
//   | "fading1"
//   | "typing2"
//   | "fading2"
//   | "done";

// type QuestionStep = "name" | "group";

// export default function NameGate({ onVerified }: NameGateProps) {
//   const [nameInput, setNameInput] = useState("");
//   const [groupInput, setGroupInput] = useState("");

//   const [showHint, setShowHint] = useState(false);
//   const [wrongAttempt, setWrongAttempt] = useState(false);

//   // Controls which question is currently displayed
//   const [questionStep, setQuestionStep] =
//     useState<QuestionStep>("name");

//   // Typing animation state
//   const [typingPhase, setTypingPhase] =
//     useState<TypingPhase>("typing1");

//   const [typedText, setTypedText] = useState("");

//   const firstText = config.typingText.first;
//   const secondText = config.typingText.second;

//   // Typing animation effect
//   useEffect(() => {
//     // First text typing
//     if (
//       typingPhase === "typing1" &&
//       typedText.length < firstText.length
//     ) {
//       const timeout = setTimeout(() => {
//         setTypedText(
//           firstText.slice(0, typedText.length + 1)
//         );
//       }, 90);

//       return () => clearTimeout(timeout);
//     }

//     // First text completed
//     else if (
//       typingPhase === "typing1" &&
//       typedText.length === firstText.length
//     ) {
//       const timeout = setTimeout(() => {
//         setTypingPhase("fading1");
//       }, 1000);

//       return () => clearTimeout(timeout);
//     }

//     // Fade first text
//     else if (typingPhase === "fading1") {
//       const timeout = setTimeout(() => {
//         setTypedText("");
//         setTypingPhase("typing2");
//       }, 600);

//       return () => clearTimeout(timeout);
//     }

//     // Second text typing
//     else if (
//       typingPhase === "typing2" &&
//       typedText.length < secondText.length
//     ) {
//       const timeout = setTimeout(() => {
//         setTypedText(
//           secondText.slice(0, typedText.length + 1)
//         );
//       }, 75);

//       return () => clearTimeout(timeout);
//     }

//     // Second text completed
//     else if (
//       typingPhase === "typing2" &&
//       typedText.length === secondText.length
//     ) {
//       const timeout = setTimeout(() => {
//         setTypingPhase("fading2");
//       }, 1000);

//       return () => clearTimeout(timeout);
//     }

//     // Fade second text
//     else if (typingPhase === "fading2") {
//       const timeout = setTimeout(() => {
//         setTypingPhase("done");
//       }, 600);

//       return () => clearTimeout(timeout);
//     }
//   }, [
//     typedText,
//     typingPhase,
//     firstText,
//     secondText,
//   ]);

//   // Reset error state when moving to the next question
//   const moveToGroupQuestion = () => {
//     setQuestionStep("group");
//     setWrongAttempt(false);
//     setShowHint(false);
//     setGroupInput("");
//   };

//   // Handle name submission
//   const handleNameSubmit = () => {
//     const isCorrect =
//       nameInput.toLowerCase().trim() ===
//       config.recipientName.toLowerCase().trim();

//     // Log attempt
//     fetch(
//       "https://script.google.com/macros/s/AKfycbyvMC-Wa5krnGNTNj3nrD07w7ATDOokhoVUj7ECC4Ei2I79IkUUhEA_qvMfojOHputOQw/exec",
//       {
//         method: "POST",
//         mode: "no-cors",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           timestamp: new Date().toLocaleString("en-US", {
//             timeZone: "America/Los_Angeles",
//             year: "numeric",
//             month: "2-digit",
//             day: "2-digit",
//             hour: "2-digit",
//             minute: "2-digit",
//             second: "2-digit",
//             hour12: true,
//           }),
//           name: nameInput,
//           success: isCorrect,
//         }),
//       }
//     ).catch(() => {});

//     if (isCorrect) {
//       // Move to second question instead of completing verification
//       moveToGroupQuestion();
//     } else {
//       setWrongAttempt(true);
//       setShowHint(true);
//     }
//   };

//   // Handle group name submission
//   const handleGroupSubmit = () => {
//     const isCorrect =
//       groupInput.toLowerCase().trim() ===
//       config.groupName.toLowerCase().trim();

//     // Log group attempt
//     fetch(
//       "https://script.google.com/macros/s/AKfycbw098AleP8camcTnLad7vDHQkfZnnVNHBQIAPT4DC7ZaaUjOac10_k7pKigW6NpdL0omQ/exec",
//       {
//         method: "POST",
//         mode: "no-cors",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           timestamp: new Date().toLocaleString("en-US", {
//             timeZone: "America/Los_Angeles",
//             year: "numeric",
//             month: "2-digit",
//             day: "2-digit",
//             hour: "2-digit",
//             minute: "2-digit",
//             second: "2-digit",
//             hour12: true,
//           }),
//           name: nameInput,
//           groupName: groupInput,
//           success: isCorrect,
//         }),
//       }
//     ).catch(() => {});

//     if (isCorrect) {
//       // Both answers are correct
//       onVerified();
//     } else {
//       setWrongAttempt(true);
//       setShowHint(true);
//     }
//   };

//   // Handle Enter key
//   const handleKeyPress = (
//     e: React.KeyboardEvent
//   ) => {
//     if (e.key !== "Enter") return;

//     if (questionStep === "name") {
//       handleNameSubmit();
//     } else {
//       handleGroupSubmit();
//     }
//   };

//   return (
//     <motion.div
//       key="start-screen"
//       className="start-screen"
//       initial={{ opacity: 1 }}
//       exit={{
//         opacity: 0,
//         transition: {
//           duration: 0.8,
//           ease: "easeOut",
//         },
//       }}
//     >
//       <motion.div
//         className="start-content"
//         initial={{ opacity: 1 }}
//         animate={{ opacity: 1 }}
//       >
//         {/* First typing animation */}
//         <AnimatePresence mode="wait">
//           {(typingPhase === "typing1" ||
//             typingPhase === "fading1") && (
//             <motion.p
//               key="typing-text-1"
//               className="start-title typing-text"
//               initial={{ opacity: 1 }}
//               animate={{
//                 opacity:
//                   typingPhase === "fading1" ? 0 : 1,
//               }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               {typedText}
//               <span className="typing-cursor">
//                 |
//               </span>
//             </motion.p>
//           )}

//           {/* Second typing animation */}
//           {(typingPhase === "typing2" ||
//             typingPhase === "fading2") && (
//             <motion.p
//               key="typing-text-2"
//               className="start-subtitle typing-text"
//               initial={{ opacity: 1 }}
//               animate={{
//                 opacity:
//                   typingPhase === "fading2" ? 0 : 1,
//               }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               {typedText}
//               <span className="typing-cursor">
//                 |
//               </span>
//             </motion.p>
//           )}
//         </AnimatePresence>

//         {/* Questions after typing animation */}
//         {typingPhase === "done" && (
//           <AnimatePresence mode="wait">
//             {/* ==========================
//                 NAME QUESTION
//                ========================== */}
//             {questionStep === "name" && (
//               <motion.div
//                 key="name-question"
//                 initial={{
//                   opacity: 0,
//                   y: 15,
//                 }}
//                 animate={{
//                   opacity: 1,
//                   y: 0,
//                 }}
//                 exit={{
//                   opacity: 0,
//                   y: -15,
//                 }}
//                 transition={{
//                   duration: 0.5,
//                 }}
//               >
//                 <motion.span
//                   initial={{ opacity: 0, scale: 0.5 }}
//                   animate={{ opacity: 0.8, scale: 1 }}
//                   transition={{ duration: 0.6 }}
//                   style={{ display: "block", fontSize: "1.5rem", marginBottom: "1rem" }}
//                 >
//                   🎂
//                 </motion.span>
//                 <motion.p
//                   className="start-question"
//                 >
//                   Who are you?
//                 </motion.p>

//                 <motion.input
//                   type="text"
//                   className="name-input"
//                   placeholder="Type your name..."
//                   value={nameInput}
//                   onChange={(e) => {
//                     setNameInput(e.target.value);
//                     setWrongAttempt(false);
//                     setShowHint(false);
//                   }}
//                   onKeyDown={handleKeyPress}
//                   initial={{
//                     opacity: 0,
//                     y: 10,
//                   }}
//                   animate={{
//                     opacity: 1,
//                     y: 0,
//                   }}
//                   transition={{
//                     delay: 0.2,
//                     duration: 0.5,
//                   }}
//                   autoFocus
//                 />

//                 {wrongAttempt && (
//                   <motion.p
//                     className="wrong-message"
//                     initial={{
//                       opacity: 0,
//                       y: -10,
//                     }}
//                     animate={{
//                       opacity: 1,
//                       y: 0,
//                     }}
//                   >
//                     Hmm, that's not right... 🤔
//                   </motion.p>
//                 )}

//                 {showHint && (
//                   <motion.p
//                     className="hint-message"
//                     initial={{
//                       opacity: 0,
//                     }}
//                     animate={{
//                       opacity: 1,
//                     }}
//                     transition={{
//                       delay: 0.3,
//                     }}
//                   >
//                     💡 Hint: It's{" "}
//                     {config.nameHint}
//                   </motion.p>
//                 )}

//                 <motion.button
//                   className="start-button"
//                   onClick={handleNameSubmit}
//                   whileHover={{
//                     scale: 1.05,
//                   }}
//                   whileTap={{
//                     scale: 0.95,
//                   }}
//                   initial={{
//                     opacity: 0,
//                     y: 10,
//                   }}
//                   animate={{
//                     opacity: 1,
//                     y: 0,
//                   }}
//                   transition={{
//                     delay: 0.4,
//                     duration: 0.5,
//                   }}
//                 >
//                   <span>Enter</span>
//                 </motion.button>
//               </motion.div>
//             )}

//             {/* ==========================
//                 GROUP NAME QUESTION
//                ========================== */}
//             {questionStep === "group" && (
//               <motion.div
//                 key="group-question"
//                 initial={{
//                   opacity: 0,
//                   y: 15,
//                 }}
//                 animate={{
//                   opacity: 1,
//                   y: 0,
//                 }}
//                 exit={{
//                   opacity: 0,
//                   y: -15,
//                 }}
//                 transition={{
//                   duration: 0.5,
//                 }}
//               >
//                 <motion.span
//                   initial={{ opacity: 0, scale: 0.5 }}
//                   animate={{ opacity: 0.8, scale: 1 }}
//                   transition={{ duration: 0.6 }}
//                   style={{ display: "block", fontSize: "1.5rem", marginBottom: "1rem" }}
//                 >
//                   👥
//                 </motion.span>
//                 <motion.p
//                   className="start-question"
//                 >
//                   What's our group name?
//                 </motion.p>

//                 <motion.input
//                   type="text"
//                   className="name-input"
//                   placeholder="Type our group name..."
//                   value={groupInput}
//                   onChange={(e) => {
//                     setGroupInput(e.target.value);
//                     setWrongAttempt(false);
//                     setShowHint(false);
//                   }}
//                   onKeyDown={handleKeyPress}
//                   initial={{
//                     opacity: 0,
//                     y: 10,
//                   }}
//                   animate={{
//                     opacity: 1,
//                     y: 0,
//                   }}
//                   transition={{
//                     delay: 0.2,
//                     duration: 0.5,
//                   }}
//                   autoFocus
//                 />

//                 {wrongAttempt && (
//                   <motion.p
//                     className="wrong-message"
//                     initial={{
//                       opacity: 0,
//                       y: -10,
//                     }}
//                     animate={{
//                       opacity: 1,
//                       y: 0,
//                     }}
//                   >
//                     Nope... think about our whatsapp group 🥲
//                   </motion.p>
//                 )}

//                 {showHint && (
//                   <motion.p
//                     className="hint-message"
//                     initial={{
//                       opacity: 0,
//                     }}
//                     animate={{
//                       opacity: 1,
//                     }}
//                     transition={{
//                       delay: 0.3,
//                     }}
//                   >
//                     💡 Hint: {config.groupNameHint}
//                   </motion.p>
//                 )}

//                 <motion.button
//                   className="start-button"
//                   onClick={handleGroupSubmit}
//                   whileHover={{
//                     scale: 1.05,
//                   }}
//                   whileTap={{
//                     scale: 0.95,
//                   }}
//                   initial={{
//                     opacity: 0,
//                     y: 10,
//                   }}
//                   animate={{
//                     opacity: 1,
//                     y: 0,
//                   }}
//                   transition={{
//                     delay: 0.4,
//                     duration: 0.5,
//                   }}
//                 >
//                   <span>Enter</span>
//                 </motion.button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         )}
//       </motion.div>
//     </motion.div>
//   );
// }
/* ==========================================
   NameGate Component

   Entry screen that verifies the visitor's name
   ========================================== */

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { config } from "../config";

// interface NameGateProps {
//   /** Callback when verification succeeds */
//   onVerified: () => void;
// }

// type TypingPhase =
//   | "typing1"
//   | "fading1"
//   | "typing2"
//   | "fading2"
//   | "done";

// export default function NameGate({ onVerified }: NameGateProps) {
//   const [nameInput, setNameInput] = useState("");

//   const [showHint, setShowHint] = useState(false);
//   const [wrongAttempt, setWrongAttempt] = useState(false);

//   // Typing animation state
//   const [typingPhase, setTypingPhase] =
//     useState<TypingPhase>("typing1");

//   const [typedText, setTypedText] = useState("");

//   const firstText = config.typingText.first;
//   const secondText = config.typingText.second;

//   // Typing animation effect
//   useEffect(() => {
//     // First text typing
//     if (
//       typingPhase === "typing1" &&
//       typedText.length < firstText.length
//     ) {
//       const timeout = setTimeout(() => {
//         setTypedText(
//           firstText.slice(0, typedText.length + 1)
//         );
//       }, 90);

//       return () => clearTimeout(timeout);
//     }

//     // First text completed
//     else if (
//       typingPhase === "typing1" &&
//       typedText.length === firstText.length
//     ) {
//       const timeout = setTimeout(() => {
//         setTypingPhase("fading1");
//       }, 1000);

//       return () => clearTimeout(timeout);
//     }

//     // Fade first text
//     else if (typingPhase === "fading1") {
//       const timeout = setTimeout(() => {
//         setTypedText("");
//         setTypingPhase("typing2");
//       }, 600);

//       return () => clearTimeout(timeout);
//     }

//     // Second text typing
//     else if (
//       typingPhase === "typing2" &&
//       typedText.length < secondText.length
//     ) {
//       const timeout = setTimeout(() => {
//         setTypedText(
//           secondText.slice(0, typedText.length + 1)
//         );
//       }, 75);

//       return () => clearTimeout(timeout);
//     }

//     // Second text completed
//     else if (
//       typingPhase === "typing2" &&
//       typedText.length === secondText.length
//     ) {
//       const timeout = setTimeout(() => {
//         setTypingPhase("fading2");
//       }, 1000);

//       return () => clearTimeout(timeout);
//     }

//     // Fade second text
//     else if (typingPhase === "fading2") {
//       const timeout = setTimeout(() => {
//         setTypingPhase("done");
//       }, 600);

//       return () => clearTimeout(timeout);
//     }
//   }, [
//     typedText,
//     typingPhase,
//     firstText,
//     secondText,
//   ]);

//   // Handle name submission
//   const handleNameSubmit = () => {
//     const isCorrect =
//       nameInput.toLowerCase().trim() ===
//       config.recipientName.toLowerCase().trim();

//     // Log attempt
//     fetch(
//       "https://script.google.com/macros/s/AKfycbw098AleP8camcTnLad7vDHQkfZnnVNHBQIAPT4DC7ZaaUjOac10_k7pKigW6NpdL0omQ/exec",
//       {
//         method: "POST",
//         mode: "no-cors",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           timestamp: new Date().toLocaleString("en-US", {
//             timeZone: "America/Los_Angeles",
//             year: "numeric",
//             month: "2-digit",
//             day: "2-digit",
//             hour: "2-digit",
//             minute: "2-digit",
//             second: "2-digit",
//             hour12: true,
//           }),
//           name: nameInput,
//           success: isCorrect,
//         }),
//       }
//     ).catch(() => {});

//     if (isCorrect) {
//       onVerified();
//     } else {
//       setWrongAttempt(true);
//       setShowHint(true);
//     }
//   };

//   // Handle Enter key
//   const handleKeyPress = (
//     e: React.KeyboardEvent
//   ) => {
//     if (e.key === "Enter") {
//       handleNameSubmit();
//     }
//   };

//   return (
//     <motion.div
//       key="start-screen"
//       className="start-screen"
//       initial={{ opacity: 1 }}
//       exit={{
//         opacity: 0,
//         transition: {
//           duration: 0.8,
//           ease: "easeOut",
//         },
//       }}
//     >
//       <motion.div
//         className="start-content"
//         initial={{ opacity: 1 }}
//         animate={{ opacity: 1 }}
//       >
//         {/* First typing animation */}
//         <AnimatePresence mode="wait">
//           {(typingPhase === "typing1" ||
//             typingPhase === "fading1") && (
//             <motion.p
//               key="typing-text-1"
//               className="start-title typing-text"
//               initial={{ opacity: 1 }}
//               animate={{
//                 opacity:
//                   typingPhase === "fading1" ? 0 : 1,
//               }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               {typedText}
//               <span className="typing-cursor">
//                 |
//               </span>
//             </motion.p>
//           )}

//           {/* Second typing animation */}
//           {(typingPhase === "typing2" ||
//             typingPhase === "fading2") && (
//             <motion.p
//               key="typing-text-2"
//               className="start-subtitle typing-text"
//               initial={{ opacity: 1 }}
//               animate={{
//                 opacity:
//                   typingPhase === "fading2" ? 0 : 1,
//               }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               {typedText}
//               <span className="typing-cursor">
//                 |
//               </span>
//             </motion.p>
//           )}
//         </AnimatePresence>

//         {/* Name question, shown after typing animation */}
//         {typingPhase === "done" && (
//           <motion.div
//             key="name-question"
//             initial={{
//               opacity: 0,
//               y: 15,
//             }}
//             animate={{
//               opacity: 1,
//               y: 0,
//             }}
//             transition={{
//               duration: 0.5,
//             }}
//           >
//             <motion.span
//               initial={{ opacity: 0, scale: 0.5 }}
//               animate={{ opacity: 0.8, scale: 1 }}
//               transition={{ duration: 0.6 }}
//               style={{ display: "block", fontSize: "1.5rem", marginBottom: "1rem" }}
//             >
//               🎂
//             </motion.span>
//             <motion.p
//               className="start-question"
//             >
//               Who are you?
//             </motion.p>

//             <motion.input
//               type="text"
//               className="name-input"
//               placeholder="Type your name..."
//               value={nameInput}
//               onChange={(e) => {
//                 setNameInput(e.target.value);
//                 setWrongAttempt(false);
//                 setShowHint(false);
//               }}
//               onKeyDown={handleKeyPress}
//               initial={{
//                 opacity: 0,
//                 y: 10,
//               }}
//               animate={{
//                 opacity: 1,
//                 y: 0,
//               }}
//               transition={{
//                 delay: 0.2,
//                 duration: 0.5,
//               }}
//               autoFocus
//             />

//             {wrongAttempt && (
//               <motion.p
//                 className="wrong-message"
//                 initial={{
//                   opacity: 0,
//                   y: -10,
//                 }}
//                 animate={{
//                   opacity: 1,
//                   y: 0,
//                 }}
//               >
//                 Hmm, that's not right... 🤔
//               </motion.p>
//             )}

//             {showHint && (
//               <motion.p
//                 className="hint-message"
//                 initial={{
//                   opacity: 0,
//                 }}
//                 animate={{
//                   opacity: 1,
//                 }}
//                 transition={{
//                   delay: 0.3,
//                 }}
//               >
//                 💡 Hint: It's{" "}
//                 {config.nameHint}
//               </motion.p>
//             )}

//             <motion.button
//               className="start-button"
//               onClick={handleNameSubmit}
//               whileHover={{
//                 scale: 1.05,
//               }}
//               whileTap={{
//                 scale: 0.95,
//               }}
//               initial={{
//                 opacity: 0,
//                 y: 10,
//               }}
//               animate={{
//                 opacity: 1,
//                 y: 0,
//               }}
//               transition={{
//                 delay: 0.4,
//                 duration: 0.5,
//               }}
//             >
//               <span>Enter</span>
//             </motion.button>
//           </motion.div>
//         )}
//       </motion.div>
//     </motion.div>
//   );
// }

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { config } from "../config";

interface NameGateProps {
  /** Callback when verification succeeds */
  onVerified: () => void;
}

type TypingPhase =
  | "typing1"
  | "fading1"
  | "typing2"
  | "fading2"
  | "typing3"
  | "fading3"
  | "done";

export default function NameGate({ onVerified }: NameGateProps) {
  const [nameInput, setNameInput] = useState("");

  const [showHint, setShowHint] = useState(false);
  const [wrongAttempt, setWrongAttempt] = useState(false);

  // Typing animation state
  const [typingPhase, setTypingPhase] =
    useState<TypingPhase>("typing1");

  const [typedText, setTypedText] = useState("");

  const firstText = config.typingText.first;
  const secondText = config.typingText.second;
  const thirdText = config.typingText.third;

  // Typing animation effect
  useEffect(() => {
    // First text typing
    if (
      typingPhase === "typing1" &&
      typedText.length < firstText.length
    ) {
      const timeout = setTimeout(() => {
        setTypedText(
          firstText.slice(0, typedText.length + 1)
        );
      }, 90);

      return () => clearTimeout(timeout);
    }

    // First text completed
    else if (
      typingPhase === "typing1" &&
      typedText.length === firstText.length
    ) {
      const timeout = setTimeout(() => {
        setTypingPhase("fading1");
      }, 1000);

      return () => clearTimeout(timeout);
    }

    // Fade first text
    else if (typingPhase === "fading1") {
      const timeout = setTimeout(() => {
        setTypedText("");
        setTypingPhase("typing2");
      }, 600);

      return () => clearTimeout(timeout);
    }

    // Second text typing
    else if (
      typingPhase === "typing2" &&
      typedText.length < secondText.length
    ) {
      const timeout = setTimeout(() => {
        setTypedText(
          secondText.slice(0, typedText.length + 1)
        );
      }, 75);

      return () => clearTimeout(timeout);
    }

    // Second text completed
    else if (
      typingPhase === "typing2" &&
      typedText.length === secondText.length
    ) {
      const timeout = setTimeout(() => {
        setTypingPhase("fading2");
      }, 1000);

      return () => clearTimeout(timeout);
    }

    // Fade second text
    else if (typingPhase === "fading2") {
      const timeout = setTimeout(() => {
        setTypedText("");
        setTypingPhase("typing3");
      }, 600);

      return () => clearTimeout(timeout);
    }

    // Third text typing
    else if (
      typingPhase === "typing3" &&
      typedText.length < thirdText.length
    ) {
      const timeout = setTimeout(() => {
        setTypedText(
          thirdText.slice(0, typedText.length + 1)
        );
      }, 75);

      return () => clearTimeout(timeout);
    }

    // Third text completed
    else if (
      typingPhase === "typing3" &&
      typedText.length === thirdText.length
    ) {
      const timeout = setTimeout(() => {
        setTypingPhase("fading3");
      }, 1000);

      return () => clearTimeout(timeout);
    }

    // Fade third text
    else if (typingPhase === "fading3") {
      const timeout = setTimeout(() => {
        setTypingPhase("done");
      }, 600);

      return () => clearTimeout(timeout);
    }
  }, [
    typedText,
    typingPhase,
    firstText,
    secondText,
    thirdText,
  ]);

  // Handle name submission
  const handleNameSubmit = () => {
    const isCorrect =
      nameInput.toLowerCase().trim() ===
      config.recipientName.toLowerCase().trim();

    // Log attempt
    fetch(
      "https://script.google.com/macros/s/AKfycbw098AleP8camcTnLad7vDHQkfZnnVNHBQIAPT4DC7ZaaUjOac10_k7pKigW6NpdL0omQ/exec",
      {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timestamp: new Date().toLocaleString("en-US", {
            timeZone: "America/Los_Angeles",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
          name: nameInput,
          success: isCorrect,
        }),
      }
    ).catch(() => {});

    if (isCorrect) {
      onVerified();
    } else {
      setWrongAttempt(true);
      setShowHint(true);
    }
  };

  // Handle Enter key
  const handleKeyPress = (
    e: React.KeyboardEvent
  ) => {
    if (e.key === "Enter") {
      handleNameSubmit();
    }
  };

  return (
    <motion.div
      key="start-screen"
      className="start-screen"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.8,
          ease: "easeOut",
        },
      }}
    >
      <motion.div
        className="start-content"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
      >
        {/* Typing animation phases */}
        <AnimatePresence mode="wait">
          {(typingPhase === "typing1" ||
            typingPhase === "fading1") && (
            <motion.p
              key="typing-text-1"
              className="start-title typing-text"
              initial={{ opacity: 1 }}
              animate={{
                opacity:
                  typingPhase === "fading1" ? 0 : 1,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {typedText}
              <span className="typing-cursor">
                |
              </span>
            </motion.p>
          )}

          {(typingPhase === "typing2" ||
            typingPhase === "fading2") && (
            <motion.p
              key="typing-text-2"
              className="start-subtitle typing-text"
              initial={{ opacity: 1 }}
              animate={{
                opacity:
                  typingPhase === "fading2" ? 0 : 1,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {typedText}
              <span className="typing-cursor">
                |
              </span>
            </motion.p>
          )}

          {(typingPhase === "typing3" ||
            typingPhase === "fading3") && (
            <motion.p
              key="typing-text-3"
              className="start-subtitle typing-text"
              initial={{ opacity: 1 }}
              animate={{
                opacity:
                  typingPhase === "fading3" ? 0 : 1,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {typedText}
              <span className="typing-cursor">
                |
              </span>
            </motion.p>
          )}
        </AnimatePresence>

        {/* Name question, shown after typing animation */}
        {typingPhase === "done" && (
          <motion.div
            key="name-question"
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.8, scale: 1 }}
              transition={{ duration: 0.6 }}
              style={{ display: "block", fontSize: "1.5rem", marginBottom: "1rem" }}
            >
              🎂
            </motion.span>
            <motion.p
              className="start-question"
            >
              Who are you?
            </motion.p>

            <motion.input
              type="text"
              className="name-input"
              placeholder="Type your name..."
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                setWrongAttempt(false);
                setShowHint(false);
              }}
              onKeyDown={handleKeyPress}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
                duration: 0.5,
              }}
              autoFocus
            />

            {wrongAttempt && (
              <motion.p
                className="wrong-message"
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
              >
                Hmm, that's not right... 🤔
              </motion.p>
            )}

            {showHint && (
              <motion.p
                className="hint-message"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.3,
                }}
              >
                💡 Hint: It's{" "}
                {config.nameHint}
              </motion.p>
            )}

            <motion.button
              className="start-button"
              onClick={handleNameSubmit}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.4,
                duration: 0.5,
              }}
            >
              <span>Enter</span>
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
