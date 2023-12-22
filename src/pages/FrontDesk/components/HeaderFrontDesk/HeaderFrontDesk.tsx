import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import { Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { FC } from "react";

export type ModeFrontDesk = "grid" | "timeline";

type HeaderFrontDeskProps = {
  mode: ModeFrontDesk;
  onToggleMode?: (mode: ModeFrontDesk) => void;
  onOpenBooking?: () => void;
  onOpenDialogListBooking?: () => void;
};

const HeaderFrontDesk: FC<HeaderFrontDeskProps> = ({
  mode,
  onOpenBooking,
  onToggleMode,
  onOpenDialogListBooking,
}) => {
  return (
    <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>
      <Stack flexDirection={"row"} gap={0.5}>
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          sx={{
            transition: "all 0.15s ease-in-out 0s",
            background: ({ palette }) => (mode === "grid" ? palette.primary.main : "white"),
            color: ({ palette }) =>
              mode === "grid"
                ? palette.mode === "light"
                  ? palette.common.white
                  : palette.common.black
                : palette.common.black,
            px: mode === "grid" ? 1 : 0,
            borderRadius: "8px",
          }}
        >
          <Tooltip title="Dạng lưới" placement="top-start" arrow>
            <IconButton onClick={() => onToggleMode?.("grid")} aria-label="delete" color="inherit">
              <ListIcon />
            </IconButton>
          </Tooltip>
          {mode === "grid" ? <Typography fontSize={14}>Lưới</Typography> : null}
        </Stack>

        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          sx={{
            background: ({ palette }) => (mode === "timeline" ? palette.primary.main : "white"),
            color: ({ palette }) =>
              mode === "timeline"
                ? palette.mode === "light"
                  ? palette.common.white
                  : palette.common.black
                : palette.common.black,
            px: mode === "timeline" ? 1 : 0,
            borderRadius: "8px",
          }}
        >
          <Tooltip title="Dạng thời gian" placement="top-start" arrow>
            <IconButton
              onClick={() => onToggleMode?.("timeline")}
              aria-label="delete"
              color="inherit"
            >
              <ViewCompactIcon />
            </IconButton>
          </Tooltip>
          {mode === "timeline" ? <Typography fontSize={14}>Thời gian</Typography> : null}
        </Stack>

        <Button
          onClick={onOpenDialogListBooking}
          variant="contained"
          color="success"
          sx={{ textTransform: "uppercase" }}
        >
          Danh sách đặt phòng
        </Button>
      </Stack>

      <Stack>
        <Button onClick={onOpenBooking} variant="contained" startIcon={<AddIcon />}>
          Đặt phòng
        </Button>
      </Stack>
    </Stack>
  );
};

export default HeaderFrontDesk;
