import { DialogContent, Drawer, Stack, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";
import { upperFirst } from "lodash";
import { FC, KeyboardEvent, MouseEvent, useCallback } from "react";
import { AppbarDialog } from "~/components";
import EndAdornmentCheck from "~/components/shared/EndAdornment/EndAdornmentCheck";
import EndAdornmentDate from "~/components/shared/EndAdornment/EndAdornmentDate";
import EndAdornmentInActive from "~/components/shared/EndAdornment/EndAdornmentInActive";
import { SCROLLBAR_CUSTOM } from "~/constants";
import { PriceListState } from "~/types/priceList.model";
import { fDateDayjs } from "~/utils";
import { convertIsDefaultPriceList } from "~/utils/convert";
import TableDetailsRoom from "./TableDetailsRoom";

type DrawerSeePriceListProps = {
  open: boolean;
  data: PriceListState;
  onClose?: () => void;
};

const DrawerSeePriceList: FC<DrawerSeePriceListProps> = ({ open, data, onClose }) => {
  const handleOnClose = useCallback(
    (event: KeyboardEvent | MouseEvent) => {
      if (
        (event.type === "keydown" &&
          ((event as KeyboardEvent).key === "Tab" || (event as KeyboardEvent).key === "Shift")) ||
        !onClose
      ) {
        return;
      }

      onClose();
    },
    [onClose]
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleOnClose}
      PaperProps={{ sx: { borderRadius: `12px 0 0 12px`, width: "70%" } }}
      sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
    >
      <AppbarDialog title={`${data.name}`} onClose={onClose} />

      <DialogContent sx={{ width: "auto", ...SCROLLBAR_CUSTOM }} role="presentation">
        <Stack flexDirection={"row"} gap={2}>
          <TextField
            label="Mã bảng giá"
            value={data.id}
            disabled
            size="small"
            sx={{
              "& input": {
                fontSize: 14,
                color: (theme) =>
                  data.is_default ? theme.palette.success.main : theme.palette.error.main,
                WebkitTextFillColor: "unset !important",
                fontWeight: 700,
              },
            }}
          />

          <TextField
            label="Trạng thái"
            value={convertIsDefaultPriceList(data.is_default)}
            disabled
            size="small"
            sx={{
              "& input": {
                fontSize: 14,
                color: (theme) =>
                  data.is_default ? theme.palette.success.main : theme.palette.error.main,
                WebkitTextFillColor: "unset !important",
                fontWeight: 700,
              },
            }}
            InputProps={{
              endAdornment: data.is_default ? <EndAdornmentCheck /> : <EndAdornmentInActive />,
            }}
          />

          <TextField
            label="Ngày bắt đầu"
            value={fDateDayjs(dayjs(data.start_time), "DD/MM/YYYY")}
            disabled
            size="small"
            sx={{
              "& input": {
                fontSize: 14,
                color: (theme) => theme.palette.primary.main,
                WebkitTextFillColor: "unset !important",
                fontWeight: 700,
              },
            }}
            InputProps={{
              endAdornment: <EndAdornmentDate />,
            }}
          />

          <TextField
            label="Ngày kết thúc"
            value={fDateDayjs(dayjs(data.end_time), "DD/MM/YYYY")}
            disabled
            size="small"
            sx={{
              "& input": {
                fontSize: 14,
                color: (theme) => theme.palette.primary.main,
                WebkitTextFillColor: "unset !important",
                fontWeight: 700,
              },
            }}
            InputProps={{
              endAdornment: <EndAdornmentDate />,
            }}
          />
        </Stack>

        <Stack flexDirection={"row"} gap={2} mt={2}>
          <TextField
            label="Ngày tạo"
            value={upperFirst(fDateDayjs(dayjs(data.created_at)))}
            disabled
            size="small"
            sx={{
              "& input": {
                fontSize: 14,
                color: (theme) => theme.palette.secondary.main,
                WebkitTextFillColor: "unset !important",
                fontWeight: 700,
              },
            }}
            InputProps={{
              endAdornment: <EndAdornmentDate />,
            }}
          />

          <TextField
            label="Ngày cập nhật"
            value={upperFirst(fDateDayjs(dayjs(data.updated_at)))}
            disabled
            size="small"
            sx={{
              "& input": {
                fontSize: 14,
                color: (theme) => theme.palette.secondary.main,
                WebkitTextFillColor: "unset !important",
                fontWeight: 700,
              },
            }}
            InputProps={{
              endAdornment: <EndAdornmentDate />,
            }}
          />
        </Stack>

        <Stack mt={2}>
          <TextField
            label="Mô tả bảng giá"
            multiline
            rows={3}
            disabled
            value={data.description}
            size="small"
            sx={{
              "& textarea": {
                fontSize: 14,
                WebkitTextFillColor: "unset !important",
                fontWeight: 700,
              },
            }}
          />
        </Stack>

        <Stack mt={4} gap={2}>
          <Typography fontWeight={700}>Chi tiết bảng giá phòng</Typography>

          <TableDetailsRoom roomTypes={data.roomTypes} />
        </Stack>
      </DialogContent>
    </Drawer>
  );
};

export default DrawerSeePriceList;
