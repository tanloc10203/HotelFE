import { Stack, TableCell, Typography } from "@mui/material";
import { upperFirst } from "lodash";
import { FC, memo, useMemo } from "react";
import { Colors } from "~/constants";
import { SelectWeekState } from "~/types/timeline";

type TableCellDateOfWeekProps = {
  date: SelectWeekState;
};

const TableCellDateOfWeek: FC<TableCellDateOfWeekProps> = ({ date }) => {
  const renderDate = useMemo(() => upperFirst(date.dayjs.format("dddd, DD/MM/YYYY")), [date]);

  return (
    <TableCell key={date.day} style={{ minWidth: 200, padding: 0 }}>
      <Stack
        sx={{
          background: ({ palette: { mode, common } }) =>
            date.active
              ? mode === "light"
                ? Colors.GreenLight
                : Colors.GreenDark
              : mode === "light"
              ? common.white
              : common.black,
          p: 2,
        }}
        alignItems={"center"}
      >
        <Typography fontSize={14} fontWeight={700} textAlign={"center"}>
          {renderDate}
        </Typography>
      </Stack>
    </TableCell>
  );
};

export default memo(TableCellDateOfWeek);
