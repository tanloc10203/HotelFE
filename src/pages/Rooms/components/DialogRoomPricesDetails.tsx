import CloseIcon from "@mui/icons-material/Close";
import { Stack, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { FC } from "react";
import { BootstrapDialog } from "~/components";
import { ForPage } from "~/layouts";
import { IRoomPrice } from "~/types";
import { colors, fCurrency, fDateTime } from "~/utils";

const { CardDashed } = ForPage;

type DialogRoomPricesDetailsProps = {
  open: boolean;
  onClose: () => void;
  data: IRoomPrice[];
};

const DialogRoomPricesDetails: FC<DialogRoomPricesDetailsProps> = ({ open, onClose, data }) => {
  const theme = useTheme();

  return (
    <BootstrapDialog
      maxWidth="md"
      fullWidth
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Danh sách bảng giá đã thay đổi
      </DialogTitle>

      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent dividers>
        <Stack
          flexGrow={1}
          mt={2}
          flexWrap={"wrap"}
          alignItems={"center"}
          flexDirection={"row"}
          gap={1}
        >
          {data.map((row) => (
            <CardDashed
              label={fDateTime(row?.created_at!, "dd / MM / yyyy p")}
              data={fCurrency(row.price)}
              keyData="name"
              colorChip={colors("default", theme).colorActive}
              backgroundChip={colors("default", theme).bgActive}
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          Đóng
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default DialogRoomPricesDetails;
