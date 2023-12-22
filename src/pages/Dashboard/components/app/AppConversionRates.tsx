import { Box, Card, CardHeader } from "@mui/material";
import { Dayjs } from "dayjs";
import ReactApexChart from "react-apexcharts";
import { DatePickerMain, useChart } from "~/components";
import { CardType } from "~/types";
import { fNumber } from "~/utils";

// ----------------------------------------------------------------------

type AppConversionRatesProps = {
  title: string;
  subheader: string;
  chartData: Array<any>;
  date: Dayjs;
  onChangeDate?: (date: Dayjs | null) => void;
} & CardType;

export default function AppConversionRates({
  title,
  subheader,
  chartData,
  date,
  onChangeDate,
  ...other
}: AppConversionRatesProps) {
  const chartLabels = chartData.map((i) => i.label);

  const chartSeries = chartData.map((i) => i.value);

  const chartOptions = useChart({
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName: number) => fNumber(seriesName),
        title: {
          formatter: () => "",
        },
      },
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: "28%", borderRadius: 2 },
    },
    xaxis: {
      categories: chartLabels,
    },
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={<DatePickerMain label="" value={date} onChange={onChangeDate} />}
      />

      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart
          type="bar"
          series={[{ data: chartSeries }]}
          options={chartOptions}
          height={364}
        />
      </Box>
    </Card>
  );
}
