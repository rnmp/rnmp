import "@/styles/globals.css";
import type { AppProps } from "next/app";
import localFont from "next/font/local";

const Jugendreisen = localFont({ src: "../fonts/Jugendreisen-Small.woff2" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={Jugendreisen.className}>
      <Component {...pageProps} />
    </main>
  );
}
