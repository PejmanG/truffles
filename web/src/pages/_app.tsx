import type { AppProps } from "next/app";
import type { NextPage } from "next";
import Router from "next/router";
import localFont from "@next/font/local";
import { trpc } from "~/utils/trpc";
import { StyleProvider } from "~/styles/global";
import { AlertProvider, ProgressBar } from "~/components";
import { AuthProvider } from "~/lib/auth/useAuth";
import "../styles/globals.css";

const chalkboradSEFont = localFont({
  src: [
    {
      path: "../assets/fonts/ChalkboardSE-Regular.woff2",
    },
    {
      path: "../assets/fonts/ChalkboardSE-Regular.woff",
    },
  ],
  style: "normal",
  weight: "normal",
  display: "fallback",
  variable: "--font-chalkboard-se"
});

const progress = new ProgressBar();

type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type Props = AppProps & {
  Component: Page;
};

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeError", progress.finish);
Router.events.on("routeChangeComplete", progress.finish);

const MyApp = ({ Component, pageProps }: Props) => {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <StyleProvider>
      <AlertProvider>
        <AuthProvider>
          {getLayout(
            <main className={chalkboradSEFont.className}>
              <Component {...pageProps} />
            </main>
          )}
        </AuthProvider>
      </AlertProvider>
    </StyleProvider>
  );
};

export default trpc.withTRPC(MyApp);
