import { Box, LinearProgress } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "~/features/app";
import { discountActions } from "~/features/discount";
import { roomActions, useRoom } from "~/features/room";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { IRoomResponse } from "~/types";
import ActionRoomType from "./components/ActionRoomType";
import DialogRoomDetails from "./components/DialogRoomDetails";
import TableRoom from "./components/TableRoom";

const { HeadSeo, Container, Title, Card, StackCategory, Breadcrumbs } = ForPage;

type ModeType = "delete" | "details" | "addEditDiscount" | "detailsPrices" | null;
type DataSelected = IRoomResponse | null;

const RoomPage = () => {
  const dispatch = useAppDispatch();
  const { filters, isLoading } = useRoom();
  const { severity } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<{ mode: ModeType; data: DataSelected }>({
    mode: null,
    data: null,
  });

  useEffect(() => {
    dispatch(roomActions.getDataStart(filters));
  }, [filters]);

  useEffect(() => {
    if (severity === "success") {
      setSelected({ mode: null, data: null });
      if (open) {
        setOpen(false);
      }
    }
  }, [severity, open]);

  const handleOnEventTable = useCallback((mode: ModeType, data: DataSelected) => {
    setSelected({ mode, data });
  }, []);

  const handleChangeSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value },
      } = event;

      setSearch(value);
      dispatch(roomActions.setDebounceSearch({ ...filters, page: 0, name_like: value }));
    },
    [filters]
  );

  const openDialog = useMemo(
    () => (mode: ModeType) => Boolean(selected.mode === mode && selected.data),
    [selected]
  );

  const handleCloseDialog = useCallback(() => {
    setSelected({ mode: null, data: null });
  }, []);

  const handleAddDiscount = useCallback((data: IRoomResponse) => {
    console.log(`data`, data.discount);

    dispatch(discountActions.setToggleDiscount(data));
  }, []);

  // const handleCloseDialogAddDiscount = useCallback(() => {
  //   dispatch(discountActions.setToggleDiscount(null));
  // }, []);

  // const initialValuesDiscount = useMemo((): RoomPayloadChangePrice => {
  //   if (selectedRoom) {
  //     return {
  //       id: `${selectedRoom.discount?.id || ""}`,
  //       is_public: Boolean(selectedRoom.discount?.is_public),
  //       num_discount: `${selectedRoom.discount?.num_discount || "0"}`,
  //       percent_discount: `${
  //         selectedRoom.discount?.percent_discount
  //           ? selectedRoom.discount?.percent_discount * 100
  //           : ""
  //       }`,
  //       price_day: selectedRoom.roomType.prices?.price_day || 0,
  //       price_hour: selectedRoom.roomType.prices?.price_hour || 0,
  //       price_day_online: selectedRoom.roomType.prices?.price_day_online || 0,
  //       price_hour_online: selectedRoom.roomType.prices?.price_hour_online || 0,
  //       price_discount: `${selectedRoom.discount?.price_discount || ""}`,
  //       time_end: `${selectedRoom.discount?.time_end || ""}`,
  //       time_start: `${selectedRoom.discount?.time_start || ""}`,
  //       type: `${selectedRoom.discount?.type || ""}`,
  //       room_id: selectedRoom.id!,
  //     };
  //   }

  //   return {
  //     is_public: true,
  //     num_discount: "",
  //     percent_discount: "",
  //     price_day: 0,
  //     price_hour: 0,
  //     price_day_online: 0,
  //     price_hour_online: 0,
  //     price_discount: "",
  //     time_end: "",
  //     time_start: "",
  //     type: "",
  //   };
  // }, [selectedRoom]);

  // const handleSubmitAddEditDiscount = useCallback((values: RoomPayloadChangePrice) => {
  //   const { price_day, price_day_online, price_hour, price_hour_online, ...others } = values;

  //   const data: DiscountPayload = others;

  //   dispatch(appActions.openOverplay("Đang xử lý khuyến mãi..."));

  //   if (others.id) {
  //     dispatch(discountActions.editDataStart(data));
  //   } else {
  //     dispatch(discountActions.addDataStart(data));
  //   }
  // }, []);

  return (
    <ForPage>
      <HeadSeo title="Danh sách phòng" />

      {/* {selectedRoom ? (
        <FormDialogAddDiscount
          initialValues={initialValuesDiscount}
          open={Boolean(selectedRoom)}
          onClose={handleCloseDialogAddDiscount}
          selected={selectedRoom}
          onSubmit={handleSubmitAddEditDiscount}
        />
      ) : null} */}

      <Container maxWidth="xl">
        <Title title="Danh sách phòng" mb={2} />

        <Breadcrumbs data={[{ label: "Dang sách phòng" }]} mb={3} />

        <Card title="" sx={{ position: "relative" }}>
          {isLoading === "pending" ? (
            <Box
              sx={{
                width: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
              }}
            >
              <LinearProgress />
            </Box>
          ) : null}

          <StackCategory my={3} justifyContent={"space-between"}>
            {/* <Box sx={{ width: "30%" }}>
              <TextField
                onChange={handleChangeSearch}
                value={search}
                id="outlined-basic"
                label="Tìm kiếm"
                placeholder="Nhập số phòng muốn tìm"
                variant="outlined"
                fullWidth
              />
            </Box> */}

            <Box>
              <ActionRoomType isRoom />
            </Box>
          </StackCategory>

          <TableRoom
            onAddDiscount={handleAddDiscount}
            onDetails={(data) => handleOnEventTable("details", data)}
          />

          {openDialog("details") ? (
            <DialogRoomDetails
              open={openDialog("details")}
              onClose={handleCloseDialog}
              row={selected.data!}
            />
          ) : null}
        </Card>
      </Container>
    </ForPage>
  );
};

export default RoomPage;
