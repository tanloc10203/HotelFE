import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { IconButton, Stack, Typography } from "@mui/material";
import { FC, useCallback } from "react";

type InputQuantityProps = {
  value: number;
  max?: number;
  disabled?: boolean;
  min?: number;
  onChangeValue?: (value: number, options?: "minus" | "plus") => void;
};

const InputQuantity: FC<InputQuantityProps> = ({ value, max, min, disabled, onChangeValue }) => {
  const handleOnDecrease = useCallback(() => {
    if (!onChangeValue) return;
    onChangeValue(Math.max(min ?? 0, value - 1), "minus");
  }, [onChangeValue, min, value]);

  const handleOnIncrease = useCallback(() => {
    if (!onChangeValue) return;
    onChangeValue(Math.min(value + 1, max ?? 5), "plus");
  }, [onChangeValue, max, value]);

  return (
    <Stack
      minWidth={120}
      flexDirection={"row"}
      gap={2}
      border={1}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <IconButton disabled={disabled} size="small" onClick={handleOnIncrease}>
        <AddIcon fontSize="inherit" />
      </IconButton>
      <Typography fontSize={14} fontWeight={700}>
        {value}
      </Typography>
      <IconButton disabled={disabled} size="small" onClick={handleOnDecrease}>
        <RemoveIcon fontSize="inherit" />
      </IconButton>
    </Stack>
  );
};

export default InputQuantity;
