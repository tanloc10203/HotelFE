import { TableCell } from "@mui/material";
import { FC, memo } from "react";

type TableCellLabelNameFloorProps = {
  name: string;
};

const TableCellLabelNameFloor: FC<TableCellLabelNameFloorProps> = ({ name }) => {
  return (
    <TableCell
      align="center"
      sx={{
        background: (theme) =>
          theme.palette.mode === "light" ? theme.palette.grey[200] : theme.palette.grey[900],
        fontWeight: 700,
      }}
    >
      {name}
    </TableCell>
  );
};

export default memo(TableCellLabelNameFloor);
