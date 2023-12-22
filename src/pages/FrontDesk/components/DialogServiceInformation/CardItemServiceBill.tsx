import { Stack, TableRow, Typography } from "@mui/material";
import { FC, useMemo } from "react";
import { ColumnState, TableCellOverride } from "~/components";
import { GuestUseServiceType } from "~/types/guestUseServices.type";
import { fNumber } from "~/utils";

type CardItemServiceBillProps = {
  index: number;
  data: GuestUseServiceType;
  columns: ColumnState[];
};

const CardItemServiceBill: FC<CardItemServiceBillProps> = ({ index, data, columns }) => {
  const totalPrice = useMemo(() => {
    if (!data.unitData || !data.sub_total) return 0;

    const { unitData, sub_total } = data;

    return !unitData.is_default ? sub_total * Number(unitData.quantity) : sub_total;
  }, [data]);

  return (
    <TableRow>
      {columns.map((column) => {
        if (column.id === "name") {
          return (
            <TableCellOverride key={column.id} {...column}>
              <Stack flexDirection={"row"} gap={2}>
                <Typography fontSize={14} fontWeight={700}>
                  {`${index + 1}.`}
                </Typography>
                <Typography fontSize={14} fontWeight={700}>
                  {`${data.serviceData!.name} (${data?.unitData?.unitData?.name})`}
                </Typography>
              </Stack>
            </TableCellOverride>
          );
        }

        if (column.id === "quantity") {
          return (
            <TableCellOverride key={column.id} {...column}>
              <Typography
                fontSize={14}
              >{`${data.quantity_ordered} (${data.unitData?.unitData?.name})`}</Typography>
            </TableCellOverride>
          );
        }

        if (column.id === "price") {
          return (
            <TableCellOverride key={column.id} {...column}>
              {fNumber(Number(data.price))}
            </TableCellOverride>
          );
        }

        return (
          <TableCellOverride key={column.id} {...column}>
            {fNumber(totalPrice)}
          </TableCellOverride>
        );
      })}
    </TableRow>
  );
};

export default CardItemServiceBill;
