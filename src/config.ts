/* ==========================================
   Birthday Surprise Website Configuration

   Edit this file to customize the website
   for your loved one!
   ========================================== */

export const config = {
  /* Name Verification Gate */
  recipientName: "Bhavna", // required name to enter
  nameHint: '6 letters, starts with "B"', // hint on wrong name

  groupName: "OnlyPlans", // required group name to enter
  groupNameHint: "Did you forget OnlyPlans?🥲", // hint on wrong group name

  /* Section Headings */
  soloGalleryTitle: "✨ Birthday Girl ✨", // solo gallery title
  messageTitle: "To Our Train Friend", // letter section title
  footerText: "Made with 💗 just for you", // footer text

  /* Button Labels */
  buttons: {
    hero: "Ready for a little surprise?", // hero/landing button
    soloGallery: "One last thing...", // solo gallery button
  },

  /* Together Gallery (Optional) */
  togetherGallery: {
    enabled: true, // toggle together gallery
    title: "💕 Our Memories 💕", // together gallery title
    buttonText: "One last thing...", // together gallery button
  },

  /* Birthday Message: Each string is a paragraph */

message: [

  "First of all Happy birthday Bhavna🥳🎂",
  //"",
  "I honestly dont know what to say or whether i should do something like this or not,dont really know if you would even like it or not but hope you like it.",
  //"",
  "I wanted to do something nice something special for your birthday however i can ,so to not let things end on bad terms.",
  //"",
  "I made so many mistakes this year mistakenly and intentionally which you have tolerated,i cant even count so very sorry for all the suffering,disturbance of your peace you have to bear because of me(never wanted that).",
  //"",
  "I know making up this website does not make up for my mistakes,I only tried to make this website only to make your birthday a little special,to make you smile once if possible ,but somewhere in all this two thousand eight hundred sixty seven lines of code, there’s a tiny bit hope you might forgive me and anurag one day and we can share train rides together and maybe for one time ,have a mountain trip ,i still remember you saying mountains were the place you’d most like to visit. So maybe someday. Who knows. 🏔️",
  //"",
  "We really wanted to celebrate your birthday with you at least once and one time we both were making plans about it (anurag even said you will let us order anything on your birthday😋)",
  //"",
  "But really No pressure, though — if you want to come back, we'll be happy, and if you don't, we'll respect that completely.",
  //"",
  "If I'm honest, these past few months — and you not wishing Anurag on his birthday — have already told me what the answer probably is. And that's okay.",
  //"",
  "So i am sorry for everything 🥲 - especially for the times i made things bad when they could have been better.",
  //"",
  "Anyway enough of all that,",
  //"",
  "Happy Birthday Once Again Bhavna",
  //"",
  "I hope this becomes one of your best birthdays, and i hope every birthday after this one is even better.",
  //"",
  "I hope all your wishes come true and hope you and your family will always be healthy, happy and always smiling.",
  //"",
  "You dont have to reply to this message if you dont want to.",
  //"",
  "No Pressure,No Expectations",
  //"",
  "Happy Birthday!",
  "Take care!",
  "Sorry yaar!",
  "- yash(Jalankhurra)"
],

  /* Theme Colors - Change these to customize the entire website theme! */
  colors: {
    primary: "#ec4899", // main color (buttons, accents)
    light: "#fdf2f8", // lightest shade (backgrounds)
    medium: "#f9a8d4", // medium shade (decorations)
    dark: "#db2777", // darkest shade (hover states)
  },

  /* Typing Animation Text (shown on the start screen) */
  typingText: {
    first: "Hey, wait a second!",
    second: "This website is for someone who i miss on my every monday.",
    third: "Hope you see it till the end!"
  },
};

// config.ts
export interface MediaItem {
  type: "photo" | "video";
  src: string;
  poster?: string; // small thumbnail shown instantly for videos
  caption?: string;
}

export type Config = typeof config;
