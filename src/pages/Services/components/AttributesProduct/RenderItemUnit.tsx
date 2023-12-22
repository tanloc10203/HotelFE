import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { InputAdornment, Stack, TextField, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import { FC, memo } from "react";
import { NumericFormatCustom, SelectInput } from "~/components";
import SwitchShowDiscount from "~/pages/Promotions/form/SwitchShowDiscount";
import { RadioState, ServicesUnitType } from "~/types";

type RenderItemOptions = ServicesUnitType & {
  index: number;
  onRemoveUnit?: (index: number) => void;
  onClickOpen?: () => void;
  onSelectUnit?: (id: number, index: number) => void;
  onOnChecked?: (value: boolean, index: number) => void;
  onChangeValue?: (key: keyof ServicesUnitType, value: string, index: number) => void;
  unitOptions: RadioState[];
  label?: string;
};

export const RenderItemUnit: FC<RenderItemOptions> = memo((props) => {
  const {
    onRemoveUnit,
    index,
    is_sell,
    is_default,
    unitOptions,
    unit_id,
    label,
    onSelectUnit,
    onClickOpen,
    onOnChecked,
    onChangeValue,
    ...propsOthers
  } = props;

  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          title="Delete"
          disabled={is_default}
          onClick={() => onRemoveUnit?.(index)}
        >
          <DeleteIcon />
        </IconButton>
      }
    >
      <Stack flexDirection={"row"} gap={2} flex={1}>
        <Stack width={300}>
          <SelectInput
            options={unitOptions}
            label={is_default ? `Đơn vị cơ bản` : "Tên đơn vị"}
            margin="none"
            size="small"
            value={unit_id === 0 ? "" : `${unit_id}`}
            onChange={(event) => onSelectUnit?.(event.target.value as number, index)}
            endAdornment={
              <InputAdornment sx={{ mr: 2 }} position="end">
                <IconButton size="small" onClick={onClickOpen} aria-label="add">
                  <AddIcon fontSize="inherit" />
                </IconButton>
              </InputAdornment>
            }
          />
        </Stack>
        {propsOthers?.quantity! >= 0 ? (
          <Stack width={200}>
            <TextField
              onChange={({ target: { value } }) => onChangeValue?.("quantity", value, index)}
              label="Giá trị quy đổi"
              value={propsOthers?.quantity}
              size="small"
              type="number"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography fontSize={12}>({label})</Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        ) : null}
        {propsOthers?.price! >= 0 ? (
          <Stack width={200}>
            <TextField
              onChange={({ target: { value } }) => onChangeValue?.("price", value, index)}
              label="Giá bán"
              value={propsOthers?.price}
              size="small"
              fullWidth
              InputProps={{
                inputComponent: NumericFormatCustom as any,
              }}
            />
          </Stack>
        ) : null}
        <Stack flex={1}>
          <SwitchShowDiscount
            value={is_sell!}
            onChecked={(value) => onOnChecked?.(value, index)}
            label={"Bán trực tiếp"}
          />
        </Stack>
      </Stack>
    </ListItem>
  );
});
