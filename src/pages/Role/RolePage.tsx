import { Box, Button, LinearProgress, TextField, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { ForPage } from "~/layouts";
import { DashboardPaths, RolePayload } from "~/types";
import TableCollapsible from "./components/TableCollapsible";
import { useLoadRole } from "./helpers/loadData";
import { useDebounce } from "@uidotdev/usehooks";

const { HeadSeo, Container, Title, Card, StackCategory, Dialog, Breadcrumbs } = ForPage;

const RolePage: React.FC = () => {
  const [search, setSearch] = useState("");
  const debounceValue = useDebounce(search, 500);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<RolePayload | null>(null);

  const handleClickOpen = useCallback(() => setOpen(true), []);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleSelectedDelete = useCallback((selected: RolePayload) => {
    handleClickOpen();
    setSelected(selected);
  }, []);

  const handleAgreeDelete = useCallback(() => {
    if (!selected) return;
    handleClose();
    setSelected(null);
  }, [selected]);

  const { data, error, isLoading, isValidating } = useLoadRole({ name: debounceValue });

  return (
    <ForPage>
      <HeadSeo title="Quản lý vai trò" />

      <Container maxWidth="xl">
        <Title title="Quản lý vai trò" mb={2} />

        <Breadcrumbs data={[{ label: "Quản lý vai trò" }]} mb={3} />

        <StackCategory justifyContent={"space-between"}>
          <TextField
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            id="outlined-basic"
            label="Tìm kiếm"
            placeholder="Nhập tên vài trò bạn muốn tìm"
            variant="outlined"
            sx={{
              minWidth: {
                lg: "40%",
                md: "50%",
                xs: "100%",
              },
            }}
          />
        </StackCategory>

        {open && selected ? (
          <Dialog
            onAgree={handleAgreeDelete}
            onClose={handleClose}
            open={open}
            textContent="Bạn có chắc chắn muốn xóa"
            title={`Xóa vai trò ${selected.name}`}
          />
        ) : null}

        <Card
          title="Danh sách vai trò"
          sx={{ position: "relative", mt: 5 }}
          action={
            <Button variant="contained" component={Link} to={DashboardPaths.AddRole}>
              Thêm vai trò
            </Button>
          }
        >
          {isLoading || isValidating ? (
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
          ) : error ? (
            <Typography>Đã xảy ra lỗi khi tải dữ liệu</Typography>
          ) : data?.metadata && data.metadata.length > 0 ? (
            <TableCollapsible rows={data.metadata} onDelete={handleSelectedDelete} />
          ) : (
            <Typography>Chưa có dữ liệu</Typography>
          )}
        </Card>
      </Container>
    </ForPage>
  );
};

export default RolePage;
