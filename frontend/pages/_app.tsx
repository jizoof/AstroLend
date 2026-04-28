"use client";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  if (typeof window === "undefined") {
    return null;
  }

  return <Component {...pageProps} />;
}