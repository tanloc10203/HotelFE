import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { InputAdornment, Stack, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import { FC, memo } from "react";
import { SelectInput } from "~/components";
import { RadioState, ServicesAttributeType } from "~/types";

type RenderItemOptions = ServicesAttributeType & {
  index: number;
  onRemoveAttribute?: (index: number) => void;
  onClickOpenAddAttribute?: () => void;
  onSelectAttribute?: (id: string, index: number) => void;
  onChangeValue?: (key: keyof ServicesAttributeType, value: string, index: number) => void;
  attributeOptions: RadioState[];
};

export const RenderItemAttribute: FC<RenderItemOptions> = memo((props) => {
  const {
    onRemoveAttribute,
    onSelectAttribute,
    onClickOpenAddAttribute,
    onChangeValue,
    attributeOptions,
    attribute_id,
    value,
    index,
  } = props;

  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          title="Delete"
          onClick={() => onRemoveAttribute?.(index)}
        >
          <DeleteIcon />
        </IconButton>
      }
    >
      <Stack flexDirection={"row"} gap={2} flex={1}>
        <Stack width={300}>
          <SelectInput
            options={attributeOptions}
            label={"Thuộc tính"}
            margin="none"
            size="small"
            value={attribute_id}
            onChange={(event) => onSelectAttribute?.(event.target.value as string, index)}
            endAdornment={
              <InputAdornment sx={{ mr: 2 }} position="end">
                <IconButton size="small" onClick={onClickOpenAddAttribute} aria-label="add">
                  <AddIcon fontSize="inherit" />
                </IconButton>
              </InputAdornment>
            }
          />
        </Stack>

        <Stack width={200}>
          <TextField
            onChange={({ target: { value } }) => onChangeValue?.("value", value, index)}
            label="Giá trị"
            value={value}
            size="small"
            fullWidth
          />
        </Stack>
      </Stack>
    </ListItem>
  );
});
