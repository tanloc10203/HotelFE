import { TableCell, TableRow } from "@mui/material";
import { FC, ReactNode } from "react";
import { ColumnState, TableCellOverride } from "~/components";
import { ForPage } from "~/layouts";

const { Table } = ForPage;

type DataType = Record<string, any>;

type TableServiceTypesProps = {
  data: DataType[];
  columns: ColumnState[];
  page: number;
  totalPage?: number;
  onChangePage?: (newPage: number) => void;
  actions?: (item: any) => ReactNode | JSX.Element;
};

const TableServiceTypes: FC<TableServiceTypesProps> = ({
  columns,
  data,
  page,
  totalPage,
  onChangePage,
  actions,
}) => {
  return (
    <Table
      onPageChange={onChangePage}
      columns={columns}
      page={page}
      totalRow={totalPage}
      sxHeadCell={{
        background: (theme) =>
          theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
      }}
    >
      {data?.length > 0 ? (
        data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((column) => {
              const value = row[column.id as keyof DataType];

              if (column.id === "actions") {
                return <TableCellOverride {...column}>{actions?.(row)}</TableCellOverride>;
              }

              return (
                <TableCellOverride {...column}>
                  {column.format ? column.format(value as string) : (value as string)}
                </TableCellOverride>
              );
            })}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} component="th" scope="row">
            Chưa có dữ liệu
          </TableCell>
        </TableRow>
      )}
    </Table>
  );
};

export default TableServiceTypes;
