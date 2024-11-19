import { PortfolioItems, PortfolioItemWidget } from "@/modules/Portfolio";
import Head from "next/head";
import { TextBlock } from "@/components/Content";

const Content = {
  tagline: `
Whimsical software,  
among other things
  `,
  seoDescription:
    "Peruvian-American engineer & designer based in Philadelphia, PA.",
  intro: (
    <>
      Maker of whimsical apps,<br/>such as{" "}
      <a href="https://bleep.is">Bleep</a> ·
      Find me on<br />
      <a href="https://x.com/rnmp">X</a>,{" "}
      <a href="https://threads.net/@rnmp">Threads</a> &{" "}
      <a href="https://youtube.com/@rolobuilds">YouTube</a>
    </>
  ),
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Rolando</title>
        <meta name="description" content={Content.seoDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column",
      }}>
        {/* Hero Section */}
        <div style={{ 
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2em",
          padding: "var(--content-padding)",
        }}>
          <img
            src="/portrait.png"
            alt="logo"
            style={{
              width: "var(--dimension-logo)",
              height: "var(--dimension-logo)",
              borderRadius: "50%",
            }}
          />
          <p
            style={{
              textAlign: "center",
              fontSize: "var(--font-size-hero2)",
            }}
          >
            {Content.intro}
          </p>
        </div>

        {/* Portfolio Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "var(--grid-template-hero)",
            gridAutoRows: "minmax(0, 1fr)",
            gridTemplateRows: "repeat(1, minmax(0, 1fr))",
            height: "calc(100vw / 5 * 1.25)",
            position: "relative",
            zIndex: 0,
            marginBottom: "-10vw",
          }}
        >
          {PortfolioItems.map((item, index) => (
            <PortfolioItemWidget key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </>
  );
}
