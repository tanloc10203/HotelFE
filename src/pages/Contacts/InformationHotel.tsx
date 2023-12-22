import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, IconButton, LinearProgress, TableCell, TableRow } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef } from "react";
import { ColumnState, LazyLoading, TableCellOverride } from "~/components";
import { appActions } from "~/features/app";
import { bannerActions, useBanner } from "~/features/banner";
import { informationHotelActions, useInformationHotel } from "~/features/informationHotel";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { InformationHotelState } from "~/types";
import AddEditInformationHotel from "./components/AddEditInformationHotel/AddEditInformationHotel";
import EditIcon from "@mui/icons-material/Edit";
import { fDateDayjs } from "~/utils";
import dayjs from "dayjs";

const { HeadSeo, Container, Card, Table } = ForPage;

const InformationHotel = () => {
  const { selected, open, data: dataHotel, isLoading: loadHotel } = useInformationHotel();
  const { data: banners, filters, pagination, isLoading } = useBanner();
  const imageRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(appActions.openOverplay(""));
    dispatch(informationHotelActions.getDataStart());
  }, []);

  useEffect(() => {
    dispatch(bannerActions.getDataStart(filters));
  }, [filters]);

  const initialValues = useMemo((): InformationHotelState => {
    if (!selected) {
      return {
        name: "",
        email: "",
        address: "",
        phone_number: "",
        description: "",
        long: "",
        lat: "",
      };
    }

    const { created_at, updated_at, ...others } = selected;

    return others;
  }, [selected]);

  const columnBanners: ColumnState[] = [
    { id: "id", label: "Mã banner", align: "center", maxWidth: 10 },
    { id: "url", label: "Ảnh", align: "center" },
    { id: "actions", label: "Xóa", align: "center", maxWidth: 10 },
  ];

  const columnHotels: ColumnState[] = [
    { id: "name", label: "Tên KS" },
    { id: "email", label: "Email" },
    { id: "address", label: "Địa chỉ" },
    { id: "phone_number", label: "SĐT" },
    { id: "description", label: "Giới thiệu" },
    {
      id: "created_at",
      label: "Ngày tạo",

      format(value) {
        return fDateDayjs(dayjs(value));
      },
    },
    {
      id: "updated_at",
      label: "Ngày cập nhật",

      format(value) {
        return fDateDayjs(dayjs(value));
      },
    },
    { id: "actions", label: "", align: "center" },
  ];

  const handleChangeImages = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;

    if (!files || !files?.length) return;

    dispatch(appActions.openOverplay("Đang thêm banner..."));
    dispatch(bannerActions.addDataStart(files));
  }, []);

  const handleClickUpload = useCallback(() => {
    if (!imageRef.current) return;
    imageRef.current.click();
  }, [imageRef.current]);

  const handleDeleteBanner = useCallback((id: string) => {
    dispatch(appActions.openOverplay("Đang xóa banner..."));
    dispatch(bannerActions.deleteDataStart(id));
  }, []);

  const handleChangeBannerPage = useCallback(
    (newPage: number) => {
      dispatch(bannerActions.setFilter({ ...filters, page: newPage }));
    },
    [filters]
  );

  const handleClickAddInfo = useCallback(() => {
    dispatch(informationHotelActions.setToggleDialogAddEdit(true));
  }, []);

  const handleCloseDialog = useCallback(() => {
    dispatch(informationHotelActions.setToggleDialogAddEdit(false));
    dispatch(informationHotelActions.setSelected(null));
  }, []);

  const handleSubmit = useCallback((values: InformationHotelState, resetForm: () => void) => {
    dispatch(appActions.openOverplay("Đang lưu thông tin"));
    if (values.id) {
      dispatch(informationHotelActions.editDataStart({ data: values, resetForm }));
    } else {
      dispatch(informationHotelActions.addDataStart({ data: values, resetForm }));
    }
  }, []);

  const handleEditInfo = useCallback((state: InformationHotelState) => {
    dispatch(informationHotelActions.setSelected(state));
    dispatch(informationHotelActions.setToggleDialogAddEdit(true));
  }, []);

  return (
    <ForPage>
      <HeadSeo title="Thông tin khách sạn" />

      {open ? (
        <AddEditInformationHotel
          open={open}
          initialValues={initialValues}
          onClose={handleCloseDialog}
          onSubmit={handleSubmit}
        />
      ) : null}

      <Container maxWidth="xl">
        <Card
          title="Thông tin khách sạn"
          action={
            loadHotel === "success" && !dataHotel.length ? (
              <Button onClick={handleClickAddInfo} variant="contained" startIcon={<AddIcon />}>
                Thêm Thông tin
              </Button>
            ) : null
          }
        >
          <Table
            columns={columnHotels}
            page={pagination.page}
            totalRow={pagination.totalPage}
            onPageChange={handleChangeBannerPage}
          >
            {dataHotel.length ? (
              dataHotel.map((row) => (
                <TableRow key={row.id}>
                  {columnHotels.map((column, index) => {
                    const value = row[column.id as keyof InformationHotelState];

                    if (column.id === "actions") {
                      return (
                        <TableCellOverride key={index} {...column}>
                          <IconButton onClick={() => handleEditInfo(row)} color="primary">
                            <EditIcon />
                          </IconButton>
                        </TableCellOverride>
                      );
                    }

                    return (
                      <TableCellOverride key={index} {...column}>
                        {column.format ? column.format(value) : (value as string)}
                      </TableCellOverride>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={columnHotels.length}>
                  Chưa có thông tin
                </TableCell>
              </TableRow>
            )}
          </Table>
        </Card>

        <Card
          title="Danh sách banner"
          sx={{ mt: 2, position: "relative" }}
          action={
            <Button onClick={handleClickUpload} variant="contained" startIcon={<AddIcon />}>
              Thêm banner
            </Button>
          }
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

          <input
            accept="image/*"
            multiple={true}
            type="file"
            tabIndex={-1}
            style={{ display: "none" }}
            ref={imageRef}
            onChange={handleChangeImages}
          />
          <Table
            columns={columnBanners}
            page={pagination.page}
            totalRow={pagination.totalPage}
            onPageChange={handleChangeBannerPage}
          >
            {banners.length ? (
              banners.map((banner) => (
                <TableRow key={banner.id}>
                  {columnBanners.map((column, idx) => {
                    if (column.id === "url") {
                      return (
                        <TableCellOverride key={idx} {...column}>
                          <LazyLoading
                            src={banner.url}
                            sxBox={{ width: 100, height: 100 }}
                            sxImage={{ width: 100, height: 100 }}
                          />
                        </TableCellOverride>
                      );
                    }

                    if (column.id === "actions") {
                      return (
                        <TableCellOverride key={idx} {...column}>
                          <IconButton onClick={() => handleDeleteBanner(banner.id!)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </TableCellOverride>
                      );
                    }

                    return (
                      <TableCellOverride key={idx} {...column}>
                        {banner.id}
                      </TableCellOverride>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={columnBanners.length}>
                  Chưa có banner nào
                </TableCell>
              </TableRow>
            )}
          </Table>
        </Card>
      </Container>
    </ForPage>
  );
};

export default InformationHotel;
