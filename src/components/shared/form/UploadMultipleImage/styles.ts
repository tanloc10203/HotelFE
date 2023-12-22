import { SXProps } from "~/types";

type TypeResponse = Record<string, SXProps>;

const useStyles = (error = false): TypeResponse => {
  return {
    label: {
      fontWeight: 600,
      lineHeight: 1.57143,
      fontSize: `0.875rem`,
      color: ({ palette }) => (error ? palette.error.main : palette.text),
    },
    boxInputContainer: {
      border: ({ palette }) =>
        `1px dashed ${error ? palette.error.main : "rgba(145, 158, 171, 0.2)"}`,
      borderRadius: 1,
      transition: `opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, padding 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
      cursor: "pointer",
      background: ({ palette: { mode, grey } }) => (mode === "dark" ? grey[900] : grey[100]),
      "&:hover": {
        opacity: 0.7,
      },
      p: "40px",
    },
    iconImage: { width: "100%", height: "100%", maxWidth: "200px" },
  };
};

export default useStyles;
