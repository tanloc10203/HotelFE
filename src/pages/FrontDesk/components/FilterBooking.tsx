import { Box, Chip, SelectChangeEvent, Stack } from "@mui/material";
import { FC } from "react";
import { SelectInput } from "~/components";
import DateTimePicker from "./DateTimePicker";
import dayjs, { Dayjs } from "dayjs";

type FilterBookingProps = {
  onChangeMode?: (event: SelectChangeEvent<unknown>) => void;
  modeValue: string;
  checkIn: Dayjs;
  checkOut: Dayjs;
  calcDateTime: string;
  onChangeCheckIn?: (value: Dayjs | null) => void;
  onChangeCheckOut?: (value: Dayjs | null) => void;
};

function currentDate() {
  return dayjs(new Date());
}

const FilterBooking: FC<FilterBookingProps> = ({
  onChangeMode,
  onChangeCheckOut,
  onChangeCheckIn,
  modeValue,
  checkIn,
  checkOut,
  calcDateTime,
}) => {
  return (
    <Stack
      flexDirection={"row"}
      alignItems={"center"}
      justifyItems={"center"}
      justifySelf={"center"}
      justifyContent={"flex-start"}
      gap={0.5}
      my={1}
    >
      <Box width={"15%"}>
        <SelectInput
          onChange={onChangeMode}
          value={modeValue}
          sizeForm="small"
          margin="none"
          options={[
            { label: "Theo giờ", value: "time" },
            { label: "Theo ngày", value: "day" },
          ]}
          label="Hình thức"
        />
      </Box>

      <DateTimePicker
        minDate={currentDate()}
        value={checkIn}
        minDatetime={currentDate()}
        key={"check-in"}
        label="Nhận phòng"
        onChange={onChangeCheckIn}
      />

      <DateTimePicker
        onChange={onChangeCheckOut}
        minDate={checkIn}
        minDatetime={checkIn}
        value={checkOut}
        key={"check-out"}
        label="Trả phòng"
      />

      {calcDateTime ? (
        <Stack pt={1} justifyContent={"center"} alignItems={"center"} height={"100%"}>
          <Chip label={calcDateTime} color="success" />
        </Stack>
      ) : null}
    </Stack>
  );
};

export default FilterBooking;
