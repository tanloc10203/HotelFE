import { Popover, PopoverProps, useTheme } from "@mui/material";
import React from "react";

export type PopoverOverrideProps = PopoverProps;

const PopoverOverride: React.FC<PopoverOverrideProps> = (props) => {
  const theme = useTheme();

  return (
    <Popover
      anchorOrigin={{
        vertical: "center",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "right",
      }}
      slotProps={{
        paper: {
          sx: {
            backgroundImage:
              "url(/assets/images/background/cyan-blur.png), url(/assets/images/background/red-blur.png)",
            backgroundRepeat: "no-repeat, no-repeat",
            backgroundPosition: "right top, left bottom",
            backgroundSize: "50%, 50%",
            backdropFilter: "blur(20px)",
            backgroundColor:
              theme.palette.mode === "dark" ? "rgba(33, 43, 54, 0.9)" : "rgba(255, 255, 255, 0.9)",
            p: "4px",
            boxShadow:
              theme.palette.mode === "dark"
                ? `rgba(0, 0, 0, 0.24) 0px 0px 2px 0px, rgba(0, 0, 0, 0.24) -20px 20px 40px`
                : `rgba(145, 158, 171, 0.24) 0px 0px 2px 0px, rgba(145, 158, 171, 0.24) -20px 20px 40px -4px`,
          },
        },
      }}
      {...props}
    />
  );
};

export default PopoverOverride;
