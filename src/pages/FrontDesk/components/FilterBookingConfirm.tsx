import AddIcon from "@mui/icons-material/Add";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import {
  AutocompleteRenderGetTagProps,
  Box,
  Checkbox,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { FC, useCallback } from "react";
import { SelectInputAutoComplete } from "~/components";
import { bookingActions, useBookingSelector } from "~/features/booking";
import { useCustomer } from "~/features/customer";
import { frontDeskActions } from "~/features/frontDesk";
import { useAppDispatch } from "~/stores";
import { ICustomer } from "~/types";

type FilterBookingConfirmProps = {};

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const FilterBookingConfirm: FC<FilterBookingConfirmProps> = () => {
  const { customerBooking } = useBookingSelector();
  const { data } = useCustomer();
  const dispatch = useAppDispatch();

  const handleChange = useCallback((value: any) => {
    dispatch(bookingActions.setCustomerBooking(value as ICustomer));
  }, []);

  const handleOpenAddCustomerDialog = useCallback(() => {
    dispatch(frontDeskActions.setToggleAddCustomerDialog({ open: true }));
  }, []);

  return (
    <Stack flexDirection={"row"} alignItems={"center"} justifyContent={"flex-start"} gap={0.5}>
      <Box width={"30%"}>
        <SelectInputAutoComplete
          endAdornment={
            <IconButton onClick={handleOpenAddCustomerDialog} size="small">
              <AddIcon fontSize="inherit" />
            </IconButton>
          }
          onChange={handleChange}
          multiple={false}
          disableCloseOnSelect={false}
          getOptionLabel={(options) => {
            return `${options.display_name}  - ${options.phone_number}`;
          }}
          renderTags={(value: ICustomer, getTagProps: AutocompleteRenderGetTagProps) => {
            return (
              <Typography fontSize={12} {...getTagProps({ index: 0 })}>
                {`${value.display_name}  - ${value.phone_number}`}
              </Typography>
            );
          }}
          renderOptions={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {`${option.display_name}  - ${option.phone_number}`}
            </li>
          )}
          size="small"
          value={customerBooking}
          keyOption="display_name"
          options={data}
          label="Khách hàng"
        />
      </Box>
    </Stack>
  );
};

export default FilterBookingConfirm;
