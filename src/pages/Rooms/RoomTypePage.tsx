import { Box, LinearProgress, TextField } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "~/features/app";
import { roomTypeActions, useRoomTypes } from "~/features/roomTypes";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { DashboardPaths, IRoomTypeResponse } from "~/types";
import ActionRoomType from "./components/ActionRoomType";
import DialogRoomTypeDetails from "./components/DialogRoomTypeDetails";
import TableRoomType from "./components/TableRoomType";

const { HeadSeo, Container, Title, Card, StackCategory, Dialog, Breadcrumbs } = ForPage;

type Mode = "edit" | "delete" | "details" | "deleted_trash" | "restore" | null;

const RoomTypePage = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const isTrashMode = Boolean(params?.type === "trash");

  const { filters, isLoading } = useRoomTypes();
  const { severity } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<{
    mode: Mode;
    data: IRoomTypeResponse | null;
  }>({
    mode: null,
    data: null,
  });

  useEffect(() => {
    dispatch(
      roomTypeActions.getDataStart({
        ...filters,
        ...(isTrashMode ? { delete_not_null: true, limit: 9999 } : {}),
      })
    );
  }, [filters, isTrashMode]);

  useEffect(() => {
    if (severity === "success") {
      setSelected({ mode: null, data: null });
      if (open) {
        setOpen(false);
      }
    }
  }, [severity, open]);

  const handleOnDetails = useCallback((roomType: IRoomTypeResponse) => {
    setSelected({ mode: "details", data: roomType });
  }, []);

  const handleOnDelete = useCallback((roomType: IRoomTypeResponse) => {
    setSelected({ mode: "delete", data: roomType });
    setOpen(true);
  }, []);

  const handleOnRestore = useCallback((roomType: IRoomTypeResponse) => {
    setSelected({ mode: "restore", data: roomType });
  }, []);

  const handleOnDeleteTrash = useCallback((roomType: IRoomTypeResponse) => {
    setSelected({ mode: "deleted_trash", data: roomType });
  }, []);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleAgreeDelete = useCallback(() => {
    if (selected.mode === "delete" && selected.data) {
      dispatch(roomTypeActions.deleteDataStart(selected.data));
    }
  }, [selected]);

  const handleChangeSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value },
      } = event;

      setSearch(value);
      dispatch(roomTypeActions.setDebounceSearch({ ...filters, page: 0, name_like: value }));
    },
    [filters]
  );

  const openDialogDetails = useMemo(
    () => Boolean(selected.mode === "details" && selected.data),
    [selected]
  );

  const handleCloseDialogDetails = useCallback(() => {
    setSelected({ mode: null, data: null });
  }, []);

  const title = useMemo(() => (isTrashMode ? "Thùng rác" : "Danh sách loại phòng"), [isTrashMode]);

  const openRestore = useMemo(
    () => Boolean(selected?.mode === "restore" && selected?.data),
    [selected]
  );

  const openDeleteTrash = useMemo(
    () => Boolean(selected?.mode === "deleted_trash" && selected?.data),
    [selected]
  );

  const handleAgreeRestore = useCallback(() => {
    if (selected.mode === "restore" && selected.data) {
      dispatch(roomTypeActions.restoreDataStart(selected.data));
    }
  }, [selected]);

  const handleAgreeDeleteInTrash = useCallback(() => {
    if (selected.mode === "deleted_trash" && selected.data) {
      dispatch(roomTypeActions.deleteInTrashStart(selected.data));
    }
  }, [selected]);

  return (
    <ForPage>
      <HeadSeo title={title} />

      <Container maxWidth="xl">
        <Title title={title} mb={2} />

        <Breadcrumbs
          data={
            isTrashMode
              ? [
                  { label: "Dang sách loại phòng", to: DashboardPaths.RoomTypes },
                  { label: "Thùng rác" },
                ]
              : [{ label: "Dang sách loại phòng" }]
          }
          mb={3}
        />

        <Dialog
          onAgree={handleAgreeDelete}
          onClose={handleClose}
          maxWidth="xs"
          open={open}
          textContent={`Bạn có chắc chắn muốn chuyển \`${selected.data?.name}\` vào thùng rác`}
          title={`Xác nhận \`${selected.data?.name}\``}
        />

        <Dialog
          onAgree={handleAgreeRestore}
          onClose={handleCloseDialogDetails}
          maxWidth="xs"
          open={openRestore}
          textContent={`Bạn có chắc chắn muốn khôi phục \`${selected.data?.name}\`.`}
          title={`Xác nhận \`${selected.data?.name}\``}
        />

        <Dialog
          onAgree={handleAgreeDeleteInTrash}
          onClose={handleCloseDialogDetails}
          maxWidth="xs"
          open={openDeleteTrash}
          textContent={`Bạn có chắc chắn muốn xóa vinh viễn \`${selected.data?.name}\`.`}
          title={`Xác nhận \`${selected.data?.name}\``}
        />

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
            <Box width={"30%"}>
              <TextField
                onChange={handleChangeSearch}
                value={search}
                id="outlined-basic"
                label="Tìm kiếm"
                placeholder="Nhập tên  muốn tìm"
                variant="outlined"
                fullWidth
              />
            </Box>

            <Box>
              <ActionRoomType
                toTrash={
                  isTrashMode
                    ? `${DashboardPaths.RoomTypes}`
                    : `${DashboardPaths.RoomTypesTrash}/trash`
                }
                labelTrash={isTrashMode ? `Quay về Danh sách` : `Thùng rác`}
              />
            </Box>
          </StackCategory>

          <TableRoomType
            isTrashMode={isTrashMode}
            onDetails={handleOnDetails}
            onDelete={handleOnDelete}
            onRestore={handleOnRestore}
            onDeleteTrash={handleOnDeleteTrash}
          />

          {openDialogDetails ? (
            <DialogRoomTypeDetails
              open={openDialogDetails}
              onClose={handleCloseDialogDetails}
              row={selected.data!}
            />
          ) : null}
        </Card>
      </Container>
    </ForPage>
  );
};

export default RoomTypePage;
