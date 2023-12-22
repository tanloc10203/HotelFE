import { Card, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { Iconify } from "~/components/ui/iconify";
import { CardType } from "~/types";
import { fShortenNumber } from "~/utils";

// ----------------------------------------------------------------------

const StyledIcon = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: "center",
  marginBottom: theme.spacing(3),
}));

// ----------------------------------------------------------------------

type AppWidgetSummaryProps = {
  color?: string;
  icon: string;
  title: string;
  total: number;
  totalText?: string;
  sx?: object;
} & CardType;

export default function AppWidgetSummary({
  title,
  total,
  icon,
  color = "primary",
  sx,
  totalText,
  ...other
}: AppWidgetSummaryProps) {
  return (
    <Card
      sx={{
        py: 5,
        boxShadow: 0,
        textAlign: "center",
        color: (theme: any) => theme.palette[color].dark,
        bgcolor: (theme: any) => theme.palette[color].light,
        ...sx,
      }}
      {...other}
    >
      <StyledIcon
        sx={{
          color: (theme: any) => theme.palette[color].dark,
          backgroundImage: (theme: any) =>
            `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(
              theme.palette[color].dark,
              0.9
            )} 100%)`,
        }}
      >
        <Iconify icon={icon} width={24} height={24} />
      </StyledIcon>

      <Typography variant="h3">{totalText ? totalText : fShortenNumber(total)}</Typography>

      <Typography variant="subtitle2">{title}</Typography>
    </Card>
  );
}
