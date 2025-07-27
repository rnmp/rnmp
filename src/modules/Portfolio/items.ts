export type PortfolioItem = {
  src: string;
  title: string;
  description: string;
};

export const PortfolioItems: PortfolioItem[] = [
  {
    title: "Sensive",
    description: `
My friend Diego and I made a Figma plugin to upload designs as you work on them so teams can build processes around them.

It was really neat, we [launched it](https://www.producthunt.com/products/sensive#sensive) on Product Hunt to positive reception. We even got a few paying customers! 
    `,
    src: "/portfolio/sensive.png",
  },
  {
    title: "Titan",
    description: `
I joined Titan in 2022 to help build a new kind of wealth management platform. I’ve never grown as a product-maker in such a short period of time. 
    `,
    src: "/portfolio/titan.png",
  },
  {
    title: "Bleep",
    description: `
The note-taking / inspiration gathering / life organizing tool I’ve been making for the past two years. It’s taking forever to complete — help!

But also, [check it out](https://bleep.is). It's pretty cool.
`,
    src: "/portfolio/bleep.png",
  },
  {
    title: "Air",
    description: `
Thanks to Sensive, I met the wonderful team over at [Air](https://www.air.inc). Together, we built a really solid media management app for creative teams.`,
    src: "/portfolio/air.png",
  },
  {
    title: "Coleure",
    description: `
Choosing colors is a fun part of the design process. But it often can be intimidating (200M+ colors to choose from!). Coleure reduces the upfront decision paralysis and provides a intuitive color making experience with features like color mixing, proofing, contrast test, etc.

A few years after launching, it got purchased by a media company for internal use, and thus sadly taken down from the public.
    `,
    src: "/portfolio/coleure.png",
  },
];
