import { Stack, TextField, TextFieldProps, TextFieldVariants, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

type InputBillProps = {
  inputProps?: {
    variant?: TextFieldVariants;
  } & Omit<TextFieldProps, "variant">;
  label: string;
  subLabel?: ReactNode;
};

const InputBill: FC<InputBillProps> = ({ inputProps, label, subLabel }) => {
  return (
    <Stack
      width={"100%"}
      flexDirection={"row"}
      alignItems={"flex-end"}
      justifyContent={"space-between"}
    >
      <Stack flexDirection={"row"} alignItems={"center"} gap={1} position={"relative"}>
        <Typography fontSize={12} fontWeight={700}>
          {label}
        </Typography>

        {subLabel}
      </Stack>

      <Stack width={130}>
        <TextField
          sx={{
            "& input": { fontSize: 14 },
          }}
          size="small"
          variant="standard"
          {...inputProps}
        />
      </Stack>
    </Stack>
  );
};

export default InputBill;
