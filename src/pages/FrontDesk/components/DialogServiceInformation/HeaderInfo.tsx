import { Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { FC, memo } from "react";
import { useFrontDeskSelector } from "~/features/frontDesk";
import { useCalcTimeUsedInRoom } from "~/hooks/useCalcTimeUsedInRoom";
import DateTimePicker from "../DateTimePicker";

type HeaderInfoProps = {};

const HeaderInfo: FC<HeaderInfoProps> = () => {
  const {
    informationRoom: { data },
  } = useFrontDeskSelector();
  const duration = useCalcTimeUsedInRoom(data?.bookingDetails?.checked_in || "");

  return (
    <Stack flexDirection={"row"} gap={1}>
      <DateTimePicker disabled label={"Ngày nhận"} value={dayjs(data?.bookingDetails?.check_in)} />
      <DateTimePicker
        disabled
        label={"Ngày đã nhận"}
        value={dayjs(data?.bookingDetails?.updated_at)}
      />
      <DateTimePicker disabled label={"Ngày trả"} value={dayjs(data?.bookingDetails?.check_out)} />

      <Stack width={300}>
        <Typography fontSize={14} color={(theme) => theme.palette.error.main} fontWeight={700}>
          Đã sử dụng: {duration}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default memo(HeaderInfo);
