import { Box, Stack } from "@mui/material";
import dayjs from "dayjs";
import { FC } from "react";
import { currentDate } from "~/utils";
import DateTimePicker from "../../DateTimePicker";

type InformationTimeProps = {
  checkIn: string;
  checkOut: string;
  checkedIn: string;
  checkedOut?: string;
};

const InformationTime: FC<InformationTimeProps> = ({
  checkIn,
  checkOut,
  checkedIn,
  checkedOut,
}) => {
  return (
    <Stack mb={2} gap={2} flexDirection={"row"}>
      <Box>
        <DateTimePicker disabled value={dayjs(checkIn)} key={"check-out"} label="Nhận phòng" />
      </Box>

      <Box>
        <DateTimePicker disabled value={dayjs(checkOut)} key={"check-out"} label="Trả phòng" />
      </Box>

      <Box>
        <DateTimePicker
          disabled
          value={dayjs(checkedIn)}
          key={"check-in"}
          label="Ngày nhận phòng"
        />
      </Box>

      <Box>
        <DateTimePicker
          minDate={checkedOut ? dayjs(checkedOut) : currentDate()}
          disabled
          value={dayjs()}
          key={"check-out"}
          label="Trả phòng lúc"
        />
      </Box>
    </Stack>
  );
};

export default InformationTime;
