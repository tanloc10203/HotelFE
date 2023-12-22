import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, LinearProgress, TextField, Typography } from "@mui/material";
import { useCallback } from "react";
import { Actions, ButtonActions } from "~/components";
import { ForPage } from "~/layouts";
import { IServiceType } from "~/types";
import TableServiceTypes from "./components/TableServiceTypes";
import FormAddEditServiceTypes from "./form/FormAddEditServiceTypes";
import { useColumnServiceTypes } from "./helpers/useColumnService";
import useServiceTypeHelpers from "./helpers/useServiceTypeHelpers";

const { HeadSeo, Container, Title, Grid, Card, StackCategory, Breadcrumbs } = ForPage;

const ServiceTypePage = () => {
  const {
    addEditError,
    data,
    isLoading,
    initialValues,
    pagination,
    textsByMode,
    isEditMode,
    handleOnSubmit,
    handleOnClick,
    handleCloseModeEdit,
  } = useServiceTypeHelpers();

  const columns = useColumnServiceTypes();

  const renderActions = useCallback(
    (row: IServiceType) => {
      return (
        <Actions>
          <ButtonActions
            onClick={() => handleOnClick("edit", row)}
            color="info"
            startIcon={<EditIcon />}
          >
            Chỉnh sửa
          </ButtonActions>
        </Actions>
      );
    },
    [handleOnClick]
  );

  return (
    <ForPage>
      <HeadSeo title="Danh sách loại dịch vụ" />

      <Container maxWidth="xl">
        <Title title="Danh sách loại dịch vụ" mb={2} />

        <Breadcrumbs data={[{ label: "Dang sách loại dịch vụ" }]} mb={3} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={8}>
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

              <StackCategory my={3}>
                <Box sx={{ width: "100%" }}>
                  <TextField
                    id="outlined-basic"
                    label="Tìm kiếm"
                    placeholder="Nhập tên  muốn tìm"
                    variant="outlined"
                    fullWidth
                  />
                </Box>
                {isEditMode ? (
                  <Box sx={{ width: "20%" }}>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={handleCloseModeEdit}
                    >
                      Thêm mới
                    </Button>
                  </Box>
                ) : null}
              </StackCategory>

              <TableServiceTypes
                columns={columns}
                data={data}
                page={pagination.page}
                totalPage={pagination.totalPage}
                actions={renderActions}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card title={textsByMode.title}>
              {addEditError ? (
                <Typography color="error" fontStyle={"italic"}>
                  {addEditError}
                </Typography>
              ) : null}

              <FormAddEditServiceTypes
                initialValues={initialValues}
                textButton={textsByMode.textButton}
                loading={isLoading === "pending"}
                onSubmit={handleOnSubmit}
              />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ForPage>
  );
};

export default ServiceTypePage;
