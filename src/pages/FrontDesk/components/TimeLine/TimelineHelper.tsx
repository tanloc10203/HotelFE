import { Box, Stack, Typography } from "@mui/material";
import { FieldChangeHandlerContext } from "@mui/x-date-pickers/internals";
import { Dayjs } from "dayjs";
import { FC } from "react";
import { DatePickerMain } from "~/components";
import { BookingStatus } from "~/types";
import { fBookingStatusTimelineColor } from "~/utils";

export type HelperTimeState = { type: BookingStatus; value: string };

type TimelineHelperProps = {
  helpers: HelperTimeState[];
  value?: Dayjs | null;
  onChange?: (value: Dayjs | null, context: FieldChangeHandlerContext<string | null>) => void;
};

const TimelineHelper: FC<TimelineHelperProps> = ({ helpers, value, onChange }) => {
  return (
    <Stack mb={2} alignItems={"center"} justifyContent={"space-between"} flexDirection={"row"}>
      <Stack flexDirection={"row"} gap={4} flexWrap={"wrap"}>
        {helpers.map((row) => (
          <Stack key={row.value} flexDirection={"row"} gap={1}>
            <Box
              width={"20px"}
              height={"20px"}
              sx={{
                background: ({ palette: { mode } }) => fBookingStatusTimelineColor(row.type, mode),
                borderRadius: "100%",
              }}
            />
            <Typography>{row.value}</Typography>
          </Stack>
        ))}
      </Stack>

      <Box width={200}>
        <DatePickerMain label="" value={value} onChange={onChange} />
      </Box>
    </Stack>
  );
};

export default TimelineHelper;
