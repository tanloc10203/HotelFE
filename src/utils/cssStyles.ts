// @mui
import { Theme, alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

export function bgBlur(props: any) {
  const color = props?.color || "#000000";
  const blur = props?.blur || 6;
  const opacity = props?.opacity || 0.8;
  const imgUrl = props?.imgUrl;

  if (imgUrl) {
    return {
      position: "relative",
      backgroundImage: `url(${imgUrl})`,
      "&:before": {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 9,
        content: '""',
        width: "100%",
        height: "100%",
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: alpha(color, opacity),
      },
    };
  }

  return {
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    backgroundColor: alpha(color, opacity),
  };
}

// ----------------------------------------------------------------------

export function bgGradient(props: any) {
  const direction = props?.direction || "to bottom";
  const startColor = props?.startColor;
  const endColor = props?.endColor;
  const imgUrl = props?.imgUrl;
  const color = props?.color;

  if (imgUrl) {
    return {
      background: `linear-gradient(${direction}, ${startColor || color}, ${
        endColor || color
      }), url(${imgUrl})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
    };
  }

  return {
    background: `linear-gradient(${direction}, ${startColor}, ${endColor})`,
  };
}

// ----------------------------------------------------------------------

export function textGradient(value: any) {
  return {
    background: `-webkit-linear-gradient(${value})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };
}

// ----------------------------------------------------------------------

export function filterStyles(value: any) {
  return {
    filter: value,
    WebkitFilter: value,
    MozFilter: value,
  };
}

// ----------------------------------------------------------------------

export const hideScrollbarY = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
  overflowY: "scroll",
  "&::-webkit-scrollbar": {
    display: "none",
  },
};

// ----------------------------------------------------------------------

export const hideScrollbarX = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
  overflowX: "scroll",
  "&::-webkit-scrollbar": {
    display: "none",
  },
};

export type ColorsProps = "red" | "green" | "warning" | "muted" | "default";
type ColorReturn = {
  bg: string;
  bgActive: string;
  color: string;
  colorActive: string;
};

export const colors = (color: ColorsProps, theme: Theme) => {
  // console.log({ white: theme.palette.common.white, black: theme.palette.common.black });

  const colors: Record<ColorsProps, ColorReturn> = {
    default: {
      bg: theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black,
      bgActive:
        theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.common.black,
      color:
        theme.palette.mode === "dark" ? theme.palette.common.black : theme.palette.common.white,
      colorActive:
        theme.palette.mode === "dark" ? theme.palette.common.black : theme.palette.common.white,
    },
    green: {
      bg: "rgba(34, 197, 94, 0.16)",
      bgActive: "rgb(34, 197, 94)",
      color: "rgb(17, 141, 87)",
      colorActive: "rgb(255, 255, 255)",
    },
    muted: {
      bg: "rgba(145, 158, 171, 0.16)",
      bgActive: "rgb(145, 158, 171)",
      color: "rgb(99, 115, 129)",
      colorActive: "rgb(255, 255, 255)",
    },
    warning: {
      bg: "rgba(255, 171, 0, 0.16)",
      bgActive: "rgb(255, 171, 0)",
      color: "rgb(183, 110, 0)",
      colorActive: "rgb(255, 255, 255)",
    },
    red: {
      bg: "rgba(255, 86, 48, 0.16)",
      bgActive: "rgb(255, 86, 48)",
      color: "rgb(255, 172, 130)",
      colorActive: "rgb(255, 255, 255)",
    },
  };

  return colors[color];
};
