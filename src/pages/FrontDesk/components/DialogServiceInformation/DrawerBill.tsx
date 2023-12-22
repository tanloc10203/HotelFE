import CloseIcon from "@mui/icons-material/Close";
import { DialogContent, Grid, IconButton, Stack, TableCell, TableRow } from "@mui/material";
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { FC, KeyboardEvent, MouseEvent, useMemo, useState } from "react";
import { AppbarDialog, Bill, ColumnState } from "~/components";
import { Colors, SCROLLBAR_CUSTOM } from "~/constants";
import { useFrontDeskSelector } from "~/features/frontDesk";
import { useGuestUseServiceSelector } from "~/features/guestUseServices";
import { ForPage } from "~/layouts";
import { BillInfoPayload } from "~/types";
import { calDateTimeBooking } from "~/utils";
import CardItemServiceBill from "./CardItemServiceBill";
import TableRoomInfo from "./TableRoomInfo";

const { Table } = ForPage;

type DrawerBillProps = {};

const DrawerBill: FC<DrawerBillProps> = () => {
  const { bookingDetailsId, data } = useGuestUseServiceSelector();
  const { informationRoom } = useFrontDeskSelector();

  const initialValues = useMemo((): BillInfoPayload => {
    if (!informationRoom.data)
      return {
        customerPay: 0,
        customerRequirePay: 0,
        discount: 0,
        note: "",
        totalCostRoom: 0,
        totalCostService: 0,
        totalQuantityOrdered: 0,
        change: 0,
        deposit: 0,
      };

    const { bookingDetails, room, tax } = informationRoom.data;

    const time = calDateTimeBooking(
      bookingDetails?.check_in!,
      bookingDetails?.check_out!,
      bookingDetails?.bookingData?.mode_booking!
    );

    const bookedOnline = Boolean(bookingDetails.bookingData.is_booked_online === 1);
    const {
      bookingData: { mode_booking },
    } = bookingDetails;

    const price = Number(
      bookedOnline
        ? mode_booking === "time"
          ? room?.prices?.price_hours[0].price
          : room?.prices?.price_online
        : mode_booking === "time"
        ? room?.prices?.price_hours[0].price
        : room?.prices?.price_offline
    );

    const totalCostRoom = (price + price * tax) * time.diff;
    const totalCostService = data.reduce((total, value) => (total += value.sub_total!), 0);
    const totalQuantityOrdered = data.reduce(
      (total, value) => (total += value.quantity_ordered!),
      0
    );

    return {
      customerPay: 0,
      customerRequirePay: totalCostRoom + totalCostService,
      discount: 0,
      totalQuantityOrdered,
      note: "",
      totalCostRoom: totalCostRoom,
      totalCostService,
      change: 0,
      deposit: 0,
    };
  }, [informationRoom, data]);

  const [state, setState] = useState(false);

  const columns: ColumnState[] = [
    { id: "name", label: "Hàng hóa/Dịch vụ", minWidth: 80 },
    {
      id: "quantity",
      label: "SL",
      minWidth: 80,
      maxWidth: 80,
      align: "center",
      styles: { padding: 0 },
    },
    { id: "price", label: "Đơn giá", minWidth: 100, maxWidth: 100 },
    {
      id: "subTotal",
      label: "Thành tiền",
      minWidth: 100,
      maxWidth: 100,
      styles: { padding: 0 },
      align: "center",
    },
  ];

  const toggleDrawer = (open: boolean) => (event: KeyboardEvent | MouseEvent) => {
    if (
      event &&
      event.type === "keydown" &&
      ((event as KeyboardEvent).key === "Tab" || (event as KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

  const list = () => (
    <>
      <AppbarDialog title={`Mã đặt chi tiết ${bookingDetailsId}`}>
        <IconButton onKeyDown={toggleDrawer(false)} onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </AppbarDialog>

      <DialogContent sx={{ width: "auto", ...SCROLLBAR_CUSTOM }} role="presentation">
        <Grid container spacing={1}>
          <Grid item pr={1} lg={8}>
            <Stack mb={2}>
              <TableRoomInfo />
            </Stack>

            <Stack>
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
                    <CardItemServiceBill columns={columns} data={row} key={index} index={index} />
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
          </Grid>

          <Grid
            borderLeft={(theme) => `1px dashed  ${theme.palette.grey[400]}`}
            pl={1}
            height={"100vh"}
            item
            lg={4}
          >
            <Bill
              isPaid={informationRoom?.data?.bill?.status === "paid"}
              initialValues={initialValues}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </>
  );

  return (
    <>
      <Button sx={{ px: 4 }} variant="outlined" size="small" onClick={toggleDrawer(true)}>
        Hóa đơn
      </Button>

      <SwipeableDrawer
        PaperProps={{ sx: { borderRadius: `12px 0 0 12px`, width: "70%" } }}
        sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
        anchor={"right"}
        open={state}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {state ? list() : null}
      </SwipeableDrawer>
    </>
  );
};

export default DrawerBill;
