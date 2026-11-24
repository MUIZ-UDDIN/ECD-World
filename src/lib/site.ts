/**
 * Single source of truth for brand + contact details.
 * Replace the placeholder values marked TODO with the client's real details.
 */
export const site = {
  name: "ECD World",
  tagline: "Montessori materials, made by hand",
  url: "https://ecdworld.com",
  description:
    "Montessori and early-childhood apparatus cut, sanded and finished by hand in our own workshop — plus a small, carefully chosen set of building blocks and toys for the years before formal materials.",
  // TODO: replace with the client's real WhatsApp number (international format, no +)
  whatsapp: "923000000000",
  whatsappDisplay: "+92 300 000 0000",
  // TODO: replace with the client's real email
  email: "hello@ecdworld.com",
  phoneDisplay: "+92 300 000 0000",
  address: {
    line1: "Lahore",
    line2: "Punjab, Pakistan",
  },
  hours: "Mon–Sat, 10am – 7pm PKT",
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/ecdexperts" },
    { label: "Instagram", href: "https://www.instagram.com/" },
  ],
  announcement: "Free delivery on orders over ₨ 15,000 · Shipped nationwide",
} as const;

export const categoryCopy: Record<
  string,
  { title: string; blurb: string; index: string }
> = {
  blocks: {
    title: "Blocks",
    blurb: "Boxed building sets for open-ended play.",
    index: "01",
  },
  sensorial: {
    title: "Sensorial",
    blurb: "Refining the senses — size, colour, texture and form.",
    index: "02",
  },
  language: {
    title: "Language",
    blurb: "From sandpaper letters to grammar boxes.",
    index: "03",
  },
  toys: {
    title: "Toys",
    blurb: "Small sets for unhurried, early play.",
    index: "04",
  },
  "ecd-materials": {
    title: "ECD Materials",
    blurb: "The complete classroom, piece by piece.",
    index: "05",
  },
};

export const valueProps = [
  {
    title: "Workshop-made apparatus",
    body: "Beech and pine, cut and sanded by hand — no particle board, no veneer.",
  },
  {
    title: "Non-toxic finishes",
    body: "Water-based lacquers and child-safe pigments throughout.",
  },
  {
    title: "Made in Pakistan",
    body: "Assembled and finished in our own workshop, not imported.",
  },
  {
    title: "School-ready sets",
    body: "Bulk pricing, spares and replacement parts for classrooms.",
  },
];
