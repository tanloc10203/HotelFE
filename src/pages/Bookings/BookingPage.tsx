import { ForPage } from "~/layouts";
import useManagerStateBooking from "./helpers/useManagerStateBooking";
import { Box, LinearProgress, TextField } from "@mui/material";
import { columnPercentGrid } from "~/utils";
import { SelectInput } from "~/components";
import TableBooking from "./components/TableBooking";

const { HeadSeo, Container, Card, StackCategory, Tab } = ForPage;

const BookingPage = () => {
  const {
    tabsData,
    tabStatus,
    isLoading,
    columns,
    data,
    pagination,
    handleChangeTab,
    handleChangePage,
  } = useManagerStateBooking();

  return (
    <ForPage>
      <HeadSeo title="Danh sách đặt phòng" />

      <Container maxWidth="xl">
        <Card title="Danh sách đặt phòng online" sx={{ position: "relative" }}>
          <Tab value={tabStatus} tabsData={tabsData} onChange={handleChangeTab} />

          <StackCategory my={3}>
            <Box width={`${columnPercentGrid(1.725)}%`}>
              <SelectInput options={[]} label="Bộ phận" />
            </Box>

            <Box width={`${columnPercentGrid(1.725)}%`}>
              <SelectInput options={[]} label="Chức vụ" />
            </Box>

            <Box width={`${columnPercentGrid(12 - 1.725 * 2 - 0.3)}%`}>
              <TextField
                id="outlined-basic"
                label="Tìm kiếm"
                placeholder="Nhập mã đặt phòng bạn muốn tìm"
                variant="outlined"
                fullWidth
              />
            </Box>
          </StackCategory>

          {/* <ResultFilter
          visible={visible}
          filters={filtersResults}
          numberResult={pagination.totalRows}
          onReset={handleCleanFilter}
        /> */}

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

          <TableBooking
            columns={columns}
            data={data}
            page={pagination.page}
            totalPage={pagination.totalPage}
            onChangePage={handleChangePage}
          />
        </Card>
      </Container>
    </ForPage>
  );
};

export default BookingPage;
