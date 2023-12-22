import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useEffect } from "react";
import { ColumnState, TableCellOverride } from "~/components";
import { appActions } from "~/features/app";
import { rateActions, useRate } from "~/features/rate";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { RateState } from "~/types";
import { fDateDayjs } from "~/utils";
import { convertRate } from "~/utils/convert";

const { HeadSeo, Container, Card, Table } = ForPage;

const ReportPage = () => {
  const dispatch = useAppDispatch();
  const { data, filters, pagination } = useRate();
  const {
    palette: { mode },
  } = useTheme();

  useEffect(() => {
    dispatch(appActions.openOverplay(""));
    dispatch(rateActions.getDataStart(filters));
  }, [filters]);

  const columns: ColumnState[] = [
    { id: "room_id", label: "Mã phòng", maxWidth: 10, minWidth: 10 },
    { id: "booking_id", label: "Mã đặt phòng", maxWidth: 44 },
    {
      id: "customer",
      label: "Khách hàng",
      maxWidth: 50,
      minWidth: 10,
      format(value) {
        return value.display_name;
      },
    },
    { id: "start", label: "Mức đánh giá", maxWidth: 20, minWidth: 20, align: "center" },
    { id: "comment", label: "Cảm nghỉ", maxWidth: 100 },
    {
      id: "created_at",
      label: "Ngày đánh giá",
      maxWidth: 50,
      format(value) {
        return fDateDayjs(dayjs(value), "DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      id: "action",
      label: "Ẩn đánh giá",
      maxWidth: 30,
      align: "center",
    },
  ];

  const onChangePage = useCallback(
    (newPage: number) => {
      dispatch(rateActions.setFilter({ ...filters, page: newPage }));
    },
    [filters]
  );

  const onToggleHidden = useCallback((raw: RateState) => {
    dispatch(appActions.openOverplay(""));
    dispatch(rateActions.editDataStart({ is_hidden: !raw.is_hidden, id: raw.id! }));
  }, []);

  return (
    <ForPage>
      <HeadSeo title="Quản lý đánh giá" />

      <Container maxWidth="xl">
        <Card title="Danh sách đánh giá">
          <Stack
            mb={2}
            flexDirection={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={2}
          >
            <Typography>Mức dộ đánh giá tương ứng với màu:</Typography>

            <Stack flexDirection={"row"} gap={3}>
              {[...Array(6)].map((_, index) => {
                return (
                  <Stack
                    flexDirection={"row"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    key={index}
                    gap={1}
                  >
                    <Box bgcolor={convertRate(index, mode).bg} width={10} height={10} />
                    <Typography>{index}</Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Stack>

          <Table
            columns={columns}
            page={pagination.page}
            totalRow={pagination.totalPage}
            onPageChange={onChangePage}
          >
            {data.length ? (
              data.map((row) => {
                const { bg, text } = convertRate(row.start, mode);

                return (
                  <TableRow
                    key={row.id}
                    sx={{
                      // background: (theme) => theme.palette.grey[200],
                      background: (theme) => (row.is_hidden ? theme.palette.grey[400] : bg),
                      "& th": {
                        // color: (theme) => theme.palette.grey[900],
                        color: (theme) => (row.is_hidden ? theme.palette.grey[900] : text),
                      },
                    }}
                  >
                    {columns.map((column, index) => {
                      const value = row[column.id as keyof RateState];

                      if (column.id === "action") {
                        return (
                          <TableCellOverride {...column} key={index}>
                            <Tooltip title={!row.is_hidden ? "Ẩn đánh giá" : "Hiện đánh giá"}>
                              <IconButton color="inherit" onClick={() => onToggleHidden(row)}>
                                {row.is_hidden ? (
                                  <RemoveRedEyeIcon color="inherit" />
                                ) : (
                                  <VisibilityOffIcon color="inherit" />
                                )}
                              </IconButton>
                            </Tooltip>
                          </TableCellOverride>
                        );
                      }

                      if (column.id === "room_id") {
                        return (
                          <TableCellOverride {...column} key={index}>
                            {row?.roomTypeName}
                          </TableCellOverride>
                        );
                      }

                      return (
                        <TableCellOverride {...column} key={index}>
                          {column.format ? column.format(value) : (value as string)}
                        </TableCellOverride>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>Chưa có đánh giá nào</TableCell>
              </TableRow>
            )}
          </Table>
        </Card>
      </Container>
    </ForPage>
  );
};

export default ReportPage;
