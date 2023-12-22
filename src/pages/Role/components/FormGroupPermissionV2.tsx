import { Box, Checkbox, TableCell, TableRow } from "@mui/material";
import * as React from "react";
import { ColumnState } from "~/components";
import { ForPage } from "~/layouts";
import { IPermissionModule } from "~/types";
import { convertAlias } from "../helpers/convertAlias";

const { Table } = ForPage;

type FormGroupPermissionV2Props = {
  permissions: IPermissionModule[];
  onChange?: (permissionModules: IPermissionModule[]) => void;
};

const FormGroupPermissionV2: React.FC<FormGroupPermissionV2Props> = ({ permissions, onChange }) => {
  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      const { name } = event.target;
      const slipt = name.split("."); /** name = all.product => ['all', 'product'] */
      const selectAllMode = slipt[0] === "all";
      let temps: IPermissionModule[] = [];

      if (selectAllMode) {
        const moduleName = slipt[1];
        temps = permissions.map((permission) => {
          if (permission.moduleName === moduleName) {
            const children = permission.children.map((c) => ({ ...c, selected: checked }));
            return { ...permission, children };
          }
          return permission;
        });
      } else {
        temps = permissions.map((permission) => {
          const children = permission.children.map((p) =>
            +p.id! === +name ? { ...p, selected: checked } : p
          );
          return { ...permission, children };
        });
      }

      if (!onChange) return;

      onChange(temps);
    },
    [onChange, permissions]
  );

  if (!permissions.length) {
    return (
      <Box border="1px solid #dedede" borderRadius={1}>
        <Box
          bgcolor="#ededed"
          px={2}
          py={1}
          display="flex"
          justifyContent="space-between"
          flexWrap="wrap"
          alignItems="center"
          borderRadius="8px 8px 0  0px"
        >
          Chưa có quyền nào.
        </Box>
      </Box>
    );
  }

  const columns: ColumnState[] = [
    { id: "moduleName", label: "Tên module / Tác vụ", minWidth: 120 },
    { id: "add", label: "Thêm", minWidth: 80, align: "center" },
    { id: "view", label: "Xem", minWidth: 80, align: "center" },
    { id: "edit", label: "Sửa", minWidth: 80, align: "center" },
    { id: "delete", label: "Xóa", minWidth: 80, align: "center" },
    { id: "selectAll", label: "Chọn tất cả", minWidth: 100, align: "center" },
  ];

  return (
    <Table notPagination columns={columns} minHeight={300}>
      {permissions.map((row) => (
        <TableRow key={row.moduleName}>
          {columns.map((column, index) => {
            if (index === 0)
              return (
                <TableCell
                  key={column.id}
                  sx={{ textTransform: "capitalize" }}
                  component="th"
                  scope="row"
                  align={column.align}
                >
                  {row.moduleName}
                </TableCell>
              );

            if (index === 5)
              return (
                <TableCell key={column.id} align={column.align}>
                  <Checkbox
                    name={`all.${row.moduleName}`}
                    checked={row.children.every((i) => i.selected)}
                    onChange={handleChange}
                  />
                </TableCell>
              );

            const id = convertAlias(column.id as string);

            const indexAlias = row.children.findIndex((t) => convertAlias(t.alias) === id);

            if (indexAlias === -1) {
              return (
                <TableCell key={index} component="th" scope="row" align={column.align}>
                  <Checkbox disabled />
                </TableCell>
              );
            }

            const element = row.children[indexAlias];

            return (
              <TableCell key={element?.id} component="th" scope="row" align={column.align}>
                <Checkbox
                  onChange={handleChange}
                  name={element?.id + ""}
                  checked={element.selected}
                />
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </Table>
  );
};

export default FormGroupPermissionV2;
