import { Box, LinearProgress, TableCell, TableRow, TextField } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ColumnState, TableCellOverride } from "~/components";
import { customerActions, useCustomer } from "~/features/customer";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { ICustomer } from "~/types";

const { HeadSeo, Container, Title, Card, StackCategory, Table, Breadcrumbs } = ForPage;

const CustomerPage = () => {
  const dispatch = useAppDispatch();
  const { filters, isLoading, data, pagination } = useCustomer();
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(
      customerActions.getDataStart({
        ...filters,
      })
    );
  }, [filters]);

  const columns = useMemo(
    (): ColumnState[] => [
      { id: "id", label: "ID KH", minWidth: 170 },
      { id: "display_name", label: "Tên KH", minWidth: 170 },
      { id: "phone_number", label: "SĐT", minWidth: 170 },
      { id: "email", label: "Email", minWidth: 170 },
      { id: "status", label: "Trạng thái", minWidth: 170 },
      { id: "actions", label: "Hành động", maxWidth: 120, minWidth: 120, align: "center" },
    ],
    []
  );

  const onChangePage = useCallback(
    (newPage: number) => dispatch(customerActions.setFilter({ ...filters, page: newPage })),
    [filters]
  );

  const handleChangeSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value },
      } = event;

      setSearch(value);
      dispatch(
        customerActions.setDebounceSearch({ ...filters, page: 1, display_name_like: value })
      );
    },
    [filters]
  );

  return (
    <ForPage>
      <HeadSeo title={"Dang sách khách hàng"} />

      <Container maxWidth="xl">
        <Title title={"Dang sách khách hàng"} mb={2} />

        <Breadcrumbs data={[{ label: "Dang sách khách hàng" }]} mb={3} />

        <Card title="" sx={{ position: "relative" }}>
          {isLoading === "pending" ? (
            <Box
              sx={{
                width: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
              }}
            >
              <LinearProgress />
            </Box>
          ) : null}

          <StackCategory my={3} justifyContent={"space-between"}>
            <Box sx={{ width: "40%" }}>
              <TextField
                onChange={handleChangeSearch}
                value={search}
                id="outlined-basic"
                label="Tìm kiếm"
                placeholder="Nhập tên khách hàng muốn tìm"
                variant="outlined"
                fullWidth
                size="small"
              />
            </Box>
          </StackCategory>

          <Table
            columns={columns}
            onPageChange={onChangePage}
            page={pagination.page}
            totalRow={pagination.totalPage}
          >
            {data.length ? (
              data.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column, idx) => {
                    const value = row[column.id as keyof ICustomer];

                    return (
                      <TableCellOverride {...column} key={idx}>
                        {column.format ? column.format(value) : (value as string)}
                      </TableCellOverride>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>Chưa có dữ liệu</TableCell>
              </TableRow>
            )}
          </Table>
        </Card>
      </Container>
    </ForPage>
  );
};

export default CustomerPage;
