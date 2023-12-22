import CloseIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { ForPage } from "~/layouts";
import { IRoomTypeResponse } from "~/types";
import { fDateTime } from "~/utils";

const { CardDashed } = ForPage;

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

type DialogRoomTypeDetailsProps = {
  row: IRoomTypeResponse;
  open: boolean;
  onClose: () => void;
};

const DialogRoomTypeDetails: React.FC<DialogRoomTypeDetailsProps> = ({ row, open, onClose }) => {
  return (
    <BootstrapDialog
      maxWidth="md"
      fullWidth
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Loại phòng: {row.name}
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
            {row.desc}
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
            label="Ngày tạo"
            data={fDateTime(row?.created_at!, "dd / MM / yyyy p")}
            keyData="name"
          />
          <CardDashed
            label="Ngày cập nhật"
            data={fDateTime(row?.updated_at!, "dd / MM / yyyy p")}
            keyData="name"
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
          {row?.equipments?.length ? (
            <CardDashed label="Thiết bị" data={row?.equipments} keyData="name" />
          ) : null}

          {row?.amenities?.length ? (
            <CardDashed label="Tiện nghi" data={row?.amenities} keyData="name" />
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

export default DialogRoomTypeDetails;
