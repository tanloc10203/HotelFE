import AddIcon from "@mui/icons-material/Add";
import { Box, Button, LinearProgress } from "@mui/material";
import { cloneDeep, isNumber } from "lodash";
import { FC, useCallback, useEffect, useMemo } from "react";
import { appActions } from "~/features/app";
import { priceListActions, usePriceList } from "~/features/priceList";
import { roomTypeActions, useRoomTypes } from "~/features/roomTypes";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { IRoomType } from "~/types";
import { PriceListState } from "~/types/priceList.model";
import DialogAddEditDiscount from "./components/DialogAddEditDiscount";
import DialogAddEditPriceList from "./components/DialogAddEditPriceList";
import DrawerSeeDiscount from "./components/DrawerSeeDiscount";
import DrawerSeePriceList from "./components/DrawerSeePriceList";
import TableSetupPrices from "./components/TableSetupPrices";

const { Container, Title, HeadSeo, Breadcrumbs, Card } = ForPage;

const SetupPrice: FC = () => {
  const {
    data,
    pagination,
    filters,
    openAddEdit,
    openSeeDetails,
    selected,
    isLoading,
    dataDiscounts,
    filtersDiscount,
    paginationDiscount,
    openAddEditDiscount,
    openSeeDetailsDiscount,
    selectedDiscount,
  } = usePriceList();
  const { data: dataRoomTypes } = useRoomTypes();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(priceListActions.getDataStart({ ...filters, type: "room" }));
  }, [filters]);

  useEffect(() => {
    dispatch(priceListActions.getDataDiscountStart({ ...filtersDiscount, type: "discount" }));
  }, [filtersDiscount]);

  useEffect(() => {
    dispatch(roomTypeActions.getDataStart({ limit: 9999, page: 1 }));
  }, []);

  const handleChangePage = useCallback(
    (page: number) => {
      dispatch(priceListActions.setFilter({ ...filters, page }));
    },
    [filters]
  );

  const handleChangePageDiscount = useCallback(
    (page: number) => {
      dispatch(priceListActions.setFilterDiscount({ ...filtersDiscount, page }));
    },
    [filtersDiscount]
  );

  const handleOpenAdd = useCallback(() => {
    dispatch(priceListActions.setToggleOpenAddEdit(true));
  }, []);

  const handleOpenAddDiscount = useCallback(() => {
    dispatch(priceListActions.setToggleOpenAddEditDiscount(true));
  }, []);

  const handleClose = useCallback(() => {
    dispatch(priceListActions.setToggleOpenAddEdit(false));
    dispatch(priceListActions.setToggleOpenSeeDetails(false));
    dispatch(priceListActions.setSelected(null));
  }, []);

  const handleCloseDiscount = useCallback(() => {
    dispatch(priceListActions.setToggleOpenAddEditDiscount(false));
    dispatch(priceListActions.setToggleOpenSeeDetailsDiscount(false));
    dispatch(priceListActions.setSelectedDiscount(null));
  }, []);

  const initialValues = useMemo((): PriceListState => {
    const roomTypes: IRoomType[] = dataRoomTypes.map((t, index) => ({
      ...t,
      prices: {
        price_offline: 900000 + index * 200000,
        price_online: 800000 + index * 200000,
        room_type_id: t.id!,
        price_hours: [{ price: 500000 + index * 200000, room_type_id: t.id!, start_hour: 1 }],
      },
    }));

    if (!selected) {
      return {
        name: "",
        description: "",
        start_time: "",
        end_time: "",
        type: "room",
        is_default: true,
        roomTypes,
      };
    }

    // console.log("====================================");
    // console.log(`dataRoomTypes`, roomTypes);
    // console.log("====================================");

    const dataRoomTypesSelectedTemp = selected.roomTypes.map((t) => t.id);

    const roomTypesClone = cloneDeep(selected.roomTypes);

    const filtersDataIsNew = roomTypes.filter((t) => !dataRoomTypesSelectedTemp.includes(t.id));

    if (filtersDataIsNew.length) {
      roomTypesClone.push(filtersDataIsNew[0]);
    }

    console.log("====================================");
    console.log(`filtersDataIsNew`, roomTypesClone);
    console.log("====================================");

    return {
      ...selected,
      roomTypes: roomTypesClone,
      is_default: isNumber(selected.is_default)
        ? Boolean(selected.is_default === 1)
        : selected.is_default,
    };
  }, [selected, dataRoomTypes]);

  const initialValuesDiscount = useMemo((): PriceListState => {
    if (!selectedDiscount) {
      return {
        name: "",
        description: "",
        start_time: "",
        end_time: "",
        type: "discount",
        is_default: true,
        roomTypes: [],
      };
    }

    return {
      ...selectedDiscount,
      is_default: isNumber(selectedDiscount.is_default)
        ? Boolean(selectedDiscount.is_default === 1)
        : selectedDiscount.is_default,
    };
  }, [selectedDiscount]);

  const handleSubmit = useCallback((value: PriceListState, resetForm: () => void) => {
    const { created_at, updated_at, ...others } = value;

    const data = {
      ...others,
      roomTypes: value.roomTypes!.map((t) => ({ id: t.id, prices: t.prices })),
    } as const;

    dispatch(appActions.openOverplay());

    if (data.id) {
      dispatch(priceListActions.editDataStart({ data: data as any, resetForm }));
    } else {
      dispatch(priceListActions.addDataStart({ data: data as any, resetForm }));
    }
  }, []);

  const handleSubmitDiscount = useCallback((value: PriceListState, resetForm: () => void) => {
    const { created_at, updated_at, ...others } = value;

    let data = {
      ...others,
      roomTypes: value.roomTypes!.map((t) => {
        const { created_at, updated_at, ...othersDiscount } = t.discount!;

        return {
          id: t.id,
          discount: {
            ...othersDiscount,
            time_start: others.start_time,
            time_end: others.end_time,
            is_public: isNumber(othersDiscount?.is_public)
              ? Boolean(othersDiscount.is_public === 1)
              : othersDiscount?.is_public,
          },
        };
      }),
    };

    dispatch(appActions.openOverplay());

    if (data.id) {
      dispatch(priceListActions.editDataDiscountStart({ data: data as any, resetForm }));
    } else {
      dispatch(priceListActions.addDataDiscountStart({ data: data as any, resetForm }));
    }
  }, []);

  const handleGetDataFromAction = useCallback((type: "edit" | "see", value: PriceListState) => {
    if (type === "see") {
      dispatch(priceListActions.setToggleOpenSeeDetails(true));
    } else {
      dispatch(priceListActions.setToggleOpenAddEdit(true));
    }

    dispatch(priceListActions.setSelected(value));
  }, []);

  const handleGetDataFromActionDiscount = useCallback(
    (type: "edit" | "see", value: PriceListState) => {
      if (type === "see") {
        dispatch(priceListActions.setToggleOpenSeeDetailsDiscount(true));
      } else {
        dispatch(priceListActions.setToggleOpenAddEditDiscount(true));
      }

      dispatch(priceListActions.setSelectedDiscount(value));
    },
    []
  );

  console.log("====================================");
  console.log(`initialValues`, initialValues);
  console.log("====================================");

  return (
    <ForPage>
      <HeadSeo title="Thiết lập bảng giá phòng" />

      {openAddEdit ? (
        <DialogAddEditPriceList
          initialValues={initialValues}
          open={openAddEdit}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
      ) : null}

      {openAddEditDiscount ? (
        <DialogAddEditDiscount
          roomType={dataRoomTypes}
          initialValues={initialValuesDiscount}
          open
          onSubmit={handleSubmitDiscount}
          onClose={handleCloseDiscount}
        />
      ) : null}

      {openSeeDetails && selected ? (
        <DrawerSeePriceList open data={selected} onClose={handleClose} />
      ) : null}

      {openSeeDetailsDiscount && selectedDiscount ? (
        <DrawerSeeDiscount open data={selectedDiscount} onClose={handleCloseDiscount} />
      ) : null}

      <Container maxWidth="xl">
        <Title title="Danh sách bảng giá" mb={2} />

        <Breadcrumbs data={[{ label: "Dang sách bảng giá" }]} mb={3} />

        <Card
          title="Bảng giá phòng"
          action={
            <Button onClick={handleOpenAdd} startIcon={<AddIcon />} variant="contained">
              Thêm bảng giá phòng
            </Button>
          }
          sx={{ position: "relative" }}
        >
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

          <TableSetupPrices
            page={pagination.page}
            totalPage={pagination.totalPage}
            onChangePage={handleChangePage}
            onSeeDetails={(value) => handleGetDataFromAction("see", value)}
            onSeeEdit={(value) => handleGetDataFromAction("edit", value)}
            data={data}
          />
        </Card>

        <Card
          title="Bảng giá khuyến mãi"
          action={
            <Button onClick={handleOpenAddDiscount} startIcon={<AddIcon />} variant="contained">
              Thêm bảng giá khuyến mãi
            </Button>
          }
          sx={{ position: "relative", mt: 2 }}
        >
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

          <TableSetupPrices
            page={paginationDiscount.page}
            totalPage={paginationDiscount.totalPage}
            onChangePage={handleChangePageDiscount}
            onSeeDetails={(value) => handleGetDataFromActionDiscount("see", value)}
            onSeeEdit={(value) => handleGetDataFromActionDiscount("edit", value)}
            data={dataDiscounts}
          />
        </Card>
      </Container>
    </ForPage>
  );
};

export default SetupPrice;
