import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IconButton, TableRow, Typography } from "@mui/material";
import { FC, useMemo } from "react";
import { ColumnState, InputQuantity, TableCellOverride } from "~/components";
import { GuestUseServiceType } from "~/types/guestUseServices.type";
import { fNumber } from "~/utils";

type CardItemServiceProps = {
  index: number;
  data: GuestUseServiceType;
  onRemoveItem?: (item: GuestUseServiceType) => void;
  onChangeQuantity?: (
    item: GuestUseServiceType,
    quantity: number,
    options?: "minus" | "plus"
  ) => void;
  columns: ColumnState[];
  disabled?: boolean;
};

const CardItemService: FC<CardItemServiceProps> = ({
  index,
  data,
  disabled,
  columns,
  onChangeQuantity,
  onRemoveItem,
}) => {
  // console.log("====================================");
  // console.log(`data`, data);
  // console.log("====================================");

  const totalPrice = useMemo(() => {
    if (!data.unitData || !data.sub_total) return 0;

    const { sub_total } = data;

    // console.log("====================================");
    // console.log(`data`, sub_total);
    // console.log("====================================");

    return sub_total;
  }, [data]);

  return (
    <TableRow>
      {columns.map((column) => {
        if (column.id === "delete") {
          return (
            <TableCellOverride key={column.id} {...column}>
              <IconButton disabled={disabled} onClick={() => onRemoveItem?.(data)}>
                <DeleteOutlineIcon fontSize="inherit" />
              </IconButton>
            </TableCellOverride>
          );
        }

        if (column.id === "stt") {
          return (
            <TableCellOverride key={column.id} {...column}>
              {index + 1}
            </TableCellOverride>
          );
        }

        if (column.id === "name") {
          return (
            <TableCellOverride key={column.id} {...column}>
              <Typography fontSize={14} fontWeight={700}>
                {`${data.serviceData!.name} (${data?.unitData?.unitData?.name})`}
              </Typography>
            </TableCellOverride>
          );
        }

        if (column.id === "quantity") {
          return (
            <TableCellOverride key={column.id} {...column}>
              <InputQuantity
                disabled={disabled}
                max={350}
                key={data.service_unit_id}
                onChangeValue={(value, options) => onChangeQuantity?.(data, value, options)}
                value={data.quantity_ordered}
              />
            </TableCellOverride>
          );
        }

        if (column.id === "discount") {
          return (
            <TableCellOverride key={column.id} {...column}>
              {data.discount}
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

export default CardItemService;
