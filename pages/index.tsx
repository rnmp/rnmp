import { PortfolioItems, PortfolioItemWidget } from "@/modules/Portfolio";
import Head from "next/head";
import { TextBlock } from "@/components/Content";
import { Button } from "@/components/Button";
import { HStack, VStack } from "@/components/Stack";
import Markdown from "react-markdown";

const Content = {
  tagline: `
Whimsical software,  
among other things
  `,
  seoDescription:
    "Peruvian-American engineer & designer based in Philadelphia, PA.",
  intro: `
Peruvian-American engineer & designer, or simply Rolando. Above is my favorite work, but feel free to explore the [B-side](https://world.hey.com/rolandomurillo).
  `,
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Rolando</title>
        <meta name="description" content={Content.seoDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TextBlock
        style={{
          height: "64vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 72,
          textAlign: "center",
        }}
      >
        <img
          src="/portrait.png"
          alt="logo"
          style={{ width: 88, height: 88, borderRadius: "50%" }}
        />
        <Markdown>{Content.tagline}</Markdown>
      </TextBlock>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(200px, 1fr))",
          gridAutoRows: "minmax(0, 1fr)",
          gridTemplateRows: "repeat(1, minmax(0, 1fr))",
          height: PortfolioItemWidget.geometry.containerHeight * 1.25,
          background:
            "linear-gradient(180deg, rgba(251, 251, 251, 0) 0%, rgb(251, 251, 251) 100%)",
        }}
      >
        {PortfolioItems.map((item, index) => (
          <PortfolioItemWidget key={index} item={item} index={index} />
        ))}
      </div>
      <VStack
        style={{
          paddingTop: "6em",
          paddingBottom: "6em",
          gap: "4em",
          backgroundColor: "#FBFBFB",
        }}
      >
        <TextBlock
          style={{
            maxWidth: 900,
            margin: "auto",
            textAlign: "center",
            fontSize: 48,
          }}
        >
          {Content.intro}
        </TextBlock>
        <HStack>
          <Button variant="embossed">Reach out</Button>
        </HStack>
      </VStack>
    </>
  );
}
