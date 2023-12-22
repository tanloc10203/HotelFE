import EditIcon from "@mui/icons-material/Edit";
import { Checkbox, TableCell, TableRow, Typography, useTheme } from "@mui/material";
import { FC } from "react";
import { Link } from "react-router-dom";
import { Actions, ButtonActions, ChipOverride, ColumnState } from "~/components";
import { ForPage } from "~/layouts";
import { DashboardPaths, TypeEmployeeResponse } from "~/types";
import { convertGender, convertStatusEmployee } from "../helpers/convertStatusEmployee";

const { Table } = ForPage;

type TableRoleEmployeeProps = {
  data: TypeEmployeeResponse[];
  columns: ColumnState[];
  page: number;
  totalRow?: number;
  checkedEmployee: TypeEmployeeResponse | null;
  rowsPerPage: number;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (number: number) => void;
  onCheckedEmployee?: (...args: any[]) => void;
};

const TableRoleEmployee: FC<TableRoleEmployeeProps> = ({
  data,
  columns,
  page,
  rowsPerPage,
  checkedEmployee,
  totalRow,
  onPageChange,
  onRowsPerPageChange,
  onCheckedEmployee,
}) => {
  const theme = useTheme();

  return (
    <Table
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      columns={columns}
      totalRow={totalRow ?? 0}
      page={page}
      rowsPerPage={rowsPerPage}
      sxHeadCell={{
        background:
          theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
      }}
      rowsPerPageOptions={[3, 5, 8, 10, 1, 2]}
    >
      {data && data.length > 0 ? (
        data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((column) => {
              const value = row[column.id as keyof TypeEmployeeResponse];

              if (column.id === "select") {
                return (
                  <TableCell
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      ...column.styles,
                    }}
                    key={column.id}
                    component="th"
                    scope="row"
                    align={column.align}
                  >
                    <Checkbox
                      onChange={onCheckedEmployee}
                      checked={checkedEmployee ? checkedEmployee.id === row.id : false}
                      name={row.id + ""}
                    />
                  </TableCell>
                );
              }

              if (column.id === "action") {
                return (
                  <TableCell
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      ...column.styles,
                    }}
                    key={column.id}
                    component="th"
                    scope="row"
                    align={column.align}
                  >
                    <Actions>
                      {/* <ButtonActions
                        LinkComponent={Link}
                        to={DashboardPaths.AddEmployee}
                        startIcon={<EditIcon />}
                      >
                        Chỉnh sửa nhanh
                      </ButtonActions> */}
                      <ButtonActions
                        LinkComponent={Link}
                        to={`${DashboardPaths.UpdateEmployee}/${row.id}`}
                        startIcon={<EditIcon />}
                      >
                        Chỉnh sửa
                      </ButtonActions>
                      {/* <ButtonActions
                        LinkComponent={Link}
                        to={DashboardPaths.AddEmployee}
                        color="error"
                        startIcon={<DeleteIcon />}
                      >
                        Xóa
                      </ButtonActions> */}
                    </Actions>
                  </TableCell>
                );
              }

              if (column.id === "roles") {
                return (
                  <TableCell
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      ...column.styles,
                    }}
                    key={column.id}
                    component="th"
                    scope="row"
                    align={column.align}
                  >
                    {row.roles?.length ? (
                      row.roles.map((role) => (
                        <Typography fontSize={14} key={role.id}>
                          {role.name}
                        </Typography>
                      ))
                    ) : (
                      <Typography fontSize={14} fontStyle={"italic"} color="error">
                        Chưa có vai trò
                      </Typography>
                    )}
                  </TableCell>
                );
              }

              if (column.id === "position") {
                return (
                  <TableCell
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      ...column.styles,
                    }}
                    key={column.id}
                    component="th"
                    scope="row"
                    align={column.align}
                  >
                    <Typography fontSize={14} fontStyle={"italic"}>
                      {row.position ? row.position.name : "Chưa có chức vụ"}
                    </Typography>
                  </TableCell>
                );
              }

              if (column.id === "department") {
                return (
                  <TableCell
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      ...column.styles,
                    }}
                    key={column.id}
                    component="th"
                    scope="row"
                    align={column.align}
                  >
                    <Typography fontSize={14} fontStyle={"italic"}>
                      {row.department ? row.department.name : "Chưa có bộ phận"}
                    </Typography>
                  </TableCell>
                );
              }

              if (column.id === "gender") {
                return (
                  <TableCell
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      ...column.styles,
                    }}
                    key={column.id}
                    component="th"
                    scope="row"
                    align={column.align}
                  >
                    <Typography fontSize={14} fontStyle={"italic"}>
                      {convertGender(row.employeeInfo.gender!)}
                    </Typography>
                  </TableCell>
                );
              }

              if (column.id === "status") {
                return (
                  <TableCell
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      ...column.styles,
                    }}
                    key={column.id}
                    component="th"
                    scope="row"
                    align={column.align}
                  >
                    <ChipOverride
                      label={value as string}
                      background={convertStatusEmployee(row.status!).default}
                      colorOverride={convertStatusEmployee(row.status!).active}
                      notHover
                    />
                  </TableCell>
                );
              }

              return (
                <TableCell
                  style={{
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    ...column.styles,
                  }}
                  key={column.id}
                  component="th"
                  scope="row"
                  align={column.align}
                >
                  {value as string}
                </TableCell>
              );
            })}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} component="th" scope="row">
            Chưa có nhân viên nào
          </TableCell>
        </TableRow>
      )}
    </Table>
  );
};

export default TableRoleEmployee;
