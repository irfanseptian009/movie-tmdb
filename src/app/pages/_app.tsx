"usee client";
import { Provider } from "react-redux";
import store from "../store";
import "../app/globals.css";

export default function MyApp({
  Component,
  pageProps,
}: {
  Component: React.ComponentType;
  pageProps: Record<string, unknown>;
}) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
