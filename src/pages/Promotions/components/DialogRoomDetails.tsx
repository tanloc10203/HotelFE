import CloseIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import * as React from "react";
import { ForPage } from "~/layouts";
import { IRoomResponse } from "~/types";
import { colors, fCurrency, fDateTime } from "~/utils";

const { CardDashed } = ForPage;

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

type DialogRoomDetailsProps = {
  row: IRoomResponse;
  open: boolean;
  onClose: () => void;
};

const DialogRoomDetails: React.FC<DialogRoomDetailsProps> = ({ row, open, onClose }) => {
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
        Phòng: {row.roomType.name}
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
        <Typography component={"span"} letterSpacing={0.3} fontWeight={700}>
          * Mô tả:{" "}
          <Typography
            component={"span"}
            color={"text.secondary"}
            fontStyle={"italic"}
            variant="body1"
          >
            {row.roomType.desc}
          </Typography>
        </Typography>

        <Stack
          flexGrow={1}
          mt={2}
          flexWrap={"wrap"}
          alignItems={"center"}
          flexDirection={"row"}
          gap={1}
        >
          <CardDashed
            label="Loại phòng"
            data={row.roomType.name}
            keyData="name"
            colorChip={colors("warning", theme).colorActive}
            backgroundChip={colors("warning", theme).bgActive}
          />

          <CardDashed
            label="Vị trí phòng"
            data={row.floor.name}
            keyData="name"
            colorChip={colors("red", theme).colorActive}
            backgroundChip={colors("red", theme).bgActive}
          />
          <CardDashed
            label="Giá phòng"
            data={`${fCurrency(row?.roomType?.prices?.price_day! ?? 0)}`}
            keyData="name"
            colorChip={colors("green", theme).colorActive}
            backgroundChip={colors("green", theme).bgActive}
          />
        </Stack>

        <Stack
          flexGrow={1}
          mt={2}
          flexWrap={"wrap"}
          alignItems={"center"}
          flexDirection={"row"}
          gap={1}
        >
          <CardDashed
            label="Ngày tạo"
            data={fDateTime(row?.created_at!, "dd / MM / yyyy p")}
            keyData="name"
            colorChip={colors("default", theme).colorActive}
            backgroundChip={colors("default", theme).bgActive}
          />
          <CardDashed
            label="Ngày cập nhật"
            data={fDateTime(row?.updated_at!, "dd / MM / yyyy p")}
            keyData="name"
            colorChip={colors("default", theme).colorActive}
            backgroundChip={colors("default", theme).bgActive}
          />
          <CardDashed
            label="Số lượng người tối đa"
            data={`${row.adults}`}
            keyData="name"
            colorChip={colors("default", theme).colorActive}
            backgroundChip={colors("default", theme).bgActive}
          />
        </Stack>

        <Stack
          flexGrow={1}
          mt={2}
          flexWrap={"wrap"}
          alignItems={"center"}
          flexDirection={"row"}
          gap={1}
        >
          {row.roomType?.equipments?.length ? (
            <CardDashed label="Thiết bị" data={row.roomType.equipments} keyData="name" />
          ) : null}

          {row?.roomType.amenities?.length ? (
            <CardDashed label="Tiện nghi" data={row.roomType?.amenities} keyData="name" />
          ) : null}
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

export default DialogRoomDetails;
