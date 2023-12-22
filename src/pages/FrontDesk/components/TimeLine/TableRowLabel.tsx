import { TableCell, TableRow } from "@mui/material";
import { FC } from "react";
import { FrontDeskTimeline } from "~/types";
import TableRowEvent from "./TableRowEvent";
import { SelectWeekState } from "~/types/timeline";
import TableCellLabelNameFloor from "./TableCellLabelNameFloor";

type TableRowLabelProps = {
  row: FrontDeskTimeline;
  dates: SelectWeekState[];
};

const TableRowLabel: FC<TableRowLabelProps> = ({ row, dates }) => {
  return (
    <>
      <TableRow>
        <TableCellLabelNameFloor name={row.name} />

        {dates.map((t) => (
          <TableCell
            key={`${row.id}-${t.date}`}
            align="center"
            sx={{
              background: (theme) =>
                theme.palette.mode === "light" ? theme.palette.grey[200] : theme.palette.grey[900],
              fontWeight: 700,
            }}
          ></TableCell>
        ))}
      </TableRow>

      {row.rooms.length
        ? row.rooms.map((room) =>
            room?.room_numbers?.map((rn, idx) => (
              <TableRow
                key={idx}
                sx={{
                  "&:hover": {
                    background: ({ palette }) =>
                      palette.mode === "light" ? palette.grey[400] : palette.grey[500],
                  },
                }}
              >
                <TableCell>{`${rn.id} - ${room.roomType.name}`}</TableCell>

                {dates.map((date, i) => (
                  <TableRowEvent date={date} key={i} row={rn} dateIndex={i} />
                ))}
              </TableRow>
            ))
          )
        : null}
    </>
  );
};

export default TableRowLabel;
