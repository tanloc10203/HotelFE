import { Box, Collapse, IconButton, TableCell, TableRow, Typography } from "@mui/material";
import { FC, useState } from "react";
import { ColumnState, TableCellOverride } from "~/components";
import { ForPage } from "~/layouts";
import { GoodsReceiptNote, GoodsReceiptNotesDetail } from "~/types/goodsReceiptNote";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Colors } from "~/constants";

const { Table } = ForPage;

type RowProductProps = {
  columns: ColumnState[];
  columnsDetails: ColumnState[];
  row: GoodsReceiptNote;
};

const RowProduct: FC<RowProductProps> = ({ row, columns, columnsDetails }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow key={row.id}>
        {columns.map((column, idx) => {
          const value = row[column.id as keyof GoodsReceiptNote];

          return (
            <TableCellOverride key={idx} {...column}>
              {column.id === "id" ? (
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen((prev) => !prev)}
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              ) : null}

              {column.format ? column.format(value) : (value as string)}
            </TableCellOverride>
          );
        })}
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Chi tiết
              </Typography>

              <Table
                sxHeadCell={{
                  background: ({ palette: { mode } }) =>
                    mode === "light" ? Colors.GreenLight : Colors.GreenDark,
                }}
                autoHeight
                columns={columnsDetails}
              >
                {row?.details?.map((detailsRow) => (
                  <TableRow key={detailsRow.id}>
                    {columnsDetails.map((columnDetail, idxDetail) => {
                      const valueDetail =
                        detailsRow[columnDetail.id as keyof GoodsReceiptNotesDetail];

                      if (columnDetail.id === "product") {
                        return (
                          <TableCellOverride key={idxDetail} {...columnDetail}>
                            {`${detailsRow?.product?.name} (${
                              detailsRow?.unit ? detailsRow.unit.unitData?.name : ""
                            })`}
                          </TableCellOverride>
                        );
                      }

                      return (
                        <TableCellOverride key={idxDetail} {...columnDetail}>
                          {columnDetail.format
                            ? columnDetail.format(valueDetail as string)
                            : (valueDetail as string)}
                        </TableCellOverride>
                      );
                    })}
                  </TableRow>
                ))}
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default RowProduct;
