import { Box, Card, CardHeader, CardTypeMap, Stack } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { DatePicker } from "antd";
import locale from "antd/es/date-picker/locale/vi_VN";
import "dayjs/locale/vi";
import { ComponentProps } from "react";
import ReactApexChart from "react-apexcharts";
import { useChart } from "~/components";
import { RangeValue } from "~/types";
import { fNumber } from "~/utils";

const { RangePicker } = DatePicker;

type AppWebsiteVisitsProps = {
  title: string;
  subheader: string;
  chartData: Array<any>;
  chartLabels: Array<string>;
  dateRanges: RangeValue;
  serviceType: "service" | "product";
  onChangeDate?: (values: RangeValue) => void;
  onChangeServiceType?: (type: "service" | "product") => void;
} & ComponentProps<OverridableComponent<CardTypeMap<{}, "div">>>;

const dateFormat = "DD/MM/YYYY";

export default function AppWebsiteVisits({
  title,
  subheader,
  chartLabels,
  chartData,
  dateRanges,
  serviceType,
  onChangeDate,
  onChangeServiceType,
  ...other
}: AppWebsiteVisitsProps) {
  // console.log(chartData, chartLabels);

  const chartOptions = useChart({
    plotOptions: { bar: { columnWidth: "16%" } },
    fill: { type: chartData.map((i) => i.fill) },
    labels: chartLabels,
    xaxis: { type: "date" },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y: number) => {
          if (typeof y !== "undefined") {
            return `${fNumber(y)} VNĐ`;
          }
          return y;
        },
      },
    },
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Stack flexDirection={"row"}>
            <FormControl>
              <RadioGroup
                row
                value={serviceType}
                onChange={({ target: { value } }) =>
                  onChangeServiceType?.(value as "product" | "service")
                }
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel value="service" control={<Radio />} label="Dịch vụ" />
                <FormControlLabel value="product" control={<Radio />} label="Hàng hóa" />
              </RadioGroup>
            </FormControl>
            <Box>
              <RangePicker
                value={dateRanges}
                onCalendarChange={onChangeDate}
                onChange={onChangeDate}
                changeOnBlur
                format={dateFormat}
                locale={locale}
              />
            </Box>
          </Stack>
        }
      />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="bar" series={chartData} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
