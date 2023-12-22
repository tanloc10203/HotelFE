import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Container,
  Dialog,
  DialogContent,
  Grid,
  InputAdornment,
  LinearProgress,
  Stack,
  TableCell,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import { AppbarDialog, ColumnState, Transition } from "~/components";
import { Colors, SCROLLBAR_CUSTOM } from "~/constants";
import { appActions } from "~/features/app";
import { useUser } from "~/features/auth";
import { frontDeskActions, useFrontDeskSelector } from "~/features/frontDesk";
import { guestUseServiceActions, useGuestUseServiceSelector } from "~/features/guestUseServices";
import { serviceActions, useServiceSelector } from "~/features/service";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import {
  BillInfoPayload,
  CheckoutPayload,
  IGuestStayInformation,
  ImportProductDataType,
} from "~/types";
import { GuestUseServiceType } from "~/types/guestUseServices.type";
import { getInfoData } from "~/utils";
import SaveGuestStay from "../SaveGuestStay";
import CardItemService from "./CardItemService";
import DialogCheckout from "./DialogCheckout";
import HeaderInfo from "./HeaderInfo";
import HeaderRight from "./HeaderRight";
import ProductItem from "./ProductItem";
import TableRoomInfo from "./TableRoomInfo";

type DialogServiceInformationProps = {};

const { Table } = ForPage;

