import { faker } from "@faker-js/faker";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { DatePickerMain } from "~/components";
import { Iconify } from "~/components/ui/iconify";
import { appActions } from "~/features/app";
import { useGetRole, useGetUser } from "~/features/auth";
import { reportActions, useReports } from "~/features/report";
import { useAppDispatch } from "~/stores";
import { RangeValue } from "~/types";
import { currentDate, fNumber, fPercent, getDates } from "~/utils";
import {
  AppConversionRates,
  AppCurrentSubject,
  AppCurrentVisits,
  AppNewsUpdate,
  AppOrderTimeline,
  AppTasks,
  AppTrafficBySite,
  AppWebsiteVisits,
  AppWidgetSummary,
} from "./components";
import { sample } from "lodash";

export default function DashboardAppPage() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const role = useGetRole()!;
  const user = useGetUser(role);
  const {
    boxReports: { quantityBooking, rateBooking, moneyRoom },
    roomTypesDetailsChart,
    serviceMoney: { products, services },
  } = useReports();

  const [dateBoxReport, setDateBoxReport] = useState<Dayjs>(currentDate());
  const [roomTypesDateChart, setRoomTypesDateChart] = useState<Dayjs>(currentDate());
  const [dateRanges, setDateRanges] = useState<RangeValue>([
    currentDate().subtract(10, "days"),
    currentDate(),
  ]);
  const [serviceType, setServiceType] = useState<"service" | "product">("service");

  useEffect(() => {
    const dateFormat = dateBoxReport.format("YYYY-MM-DD");
    dispatch(appActions.openOverplay());
    dispatch(reportActions.getBoxReportStart(dateFormat));
  }, [dateBoxReport]);

  useEffect(() => {
    const dateFormat = roomTypesDateChart.format("YYYY-MM-DD");
    dispatch(appActions.openOverplay());
    dispatch(reportActions.getRoomTypeDetailsChartStart(dateFormat));
  }, [roomTypesDateChart]);

  useEffect(() => {
    let start = currentDate().subtract(10, "days").format("YYYY-MM-DD");
    let end = currentDate().format("YYYY-MM-DD");

    if (dateRanges) {
      if (dateRanges[0]) {
        start = dateRanges[0].format("YYYY-MM-DD");
      }
      if (dateRanges[1]) {
        end = dateRanges[1].format("YYYY-MM-DD");
      }
    }

    dispatch(appActions.openOverplay());
    dispatch(reportActions.getServiceMoneyStart({ dateEnd: end, dateStart: start }));
  }, [dateRanges]);

  const dataRoomTypesDetailsChart = useMemo(() => {
    if (!roomTypesDetailsChart.length) return [];

    return roomTypesDetailsChart.map((t) => ({ value: t.money, label: t.name }));
  }, [roomTypesDetailsChart]);

  const labelDateRanges = useMemo(() => {
    if (!dateRanges)
      return getDates(currentDate().toDate(), currentDate().subtract(10, "days").toDate());

    if (!dateRanges[0] || !dateRanges[1])
      return getDates(currentDate().toDate(), currentDate().subtract(10, "days").toDate());

    return getDates(dateRanges[0].toDate(), dateRanges[1].toDate());
  }, [dateRanges]);

  const dataRenderService = useMemo(() => {
    if (serviceType === "service") {
      return services.map((t) => ({
        name: t.name,
        type: sample(["column", "area", "line"]),
        fill: sample(["gradient", "solid"]),
        data: t.dates.map((r) => r.subTotal),
      }));
    }

    return products.map((t) => ({
      name: t.name,
      type: sample(["column", "area", "line"]),
      fill: sample(["gradient", "solid"]),
      data: t.dates.map((r) => r.subTotal),
    }));
  }, [serviceType, services, products]);

  // console.log({ dataRenderService, labelDateRanges });

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Xin chào, {user?.display_name} quay trở lại
        </Typography>

        <Box width={"18%"} mb={2}>
          <DatePickerMain
            label=""
            value={dateBoxReport}
            onChange={(value) => setDateBoxReport(value!)}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Số lượng đặt phòng Online / Offline"
              total={quantityBooking.offline + quantityBooking.online}
              totalText={`${quantityBooking.online} / ${quantityBooking.offline}`}
              icon={"tabler:brand-booking"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Tỉ lệ đặt phòng thành công"
              total={rateBooking}
              totalText={`${fPercent(rateBooking) || 0}`}
              color="info"
              icon={"arcticons:armoury-crate"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Khách đang lưu trú"
              total={quantityBooking.inProgress}
              totalText={`${quantityBooking.inProgress}`}
              color="success"
              icon={"grommet-icons:in-progress"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Số lượng đặt phòng đã hủy"
              total={moneyRoom}
              totalText={`${fNumber(quantityBooking.canceled)}`}
              color="warning"
              icon={"fluent-emoji-high-contrast:money-bag"}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              serviceType={serviceType}
              onChangeServiceType={(value) => setServiceType(value)}
              dateRanges={dateRanges}
              onChangeDate={(value) => setDateRanges(value)}
              title="Danh thu hàng hóa / dịch vụ"
              subheader="(+43%) than last year"
              chartLabels={labelDateRanges}
              chartData={dataRenderService}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: "America", value: 4344 },
                { label: "Asia", value: 5435 },
                { label: "Europe", value: 1443 },
                { label: "Africa", value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Danh thu theo loại phòng"
              subheader={`Tổng danh thu ${fNumber(
                dataRoomTypesDetailsChart.reduce((t, v) => (t += v.value), 0)
              )}`}
              chartData={dataRoomTypesDetailsChart}
              date={roomTypesDateChart}
              onChangeDate={(value) => setRoomTypesDateChart(value!)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={["English", "History", "Physics", "Geography", "Chinese", "Math"]}
              chartData={[
                { name: "Series 1", data: [80, 50, 30, 40, 100, 20] },
                { name: "Series 2", data: [20, 30, 40, 80, 20, 80] },
                { name: "Series 3", data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  "1983, orders, $4220",
                  "12 Invoices have been paid",
                  "Order #37745 from September",
                  "New order placed #XF-2356",
                  "New order placed #XF-2346",
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: "FaceBook",
                  value: 323234,
                  icon: <Iconify icon={"eva:facebook-fill"} color="#1877F2" width={32} />,
                },
                {
                  name: "Google",
                  value: 341212,
                  icon: <Iconify icon={"eva:google-fill"} color="#DF3E30" width={32} />,
                },
                {
                  name: "Linkedin",
                  value: 411213,
                  icon: <Iconify icon={"eva:linkedin-fill"} color="#006097" width={32} />,
                },
                {
                  name: "Twitter",
                  value: 443232,
                  icon: <Iconify icon={"eva:twitter-fill"} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: "1", label: "Create FireStone Logo" },
                { id: "2", label: "Add SCSS and JS files if required" },
                { id: "3", label: "Stakeholder Meeting" },
                { id: "4", label: "Scoping & Estimations" },
                { id: "5", label: "Sprint Showcase" },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
