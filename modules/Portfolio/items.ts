export type PortfolioItem = {
  src: string;
  title: string;
  description: string;
};

export const PortfolioItems: PortfolioItem[] = [
  {
    title: "Sensive",
    description: `
My friend Diego and I made a design tool plugin to sync Figma and Sketch files into a shared dashboard for teams.

It was really cool, we launched it on Product Hunt and got a lot of attention. We even got a few paying customers. 

We eventually shut it down because we didn't have the time to maintain it.
    `,
    src: "https://firebasestorage.googleapis.com/v0/b/blocks-e243f.appspot.com/o/b605f3c8-1a69-4c63-af5b-06d09f357561%2Fimage.png?alt=media&token=b7a454bd-e865-4b03-bf7c-9a54448534dc",
  },
  {
    title: "Titan",
    description: `
Data visualization in a highly competitive in space where innovation is needed: Finance.
    `,
    src: "https://framerusercontent.com/images/RUcrvFEqsnbH9ZBYtwc8r8YV8w.png?scale-down-to=2048",
  },
  {
    title: "Bleep",
    description: "A Framer X component for creating responsive layouts",
    src: "https://framerusercontent.com/images/oNt0ESKQfWYVWLc5FVTcPZwjM8.png",
  },
  {
    title: "Air",
    description: `Thanks to Sensive, I met the wonderful team over at [Air](https://www.air.inc). Together, we built a really cool media management app for creative teams. My first project was to build a macOS to sync local files with the cloud, Air Flow, in a low touch way.`,
    src: "https://img.plasmic.app/img-optimizer/v1/img/7358fcb53e0c6829ec0bfc2a1ff86ff6.png?q=75&f=webp",
  },
  {
    title: "Coleure",
    description: `
Choosing colors is a fun part of the design process. But it often starts in a depressing way: with a blank canvas (aka color wheel) or with a set of palettes that are not your own. 

Coleure was built to removes 200million options so you can get started quicker on finding a color, then it helps you mix and match with different options.
    `,
    src: "https://framerusercontent.com/images/KmUXgRvK2EBCZ4on5tm20HS6Ns.png",
  },
];