const DialogServiceInformation: FC<DialogServiceInformationProps> = () => {
  const dispatch = useAppDispatch();
  const {
    openDialogServiceInformation: open,
    informationRoom,
    screenGrid: { guestsInRoom, openCheckoutDialog },
  } = useFrontDeskSelector();

  const { importProductData } = useServiceSelector();
  const { bookingDetailsId, data, isLoading } = useGuestUseServiceSelector();

  const [alignment, setAlignment] = useState("service");
  const [hoverId, setHoverId] = useState("");
  const employee = useUser();

  const columns: ColumnState[] = [
    {
      id: "delete",
      label: "",
      minWidth: 40,
      maxWidth: 40,
      align: "center",
      styles: { padding: 0 },
    },
    {
      id: "stt",
      label: "STT",
      minWidth: 40,
      maxWidth: 40,
      align: "center",
      styles: { padding: 0 },
    },
    { id: "name", label: "Tên HH/DV", minWidth: 80 },
    { id: "quantity", label: "Số Lượng", minWidth: 120, maxWidth: 120, align: "center" },
    // { id: "discount", label: "Giảm giá", minWidth: 100, maxWidth: 100 },
    { id: "subTotal", label: "Thành tiền", minWidth: 100, maxWidth: 100 },
  ];

  useEffect(() => {
    if (!bookingDetailsId) return;

    dispatch(
      guestUseServiceActions.getDataStart({
        page: 1,
        limit: 9999,
        booking_details_id: bookingDetailsId,
        order: "created_at",
      })
    );

    dispatch(frontDeskActions.getInformationRoomStart(bookingDetailsId));
  }, [bookingDetailsId]);

  useEffect(() => {
    if (!open || !informationRoom || !informationRoom?.data) return;

    dispatch(appActions.openOverplay("Đang lấy thông tin..."));
    dispatch(
      frontDeskActions.getGuestsInRoomStart({
        bookingDetailsId: String(informationRoom.data?.bookingDetails.id),
        roomNumberId: String(informationRoom.data?.room.roomNumber.id),
      })
    );
  }, [open, informationRoom]);

  useEffect(() => {
    if (!open) return;

    dispatch(appActions.openOverplay("Đang tải dữ liệu..."));

    if (alignment === "service") {
      dispatch(serviceActions.getDataStart({ page: 1, limit: 9999, is_product: 0 }));
      return;
    }

    dispatch(serviceActions.getDataStart({ page: 1, limit: 9999, is_product: 1 }));
  }, [open, alignment]);

  const handleChange = (_: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    setAlignment(newAlignment);
  };

  const onClose = useCallback(() => {
    dispatch(frontDeskActions.setToggleDialogServiceInformations(false));
    dispatch(frontDeskActions.setSelectedRoomNumberForServiceInformation(null));
  }, []);

  const setToggleHoverId = useCallback((hoverId: string) => {
    setHoverId(hoverId);
  }, []);

  const handleSelectedService = useCallback(
    (item: ImportProductDataType) => {
      if (!bookingDetailsId) {
        onClose();
        return;
      }

      const data = getInfoData(item, ["unit_service_id", "id"]);

      dispatch(
        guestUseServiceActions.addUseServiceStart({
          data: {
            booking_details_id: bookingDetailsId,
            quantity_ordered: 1,
            service_id: data.id!,
            service_unit_id: data.unit_service_id!,
            discount: 0,
            note: null,
            guest_id: null,
          },
          isProduct: Boolean(alignment !== "service"),
        })
      );
    },
    [bookingDetailsId, alignment]
  );

  const onRemoveItem = useCallback(
    (item: GuestUseServiceType) => {
      dispatch(
        guestUseServiceActions.deleteUseServiceStart({
          guestUseServiceId: item.id!,
          isProduct: Boolean(alignment !== "service"),
        })
      );
    },
    [alignment]
  );

  const handleChangeQuantity = useCallback(
    (item: GuestUseServiceType, quantity: number, options?: "minus" | "plus") => {
      dispatch(
        guestUseServiceActions.plusMinusUseServiceStart({
          data: { data: { options: options!, quantity }, guestUseServiceId: item.id! },
          isProduct: Boolean(alignment !== "service"),
        })
      );
    },
    [importProductData]
  );

  const handleCheckOut = useCallback(() => {
    dispatch(frontDeskActions.setToggleCheckoutDialog({ open: true }));
  }, []);

  const handleCloseCheckoutDialog = useCallback(() => {
    dispatch(frontDeskActions.setToggleCheckoutDialog({ open: false }));
  }, []);

  const handleSubmit = useCallback(
    (values: IGuestStayInformation, resetForm: () => void, mode: "add" | "edit") => {
      dispatch(appActions.openOverplay("Đang thêm thông tin..."));
      dispatch(
        frontDeskActions.addGuestsInRoomStart({
          data: values,
          resetForm: resetForm!,
          mode,
        })
      );
    },
    []
  );

  const handleCheckout = useCallback(
    (value: BillInfoPayload) => {
      if (!employee || !informationRoom.data) return;

      const { bill, bookingDetails } = informationRoom.data;

      if (!bill) return;

      const payload: CheckoutPayload = {
        ...value,
        billId: bill.id!,
        bookingDetailsId: bookingDetails.id!,
        employeeId: employee.id,
        change: Number(value.change),
        customerPay: Number(value.customerPay),
        customerRequirePay: Number(value.customerRequirePay),
        deposit: Number(value.deposit),
        discount: Number(value.deposit),
        totalCostRoom: Number(value.totalCostRoom),
        totalCostService: Number(value.totalCostService),
        totalQuantityOrdered: Number(value.totalQuantityOrdered),
      };

      dispatch(appActions.openOverplay("Đang tiến hành trả phòng..."));
      dispatch(frontDeskActions.checkOutStart(payload));
    },
    [employee, informationRoom]
  );

  return (
    <>
      {openCheckoutDialog && informationRoom.data ? (
        <DialogCheckout
          disabled={informationRoom?.data?.bookingDetails.status !== "in_progress"}
          onCheckout={handleCheckout}
          room={informationRoom.data}
          open={openCheckoutDialog}
          onClose={handleCloseCheckoutDialog}
        />
      ) : null}

      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullScreen
        TransitionComponent={Transition}
      >
        <AppbarDialog
          title={`Chỉnh sửa / Thêm dịch vụ (${informationRoom.data?.room?.roomNumber?.id})`}
          onClose={onClose}
        ></AppbarDialog>

        <DialogContent dividers sx={{ ...SCROLLBAR_CUSTOM, p: 0, height: "100%" }}>
          <Container maxWidth="xl" sx={{ height: "100%", p: 0 }}>
            <Grid container spacing={2} sx={{ p: 0, height: "100%" }}>
              <Grid item lg={4} height={"100%"}>
                <Stack
                  pt={2}
                  height={"100%"}
                  width={"100%"}
                  borderRight={(theme) => `1px dashed ${theme.palette.grey[600]}`}
                >
                  <Box mb={1} mr={2}>
                    <TextField
                      fullWidth
                      placeholder="Tìm theo tên, mã hàng hóa"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Stack fontSize={14}>
                              <SearchIcon fontSize="inherit" />
                            </Stack>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  {informationRoom?.data?.bookingDetails.status !== "in_progress" ? null : (
                    <>
                      <Stack>
                        <ToggleButtonGroup
                          color="success"
                          value={alignment}
                          exclusive
                          onChange={handleChange}
                          aria-label="Service"
                          size="small"
                        >
                          <ToggleButton value="product">Hàng hóa</ToggleButton>
                          <ToggleButton value="service">Dịch vụ</ToggleButton>
                        </ToggleButtonGroup>
                      </Stack>
                      <Stack mt={3} flexDirection={"row"} flexWrap={"wrap"} width={"100%"}>
                        {importProductData.length ? (
                          importProductData.map((row, index) => {
                            if (Number(row.unit_is_sell) === 0) return null;

                            return (
                              <ProductItem
                                onSelected={handleSelectedService}
                                key={index}
                                {...row}
                                alignment={alignment}
                                onToggleHoverId={setToggleHoverId}
                                hoverId={hoverId}
                              />
                            );
                          })
                        ) : (
                          <Typography fontSize={12}>Không có dịch vụ / hàng hóa sử dụng</Typography>
                        )}
                      </Stack>
                    </>
                  )}
                </Stack>
              </Grid>

              <Grid item lg={8} height={"100%"}>
                <Stack py={2}>
                  <HeaderInfo />

                  <HeaderRight
                    onCheckOut={handleCheckOut}
                    disabled={informationRoom?.data?.bookingDetails.status !== "in_progress"}
                  />

                  <Stack mt={2} gap={1} position={"relative"}>
                    {isLoading === "pending" ? (
                      <Box position={"absolute"} top={-6} right={0} left={0}>
                        <LinearProgress color="success" />
                      </Box>
                    ) : null}

                    {informationRoom.data?.room ? (
                      <SaveGuestStay
                        disabled={informationRoom?.data?.bookingDetails.status !== "in_progress"}
                        bookingDetailsId={String(informationRoom.data?.bookingDetails.id)}
                        roomNumber={String(informationRoom.data.room.roomNumber.id)}
                        guests={guestsInRoom}
                        checkIn={String(informationRoom.data.bookingDetails.check_in)}
                        checkOut={String(informationRoom.data.bookingDetails.check_out)}
                        adults={Number(guestsInRoom.length)}
                        children={informationRoom.data.bookingDetails.children || 0}
                        onSubmit={handleSubmit}
                        hiddenColumn={"room_number"}
                        note={informationRoom?.data?.bookingDetails?.note}
                      />
                    ) : null}

                    <TableRoomInfo />

                    <Table
                      columns={columns}
                      autoHeight
                      sxHeadCell={{
                        background: (theme) =>
                          theme.palette.mode === "light" ? Colors.GreenLight : Colors.GreenDark,
                      }}
                    >
                      {data.length ? (
                        data.map((row, index) => (
                          <CardItemService
                            disabled={
                              informationRoom?.data?.bookingDetails.status !== "in_progress"
                            }
                            onRemoveItem={onRemoveItem}
                            columns={columns}
                            data={row}
                            key={index}
                            index={index}
                            onChangeQuantity={handleChangeQuantity}
                          />
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columns.length} align="center">
                            Không có dịch vụ / hàng hóa sử dụng
                          </TableCell>
                        </TableRow>
                      )}
                    </Table>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogServiceInformation;
