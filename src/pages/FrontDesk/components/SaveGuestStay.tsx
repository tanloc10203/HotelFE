import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Box, Button, Stack, Typography } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { frontDeskActions, useFrontDeskSelector } from "~/features/frontDesk";
import { useAppDispatch } from "~/stores";
import { IGuestStayInformation } from "~/types";
import FormDialogAddEditGuestInformations from "../form/FormDialogAddEditGuestInformations";
import TableGuestInfo from "./TableGuestInfo";

type SaveGuestStayProps = {
  guests: IGuestStayInformation[];
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomNumber: string;
  bookingDetailsId: string;
  onSubmit?: (values: IGuestStayInformation, resetForm: () => void, mode: "edit" | "add") => void;
  hiddenColumn?: "full_name" | "nationality" | "room_number" | "created_at" | "timeInProgress";
  disabled?: boolean;
  note?: string | null;
};

const SaveGuestStay: FC<SaveGuestStayProps> = ({
  adults,
  checkIn,
  checkOut,
  children,
  guests,
  roomNumber,
  bookingDetailsId,
  hiddenColumn,
  disabled,
  note,
  onSubmit,
}) => {
  const dispatch = useAppDispatch();

  const {
    openDialogAddGuest,
    screenGrid: { selectedGuestEdit },
  } = useFrontDeskSelector();

  const handleOpen = useCallback(() => {
    dispatch(frontDeskActions.setToggleDialogAddGuest(true));
  }, []);

  const handleClose = useCallback(() => {
    dispatch(frontDeskActions.setToggleDialogAddGuest(false));
    if (selectedGuestEdit) {
      dispatch(frontDeskActions.setSelectedGuestEdit(null));
    }
  }, [selectedGuestEdit]);

  const initialValues = useMemo((): IGuestStayInformation => {
    return {
      booking_details_id: bookingDetailsId,
      full_name: "",
      identification_type: "cccd",
      identification_value: "",
      nationality: "Vietnam",
      room_number: roomNumber,
      birthday: "",
      gender: "MALE",
      note: "",
      ...selectedGuestEdit,
    };
  }, [roomNumber, bookingDetailsId, selectedGuestEdit]);

  const handleEdit = useCallback((value: IGuestStayInformation) => {
    dispatch(frontDeskActions.setToggleDialogAddGuest(true));
    dispatch(frontDeskActions.setSelectedGuestEdit(value));
  }, []);

  const handleSubmit = useCallback(
    (values: IGuestStayInformation, resetForm?: () => void) => {
      if (!onSubmit) return;

      if (selectedGuestEdit) {
        onSubmit(values, resetForm!, "edit");
        return;
      }

      onSubmit(values, resetForm!, "add");
    },
    [selectedGuestEdit, onSubmit]
  );

  return (
    <Box sx={{ m: 1 }}>
      <FormDialogAddEditGuestInformations
        onClose={handleClose}
        onSubmit={handleSubmit}
        open={openDialogAddGuest}
        initialValues={initialValues}
        disabled={disabled}
      />

      <Stack flexDirection={"row"} alignItems={"center"} gap={2}>
        <Typography fontSize={14} fontWeight={700} component="div">
          Số lượng khách:
        </Typography>
        <Typography fontSize={14}>Người lớn: {adults}</Typography>
        <Typography fontSize={14}>Trẻ em: {children}</Typography>
      </Stack>

      <Stack flexDirection={"row"} alignItems={"center"} gap={2}>
        <Typography fontSize={14} fontWeight={700} component="div">
          Ghi chú:
        </Typography>
        <Typography fontSize={14}>{note || "Không có"}</Typography>
      </Stack>

      <Stack flexDirection={"row"} justifyContent={"space-between"} mb={1} alignItems={"center"}>
        <Typography fontSize={14} fontWeight={700} component="div">
          Danh sách giấy tờ tùy thân
        </Typography>

        <Button
          onClick={handleOpen}
          startIcon={<AddCircleOutlineIcon />}
          color="success"
          variant="outlined"
          disabled={disabled}
        >
          Giấy tờ
        </Button>
      </Stack>

      <TableGuestInfo
        checkIn={checkIn}
        checkOut={checkOut}
        guests={guests}
        hiddenColumn={hiddenColumn}
        onEdit={handleEdit}
      />

      <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} mt={4}>
        <Typography fontSize={14} fontWeight={700}>
          Tổng số: {guests.length}
        </Typography>
      </Stack>
    </Box>
  );
};

export default SaveGuestStay;
