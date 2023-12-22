import { FormHelperText } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputBase, { InputBaseProps } from "@mui/material/InputBase";
import InputLabel from "@mui/material/InputLabel";
import { alpha, styled } from "@mui/material/styles";
import { FC, ReactNode } from "react";

const BootstrapInput = styled(InputBase)<InputBaseProps>(({ theme, fullWidth, error }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    // backgroundColor: theme.palette.mode === "light" ? "#F3F6F9" : "#1A2027",
    border: "1px solid",
    borderColor: error
      ? theme.palette.error.main
      : theme.palette.mode === "light"
      ? "#E0E3E7"
      : "#2D3843",
    fontSize: 16,
    width: fullWidth ? "100%" : "auto",
    padding: "14px",
    transition: theme.transitions.create(["border-color", "background-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
    "&:hover": {
      borderColor: error
        ? theme.palette.error.main
        : theme.palette.mode === "dark"
        ? theme.palette.common.white
        : theme.palette.common.black,
    },
  },
}));

type TextFieldBootstrapProps = {
  label: string;
  helperText?: ReactNode;
  marginFormControl?: "normal" | "dense" | "none";
} & InputBaseProps;

const TextFieldBootstrap: FC<TextFieldBootstrapProps> = ({
  label,
  helperText,
  marginFormControl,
  ...props
}) => {
  return (
    <FormControl
      margin={marginFormControl}
      variant="standard"
      error={props?.error}
      fullWidth={props?.fullWidth}
    >
      <InputLabel shrink htmlFor={props?.name}>
        {label}
      </InputLabel>
      <BootstrapInput id={props?.name} {...props} fullWidth />
      {props?.error ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};

export default TextFieldBootstrap;
