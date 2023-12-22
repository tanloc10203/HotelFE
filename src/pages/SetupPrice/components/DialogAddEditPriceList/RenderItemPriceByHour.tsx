import DeleteIcon from "@mui/icons-material/Delete";
import { Stack, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import { FC, memo } from "react";
import { EndAdornmentVND, NumericFormatCustom } from "~/components";
import { IPriceByHour } from "~/types";
import AddIcon from "@mui/icons-material/Add";
import EndAdornmentTime from "~/components/shared/EndAdornment/EndAdornmentTime";

type RenderItemPriceByHourProps = {
  index: number;
  price: IPriceByHour;
  isShowAdd: boolean;
  onRemove?: (index: number, price: IPriceByHour) => void;
  onAddNewPrice?: (price: IPriceByHour) => void;
  onChangeValue?: (
    type: "price" | "start_hour",
    value: string,
    price: IPriceByHour,
    index: number
  ) => void;
  disabled?: boolean;
  hiddenAction?: boolean;
};

export const RenderItemPriceByHour: FC<RenderItemPriceByHourProps> = memo((props) => {
  const {
    price,
    index,
    isShowAdd,
    hiddenAction,
    disabled,
    onChangeValue,
    onRemove,
    onAddNewPrice,
  } = props;

  return (
    <ListItem
      secondaryAction={
        <>
          {hiddenAction ? null : price.start_hour === 1 ? null : (
            <IconButton
              edge="start"
              aria-label="delete"
              title="Delete"
              color="error"
              onClick={() => onRemove?.(index, price)}
            >
              <DeleteIcon />
            </IconButton>
          )}

          {hiddenAction ? null : isShowAdd ? (
            <IconButton
              edge="start"
              aria-label="delete"
              title="Delete"
              color="primary"
              onClick={() => onAddNewPrice?.(price)}
            >
              <AddIcon />
            </IconButton>
          ) : null}
        </>
      }
      sx={{ padding: 0, py: 1 }}
    >
      <Stack flexDirection={"row"} gap={2}>
        <Stack width={100}>
          <TextField
            disabled={disabled}
            onChange={({ target: { value } }) => onChangeValue?.("start_hour", value, price, index)}
            label="Từ giờ thứ"
            value={price.start_hour}
            size="small"
            InputProps={{
              endAdornment: <EndAdornmentTime />,
            }}
            sx={
              disabled
                ? {
                    "& input": {
                      fontSize: 14,
                      color: (theme) => theme.palette.secondary.main,
                      WebkitTextFillColor: "unset !important",
                      fontWeight: 700,
                    },
                  }
                : {}
            }
          />
        </Stack>

        <Stack width={140}>
          <TextField
            disabled={disabled}
            label="Giá"
            size="small"
            onChange={({ target: { value } }) => onChangeValue?.("price", value, price, index)}
            value={price.price}
            InputProps={{
              inputComponent: NumericFormatCustom as any,
              endAdornment: <EndAdornmentVND />,
            }}
            sx={
              disabled
                ? {
                    "& input": {
                      fontSize: 14,
                      color: (theme) => theme.palette.secondary.main,
                      WebkitTextFillColor: "unset !important",
                      fontWeight: 700,
                    },
                  }
                : {}
            }
          />
        </Stack>
      </Stack>
    </ListItem>
  );
});
