import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { CSSProperties, FC, Fragment, ReactNode, useCallback } from "react";
import { SXProps } from "~/types";
import { Scrollbar } from "../..";

export interface ColumnState {
  id: string | number;
  label: string | ReactNode;
  minWidth?: number;
  maxWidth?: number;
  align?: "right" | "left" | "center";
  styles?: CSSProperties;
  format?: (value: any) => string;
}

export type TableCommonProps =
  | {
      size?: "small" | "medium";
      columns: Array<ColumnState>;
      children: ReactNode | JSX.Element;
      rowsPerPageOptions?: Array<number>;
      totalRow?: number;
      onPageChange?: (page: number) => void;
      page: number;
      onRowsPerPageChange?: (number: number) => void;
      rowsPerPage: number;
      notPagination?: boolean;
      minHeight?: number;
      sxHeadCell?: SXProps;
      stickyHeader?: boolean;
      autoHeight?: boolean;
    }
  | {
      size?: "small" | "medium";
      notPagination?: boolean;
      columns: Array<ColumnState>;
      children: ReactNode | JSX.Element;
      rowsPerPageOptions?: Array<number>;
      totalRow?: number;
      onPageChange?: (page: number) => void;
      page?: number;
      onRowsPerPageChange?: (number: number) => void;
      rowsPerPage?: number;
      minHeight?: number;
      sxHeadCell?: SXProps;
      stickyHeader?: boolean;
      autoHeight?: boolean;
    };

const TableCommon: FC<TableCommonProps> = (props) => {
  const {
    size,
    children,
    columns,
    totalRow,
    onPageChange,
    page,
    notPagination,
    minHeight,
    sxHeadCell,
    autoHeight,
    stickyHeader = true,
  } = props;

  const handleChangePage = useCallback(
    (_event: unknown, newPage: number) => {
      if (!onPageChange) return;
      onPageChange?.(newPage);
    },
    [onPageChange]
  );

  const Component = autoHeight ? Fragment : Scrollbar;

  return (
    <Paper>
      <TableContainer>
        <Component
          {...(!autoHeight
            ? {
                sx: {
                  width: "100%",
                  maxHeight: 440,
                  minHeight: minHeight ?? 200,
                },
              }
            : undefined)}
        >
          <Table size={size} stickyHeader={stickyHeader} aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    sx={sxHeadCell}
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      ...column.styles,
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>{children}</TableBody>
          </Table>
        </Component>
      </TableContainer>

      {!notPagination && totalRow! > 1 ? (
        <Scrollbar sx={{ width: "100%", maxHeight: 100, overflow: "hidden" }}>
          <Box mt={2}>
            <Pagination
              count={totalRow}
              page={page}
              onChange={handleChangePage}
              renderItem={(item) => (
                <PaginationItem
                  slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                  {...item}
                />
              )}
            />
          </Box>
        </Scrollbar>
      ) : null}
    </Paper>
  );
};

export default TableCommon;
