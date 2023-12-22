import EditIcon from "@mui/icons-material/Edit";
import { Chip, IconButton } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import { Link } from "react-router-dom";
import { DashboardPaths, RolePayload } from "~/types";
import { convertAliasToColor } from "../helpers/convertAlias";

type TableCollapsibleProps = {
  rows: RolePayload[];
  onDelete: (item: RolePayload) => void;
};

const TableCollapsible: React.FC<TableCollapsibleProps> = ({ rows }) => {
  return (
    <Table aria-label="collapsible table">
      <TableHead>
        <TableRow>
          <TableCell>Tên vai trò</TableCell>
          <TableCell>Danh sách quyền</TableCell>
          <TableCell align="center">Mô tả</TableCell>
          <TableCell align="center">Hành động</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row?.id}>
            <TableCell component="th" scope="row">
              {row.name}
            </TableCell>
            <TableCell>
              {row.permissions.map((permission) => (
                <Chip
                  label={permission.alias}
                  key={permission.id}
                  color={convertAliasToColor(permission.alias)}
                />
              ))}
            </TableCell>
            <TableCell align="center">{row.desc}</TableCell>
            <TableCell align="center">
              {/* <IconButton onClick={() => onDelete(row)} aria-label="delete" color="error">
                <DeleteIcon />
              </IconButton> */}
              <IconButton
                aria-label="edit"
                color="primary"
                component={Link}
                to={`${DashboardPaths.EditRole}/${row.id}`}
              >
                <EditIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableCollapsible;
