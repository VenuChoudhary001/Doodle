import { Provider } from "@/context";
import "@/styles/globals.css";
import { IconContext } from "react-icons";
export default function App({ Component, pageProps }) {
  return (
    <Provider>
      <IconContext.Provider
        value={{
          color: "white",
          className: "global-class-name",
          size: "1.2em",
        }}
      >
        <Component {...pageProps} />
      </IconContext.Provider>
    </Provider>
  );
}
