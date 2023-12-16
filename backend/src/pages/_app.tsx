import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "./layout";
import { GlobalContextProvider } from "@/context/Global/context";
import GlobalProvider from "@/context/Global";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GlobalProvider>
  );
}
