import { useAnimate } from "framer-motion";
import {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { TextBlock } from "@/components/Content";
import { Button } from "@/components/Button";
import { PortfolioItem } from "../items";

const Geometry = {
  headerHeight: 80,
  containerHeight: 390,
};

type StyleSheet = {
  [key: string]: CSSProperties | StyleSheet;
};

const styles: StyleSheet = {
  container: {
    width: "auto",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: 8,
    boxShadow:
      "0px 1.0077627319085878px 0.8062101855268702px -0.21875px rgba(0, 0, 0, 0.04), 0px 2.3885756205709185px 1.9108604964567348px -0.4375px rgba(0, 0, 0, 0.03619), 0px 4.357008827588287px 3.4856070620706303px -0.65625px rgba(0, 0, 0, 0.03718), 0px 7.2435184293135535px 5.794814743450843px -0.875px rgba(0, 0, 0, 0.03862), 0px 11.697691633173964px 9.35815330653917px -1.09375px rgba(0, 0, 0, 0.04085), 0px 19.147960564453385px 15.318368451562709px -1.3125px rgba(0, 0, 0, 0.04457), 0px 32.97149505802081px 26.37719604641665px -1.53125px rgba(0, 0, 0, 0.05149), 0px 60px 48px -1.75px rgba(0, 0, 0, 0.065)",
    position: "relative",
  },
  coverImage: {
    width: 390,
    height: 390,
    objectFit: "cover",
    objectPosition: "center",
  },
};

export const PortfolioItemWidget = (props: {
  item: PortfolioItem;
  index: number;
}) => {
  const { title, description, src } = props.item;
  const [key, setKey] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [containerRef, animateContainer] = useAnimate();
  const [headerRef, animateHeader] = useAnimate();
  const containerRectRef = useRef<DOMRect>();

  const expand = async () => {
    setExpanded(true);
    const rect = containerRef.current.getBoundingClientRect();
    containerRectRef.current = rect;
    animateHeader(
      headerRef.current,
      {
        opacity: 1,
        paddingTop: Geometry.headerHeight,
      },

      { ease: "anticipate", duration: 0.5 }
    );

    const translateY = `-${Math.round(rect.top)}px`;
    const translateX = `-${Math.round(rect.left)}px`;

    await animateContainer(
      containerRef.current,
      {
        translateY,
        translateX,
        width: "100vw",
        height: "100dvh",
        borderRadius: 0,
        overflow: "auto",
        zIndex: 1,
      },
      { ease: "anticipate", duration: 0.5 }
    );
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  };

  const collapse = useCallback(async () => {
    setExpanded(false);
    containerRef.current?.scrollTo(0, 0);
    const rect = containerRectRef.current;
    if (!rect) {
      return;
    }
    animateHeader(headerRef.current, {
      opacity: 0,
      paddingTop: 0,
    });
    await animateContainer(
      containerRef.current,
      {
        translateY: 0,
        translateX: 0,
        ...styles.container,
      },
      { ease: "anticipate", duration: 0.5 }
    );
    animateContainer(containerRef.current, {
      zIndex: 0,
    });
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
    setKey((k) => k + 1);
  }, [animateContainer, animateHeader, containerRef, headerRef]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (expanded && e.key === "Escape") {
        collapse();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expanded, collapse]);

  return (
    <div
      ref={containerRef}
      key={key}
      style={{
        backgroundColor: "#1E192D",
        ...styles.container,
        aspectRatio: "1 / 1",
        marginTop: props.index === 2 ? 0 : props.index % 2 ? "2.5vw" : "5vw",
      }}
    >
      <div
        ref={headerRef}
        style={{
          position: "relative",
          opacity: 0,
          pointerEvents: expanded ? "unset" : "none",
        }}
      >
        <header
          style={{
            position: "fixed",
            top: 0,
            height: "var(--modal-header-height)",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 1rem",
          }}
        >
          <div style={{ width: "calc(var(--modal-header-height) * 0.64)" }} />
          <h1
            style={{
              color: "#fff",
              textAlign: "center",
              flex: 1,
              fontSize: "var(--font-size-headline)",
            }}
          >
            {title}
          </h1>
          <Button
            variant="tinted"
            onClick={collapse}
            style={{
              fontSize: "calc(var(--font-size-headline) * 1.5)",
              width: "calc(var(--modal-header-height) * 0.64)",
              height: "calc(var(--modal-header-height) * 0.64)",
              padding: 0,
              color: "#957FD7",
            }}
          >
            &times;
          </Button>
        </header>
      </div>
      <figure
        style={{
          cursor: expanded ? "auto" : "pointer",
          minHeight: "var(--modal-cover-height)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={expanded ? undefined : expand}
      >
        <img
          src={src}
          alt=""
          style={{
            maxHeight: "75vh",
            maxWidth: "100vw",
          }}
        />
      </figure>
      <TextBlock
        style={{
          color: "#957FD7",
          fontSize: "var(--font-size-body)",
          maxWidth: 600,
          margin: "0 auto",
          lineHeight: 1.5,
          textAlign: "center",
          padding: "0 var(--content-padding) 3em",
        }}
      >
        {description}
      </TextBlock>
    </div>
  );
};
PortfolioItemWidget.geometry = Geometry;
