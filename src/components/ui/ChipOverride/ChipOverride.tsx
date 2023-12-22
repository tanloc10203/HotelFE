import { Chip, ChipTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { ComponentProps, FC } from "react";

type Props = {
  background?: string;
  colorOverride?: string;
  notHover?: boolean;
} & ComponentProps<OverridableComponent<ChipTypeMap<{}, "div">>>;

const ChipOverride: FC<Props> = ({ background, colorOverride, notHover, ...props }) => {
  return (
    <Chip
      sx={{
        borderRadius: "8px",
        backgroundColor: background ?? "rgb(33, 43, 54)",
        color: colorOverride ?? "rgb(255, 255, 255)",
        transition:
          "background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        height: "24px",
        ...(notHover
          ? {}
          : {
              "&:hover": {
                backgroundColor: "rgb(69, 79, 91)",
              },
              "& .MuiChip-deleteIcon": {
                opacity: 0.48,
                color: "currentcolor",
                width: "20px",
                height: "20px",
                fontSize: "16px",
                "&:hover": {
                  color: "currentcolor",
                  opacity: 1,
                },
              },
            }),
      }}
      {...props}
    />
  );
};

export default ChipOverride;
