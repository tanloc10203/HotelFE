import { TableCell, TableRow, TextField } from "@mui/material";
import { FormAddEditCustomerType } from "./form";
import { ForPage } from "~/layouts";
import { columns, rows } from "./data";
import { useState } from "react";

const { HeadSeo, Container, Title, Grid, Card, StackCategory, Table } = ForPage;

const CustomerTypePage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <ForPage>
      <HeadSeo title="Loại khách hàng" />

      <Container maxWidth="xl">
        <Title title="Quản lý loại khách hàng" />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Card title="Danh sách loại người dùng">
              <StackCategory>
                <TextField
                  id="outlined-basic"
                  label="Tìm kiếm"
                  placeholder="Nhập tên loại khách hàng"
                  variant="outlined"
                  sx={{
                    minWidth: {
                      lg: "40%",
                      md: "50%",
                      xs: "100%",
                    },
                  }}
                />
              </StackCategory>

              <Table
                onPageChange={(newPage: number) => setPage(newPage)}
                onRowsPerPageChange={(number: number) => {
                  setRowsPerPage(number);
                  setPage(0);
                }}
                columns={columns}
                totalRow={rows.length}
                page={page}
                rowsPerPage={rowsPerPage}
              >
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </Table>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card title="Thêm loại người dùng">
              <FormAddEditCustomerType initialValues={{ email: "sdfsdfs", password: "sdfs" }} />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ForPage>
  );
};

export default CustomerTypePage;
