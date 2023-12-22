import { Collapse, Stack, TableCell, TableRow, TextField } from "@mui/material";
import { FC, Fragment } from "react";
import { ColumnState, EndAdornmentVND, NumericFormatCustom, TableCellOverride } from "~/components";
import { Colors } from "~/constants";
import { ForPage } from "~/layouts";
import { IRoomType } from "~/types";
import PriceByHour from "../DialogAddEditPriceList/PriceByHour";
import { RenderItemPriceByHour } from "../DialogAddEditPriceList/RenderItemPriceByHour";

const { Table } = ForPage;

type TableDetailsRoomProps = {
  roomTypes: IRoomType[];
};

const TableDetailsRoom: FC<TableDetailsRoomProps> = ({ roomTypes }) => {
  const columns: ColumnState[] = [
    {
      id: "name",
      label: "Loại phòng",
      minWidth: 50,
      maxWidth: 50,
    },
    {
      id: "type_price",
      label: "Loại giá",
      minWidth: 30,
      maxWidth: 30,
      styles: { padding: 0 },
      align: "center",
    },
    { id: "set_price", label: "Mức giá", minWidth: 40, maxWidth: 160 },
  ];

  return (
    <Table
      autoHeight
      columns={columns}
      sxHeadCell={{
        background: ({ palette: { mode } }) =>
          mode === "light" ? Colors.GreenLight : Colors.GreenDark,
      }}
    >
      {roomTypes.length ? (
        roomTypes.map((row, idxP) => (
          <Fragment key={row.id}>
            {/* Set time */}
            <TableRow
              sx={{
                background: ({ palette: { mode, grey } }) =>
                  idxP % 2 === 0
                    ? mode === "light"
                      ? grey[100]
                      : grey[800]
                    : mode === "light"
                    ? "white"
                    : grey[800],
                "& th:nth-of-type(1)": { borderBottom: "none !important" },
              }}
            >
              {columns.map((column, index) => {
                const value = row[column.id as keyof IRoomType];

                if (column.id === "type_price") {
                  return (
                    <TableCellOverride {...column} key={index}>
                      Mỗi giờ
                    </TableCellOverride>
                  );
                }

                if (column.id === "set_price") {
                  return (
                    <TableCellOverride {...column} key={index}>
                      <PriceByHour data={row?.prices?.price_hours!}>
                        {row?.prices?.price_hours.map((priceHour, idx, old) => (
                          <Collapse key={idx}>
                            <RenderItemPriceByHour
                              hiddenAction
                              disabled
                              isShowAdd={Boolean(old.length - 1 === idx)}
                              index={idx}
                              price={priceHour}
                            />
                          </Collapse>
                        ))}
                      </PriceByHour>
                    </TableCellOverride>
                  );
                }

                return (
                  <TableCellOverride key={index} {...column}>
                    {value as string}
                  </TableCellOverride>
                );
              })}
            </TableRow>

            {/* Set days */}
            <TableRow
              sx={{
                background: ({ palette: { mode, grey } }) =>
                  idxP % 2 === 0
                    ? mode === "light"
                      ? grey[100]
                      : grey[800]
                    : mode === "light"
                    ? "white"
                    : grey[800],
                "& th:nth-of-type(1)": {
                  borderBottom: "none !important",
                  borderTop: "none !important",
                },
              }}
            >
              {columns.map((column, index) => {
                if (column.id === "type_price") {
                  return (
                    <TableCellOverride {...column} key={index}>
                      Mỗi ngày
                    </TableCellOverride>
                  );
                }

                if (column.id === "set_price") {
                  return (
                    <TableCellOverride {...column} key={index}>
                      <Stack flexDirection={"row"} gap={1}>
                        <Stack>
                          <TextField
                            label="Giá offline"
                            size="small"
                            disabled
                            value={row?.prices?.price_offline}
                            InputProps={{
                              inputComponent: NumericFormatCustom as any,
                              endAdornment: <EndAdornmentVND />,
                            }}
                            sx={{
                              "& input": {
                                fontSize: 14,
                                color: (theme) => theme.palette.error.main,
                                WebkitTextFillColor: "unset !important",
                                fontWeight: 700,
                              },
                            }}
                          />
                        </Stack>

                        <Stack>
                          <TextField
                            label="Giá online"
                            size="small"
                            disabled
                            value={row?.prices?.price_online}
                            InputProps={{
                              inputComponent: NumericFormatCustom as any,
                              endAdornment: <EndAdornmentVND />,
                            }}
                            sx={{
                              "& input": {
                                fontSize: 14,
                                color: (theme) => theme.palette.error.main,
                                WebkitTextFillColor: "unset !important",
                                fontWeight: 700,
                              },
                            }}
                          />
                        </Stack>
                      </Stack>
                    </TableCellOverride>
                  );
                }

                return (
                  <TableCellOverride key={index} {...column}>
                    <></>
                  </TableCellOverride>
                );
              })}
            </TableRow>
          </Fragment>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length}>Chưa có loại phòng nào</TableCell>
        </TableRow>
      )}
    </Table>
  );
};

export default TableDetailsRoom;
