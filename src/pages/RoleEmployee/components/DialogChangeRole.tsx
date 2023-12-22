import { AutocompleteChangeReason, Box, Breakpoint } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import FormSelectChangeRole from "./FormSelectChangeRole";
import { RolePayload } from "~/types";

type DialogChangeRoleProps = {
  open: boolean;
  options: RolePayload[];
  value: RolePayload[];
  displayName: string;
  size?: Breakpoint;
  onClose: () => void;
  onAgree: () => void;
  onChangeSelected?: (selected: RolePayload[]) => void;
};

const DialogChangeRole: React.FC<DialogChangeRoleProps> = ({
  open,
  options,
  displayName,
  onClose,
  onChangeSelected,
  onAgree,
  value,
  size,
}) => {
  const [values, setValues] = React.useState<RolePayload[]>([]);

  React.useEffect(() => {
    if (!value.length) return;
    setValues(value);
  }, [value]);

  const handleChangeValues = React.useCallback(
    (values: RolePayload[], _reason: AutocompleteChangeReason, _payload?: RolePayload) => {
      console.log(`values`, values);

      setValues(values);
      if (!onChangeSelected) return;
      onChangeSelected(values);
    },
    [onChangeSelected]
  );

  return (
    <Dialog fullWidth maxWidth={size ?? "sm"} open={open} onClose={onClose}>
      <DialogTitle>Cập nhật vai trò</DialogTitle>
      <DialogContent>
        <DialogContentText>Chọn vai trò cho nhân viên {displayName}</DialogContentText>
        <Box mt={2}>
          <FormSelectChangeRole options={options} value={values} onChange={handleChangeValues} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Hủy bỏ
        </Button>
        <Button onClick={onAgree}>Xác nhận</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogChangeRole;
