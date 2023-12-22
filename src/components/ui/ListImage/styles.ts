import { SXProps } from "~/types";

type TypeResponse = Record<string, SXProps>;

const useStyles = (): TypeResponse => {
  return {
    containerImages: {
      flexDirection: "column",
      alignItems: "center",
      display: "inline-flex",
      justifyContent: "center",
      margin: "4px",
      width: "80px",
      height: "80px",
      borderRadius: "10px",
      overflow: "hidden",
      border: `1px solid rgba(145, 158, 171, 0.16)`,
      position: "relative",
    },
    image: {
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      width: "inherit",
      height: "inherit",
    },
    iconClose: {
      position: "absolute",
      top: 4,
      right: 4,
      background: `rgba(22, 28, 36, 0.48)`,
      color: "white",
      fontSize: "1.125rem",
      padding: "2px",
      transition: `background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
      "&:hover": {
        background: `rgba(22, 28, 36, 0.72)`,
      },
    },
  };
};

export default useStyles;
