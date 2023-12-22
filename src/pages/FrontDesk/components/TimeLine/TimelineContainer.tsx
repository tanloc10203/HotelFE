import { Table, TableContainer } from "@mui/material";
import { FC, ReactNode } from "react";
import useResponsive from "~/hooks/useResponsive";

type TimelineContainerProps = {
  children: ReactNode;
};

const TimelineContainer: FC<TimelineContainerProps> = ({ children }) => {
  const isLaptopScreen = useResponsive("between", "lg", "xl");

  return (
    <TableContainer
      sx={{
        width: "100%",
        maxHeight: isLaptopScreen ? 440 : 800,
        "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
        "&::-webkit-scrollbar-thumb": {
          background: (theme) => theme.palette.grey[300],
          borderRadius: 20,
        },
        "&::-webkit-scrollbar": { width: "8px", height: 8 },
        "&::-webkit-scrollbar-thumb:hover": { background: "#555" },
      }}
    >
      <Table
        stickyHeader
        sx={{
          "& > tbody > tr > td:nth-of-type(1), & > thead > tr  > th:nth-of-type(1)": {
            // position: "sticky",
            // left: 0,
          },
          "& td, & th": {
            border: "none !important",
            borderRight: ({ palette }) =>
              palette.mode === "light" ? `1px solid ${palette.grey[300]} !important` : "",
          },
          "& th": {
            borderBottom: "1px solid !important",
          },
        }}
      >
        {children}
      </Table>
    </TableContainer>
  );
};

export default TimelineContainer;
