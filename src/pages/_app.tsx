import GlobalProvider from "@/context/Global";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "./layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalProvider>
      <Layout>
        <Head>
          <title>Minecraftle</title>
          <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
          <meta
            name="viewport"
            content="width=device-width; initial-scale=1.0;"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/icons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/icons/favicon-16x16.png"
          />
          <link rel="manifest" href="/icons/site.webmanifest" />
          <link
            rel="mask-icon"
            href="/icons//safari-pinned-tab.svg"
            color="#5bbad5"
          />
          <link rel="shortcut icon" href="/icons/favicon.ico" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta
            name="msapplication-config"
            content="/icons/browserconfig.xml"
          />
          <meta name="theme-color" content="#221A13" />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </GlobalProvider>
  );
}
