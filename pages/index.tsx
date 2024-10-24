import { PortfolioItems, PortfolioItemWidget } from "@/modules/Portfolio";
import Head from "next/head";
import { TextBlock } from "@/components/Content";
import { Button } from "@/components/Button";
import { HStack, VStack } from "@/components/Stack";
import Markdown from "react-markdown";
import { useState } from "react";

const Content = {
  tagline: `
Whimsical software,  
among other things
  `,
  seoDescription:
    "Peruvian-American engineer & designer based in Philadelphia, PA.",
  intro: `
Peruvian-American maker, or simply Rolando. Above is my curated work. Find me on [X](https://x.com/rnmp) and [YouTube](https://youtube.com/@rolobuilds).
  `,
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
      <TextBlock
        style={{
          height: "var(--header-height)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "var(--font-size-hero)",
          textAlign: "center",
        }}
      >
        <img
          src="/portrait.png"
          alt="logo"
          style={{
            width: "var(--dimension-logo)",
            height: "var(--dimension-logo)",
            borderRadius: "50%",
          }}
        />
        <Markdown>{Content.tagline}</Markdown>
      </TextBlock>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "var(--grid-template-hero)",
          gridAutoRows: "minmax(0, 1fr)",
          gridTemplateRows: "repeat(1, minmax(0, 1fr))",
          height: "calc(100vw / 5 * 1.25)",
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
        }}
      >
        <TextBlock
          style={{
            maxWidth: 900,
            margin: "auto",
            textAlign: "center",
            fontSize: "var(--font-size-hero2)",
            padding: "0 var(--content-padding)",
          }}
        >
          {Content.intro}
        </TextBlock>
        <HStack>
          <FancyEmailButton />
        </HStack>
      </VStack>
    </>
  );
}

const FancyEmailButton = () => {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="embossed"
      onClick={async () => {
        await navigator.clipboard.writeText("rolandomurillo@hey.com");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      style={{ width: 200, height: 54 }}
    >
      {copied ? (
        <svg
          width="24"
          height="17"
          viewBox="0 0 24 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 8.80992L8.12849 16L23 1"
            stroke="currentColor"
            strokeWidth={0.5}
          />
        </svg>
      ) : (
        "Copy email"
      )}
    </Button>
  );
};
