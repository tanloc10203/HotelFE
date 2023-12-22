import { TableCell, TableCellProps } from "@mui/material";
import { FC, ReactNode } from "react";
import { ColumnState } from ".";

type TableCellOverrideProps = {
  children: ReactNode;
  onClick?: () => void;
} & ColumnState &
  Pick<TableCellProps, "onMouseDown" | "onMouseLeave" | "onMouseOut">;

const TableCellOverride: FC<TableCellOverrideProps> = (props) => {
  return (
    <TableCell
      style={{
        minWidth: props.minWidth,
        maxWidth: props.maxWidth,
        ...props.styles,
      }}
      key={props.id}
      component="th"
      scope="row"
      align={props.align}
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      onMouseLeave={props.onMouseLeave}
      onMouseOut={props.onMouseOut}
    >
      {props.children}
    </TableCell>
  );
};

export default TableCellOverride;
