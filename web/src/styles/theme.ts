import { useEffect } from "react";
import { useDebounce } from "@react-hook/debounce";
import { css } from "styled-components";
import memoize from "lodash/memoize";
import {
  buttonBorder,
  buttonBorderActive,
  buttonFabBorder,
  buttonFabBorderActive,
  inputBorder,
  inputBorderRounded,
  cardBorder,
} from "./borders";

export const colors = {
  purpleDark: "#2a194d",
  purple: "#7247C4",
  purpleBackground: "#e1d8f3",
  white: "#FFFFFF",
  black: "#1A202C",
  greyBackground: "#EDF2F7",
  greyLight: "#CBD5E0",
  grey: "#718096",
  greyDark: "#2D3748",
  red: "#f05252",
  yellow: "#ffca64",
  green: "#5cb85c",
};

export const breakpoints = {
  desktop: "@media screen and (min-width: 900px)",
};

export const isDesktop = () => {
  if (typeof window !== "undefined" && window.matchMedia) {
    const mq = window.matchMedia(breakpoints.desktop.replace("@media ", ""));
    return mq.matches;
  }
  return false;
};

const SPACING_UNIT = 4;
export const spacings = memoize((n: number): string => {
  return `${n * SPACING_UNIT}px`;
});

export const ui = {
  text: "var(--text)",
  textGrey: "var(--text-grey)",

  background: "var(--background)",
  backgroundGrey: "var(--background-grey)",
  backgroundPurple: "var(--background-purple)",

  cardBorder: "var(--card-border)",
  cardBorderUrl: "var(--card-border-url)",

  inputBorderUrl: "var(--input-border-url)",
  inputBorderRoundedUrl: "var(--input-border-rounded-url)",

  buttonText: "var(--button-text)",
  buttonBackground: "var(--button-background)",
  buttonBorder: "var(--button-border)",
  buttonBorderUrl: "var(--button-border-url)",
  buttonBorderActiveUrl: "var(--button-border-active-url)",
  buttonFabBorderUrl: "var(--button-fab-border-url)",
  buttonFabBorderActiveUrl: "var(--button-fab-border-active-url)",
  buttonSelected: "var(--button-selected)",

  modalBorder: "var(--modal-border)",
  modalBackground: "var(--modal-background)",

  alertText: "var(--alert-text)",
  alertBackground: "var(--alert-background)",

  borderColor: "var(--border-color)",
  borderColorAlternate: "var(--border-color-alternate)",
  borderWavyRadius: "var(--border-wavy-radius)",
};

export const lightStyles = css`
  :root {
    --text: ${colors.black};
    --text-grey: ${colors.grey};

    --background: ${colors.white};
    --background-grey: ${colors.greyBackground};
    --background-purple: ${colors.purpleBackground};

    --card-border: ${colors.black};
    --card-border-url: url("${cardBorder(colors.greyDark)}");

    --input-border-url: url("${inputBorder(colors.greyDark)}");
    -url-url: url("${inputBorderRounded(colors.greyDark)}");

    --button-text: ${colors.black};
    --button-background: ${colors.white};
    --button-border: ${colors.black};
    --button-border-url: url("${buttonBorder(colors.greyDark)}");
    --button-border-active-url: url("${buttonBorderActive(colors.greyDark)}");
    --button-fab-border-url: url("${buttonFabBorder(colors.greyDark)}");
    --button-fab-border-active-url: url("${buttonFabBorderActive(
      colors.greyDark
    )}");
    --button-selected: ${colors.purpleBackground};

    --modal-border: ${colors.black};
    --modal-background: ${colors.white};

    --alert-text: ${colors.white};
    --alert-background: ${colors.black};

    --border-color: ${colors.greyDark};
    --border-color-alternate: ${colors.grey};
    --border-wavy-radius: 30px 2px 30% 3px / 4px 10px 3px 30px;
  }
`;

export const darkStyles = css`
  :root {
    --text: ${colors.white};
    --text-grey: ${colors.greyLight};

    --background: ${colors.black};
    --background-grey: ${colors.greyDark};
    --background-purple: ${colors.purpleDark};

    --card-border: ${colors.greyLight};
    --card-border-url: url("${cardBorder(colors.greyLight)}");

    --input-border-url: url("${inputBorder(colors.greyLight)}");
    -url-url: url("${inputBorderRounded(colors.greyLight)}");

    --button-text: ${colors.white};
    --button-background: ${colors.black};
    --button-border: ${colors.greyLight};
    --button-border-url: url("${buttonBorder(colors.greyLight)}");
    --button-border-active-url: url("${buttonBorderActive(colors.greyLight)}");
    --button-fab-border-url: url("${buttonFabBorder(colors.greyLight)}");
    --button-fab-border-active-url: url("${buttonFabBorderActive(
      colors.greyLight
    )}");
    --button-selected: ${colors.purple};

    --modal-border: ${colors.greyLight};
    --modal-background: ${colors.black};

    --alert-text: ${colors.black};
    --alert-background: ${colors.white};

    --border-color: ${colors.greyLight};
    --border-color-alternate: ${colors.grey};
    --border-wavy-radius: 30px 2px 30% 3px / 4px 10px 3px 30px;
  }
`;

export const theme = {
  colors,
  breakpoints,
  spacings,
  ui,
};

export const useIsDesktop = () => {
  const [desktop, setDesktop] = useDebounce(isDesktop());

  useEffect(() => {
    const onResize = () => {
      setDesktop(isDesktop());
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return desktop;
};
