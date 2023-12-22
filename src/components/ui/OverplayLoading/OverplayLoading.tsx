import HotelIcon from "@mui/icons-material/Hotel";
import { Backdrop, Box, CircularProgress, Theme, Typography } from "@mui/material";
import { FC } from "react";
import { useOverplay } from "~/features/app";

interface OverlayLoadingProps {
  open?: boolean;
  text?: string;
}

const OverlayLoading: FC<OverlayLoadingProps> = () => {
  const { open: OpenRedux, text: textRedux } = useOverplay();

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme: Theme) => theme.zIndex.modal + 4 }}
      open={OpenRedux}
    >
      <Box position={"relative"}>
        <Box
          position={"absolute"}
          top={"50%"}
          left={"50%"}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <HotelIcon />
        </Box>
        <CircularProgress color={"inherit"} size={50} />
      </Box>
      <Typography sx={{ ml: 2 }}>{textRedux}</Typography>
    </Backdrop>
  );
};

export default OverlayLoading;
