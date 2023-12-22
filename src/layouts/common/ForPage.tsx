import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Breakpoint, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { isArray } from "lodash";
import * as React from "react";
import { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  CardCustom,
  CardCustomProp,
  ChipOverride,
  HeadSeo,
  HeadSeoProps,
  TabUI,
  TabUIProps,
  TableCommon,
  TableCommonProps,
} from "~/components";
import { BoxTypeProps, ContainerType, GridType, StackType, TypographyType } from "~/types";

type ForPageProps = {
  children: ReactNode | JSX.Element;
};

type GridProps = {
  children: ReactNode | JSX.Element;
} & GridType;

type ContainerProps = {
  children: ReactNode | JSX.Element;
} & ContainerType;

type StackProps = {} & StackType;

type TypographyProps = {
  children: ReactNode | JSX.Element;
} & TypographyType;

type BreadcrumbsProps = {
  data: { label: string; to?: string }[];
} & BoxTypeProps;

type DialogProps = {
  open: boolean;
  maxWidth?: Breakpoint;
  onClose: () => void;
  onAgree: () => void;
  title: string;
  textContent: string;
};

type CardDashedProps = {
  label: string;
  data: Record<string, any>[] | string;
  keyData: keyof Record<string, any>;
  backgroundChip?: string;
  colorChip?: string;
  isNoneChip?: boolean;
};

export type ResultFilterOptions = {
  label: string;
  data: string | any[];
};

type ResultFilterProps = {
  visible: boolean;
  numberResult: number;
  filters: ResultFilterOptions[];
  onReset?: () => void;
};

const ForPage = ({ children }: ForPageProps) => {
  return <>{children}</>;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

ForPage.HeadSeo = (props: HeadSeoProps) => <HeadSeo {...props} />;

ForPage.Container = ({ children, ...props }: ContainerProps) => (
  <Container {...props}>{children}</Container>
);

ForPage.StackCardDashed = ({ ...props }: StackProps) => {
  return (
    <ForPage.Stack
      flexGrow={1}
      mt={2}
      flexWrap={"wrap"}
      alignItems={"center"}
      flexDirection={"row"}
      gap={1}
      {...props}
    />
  );
};

ForPage.Typography = ({ children, ...props }: TypographyProps) => (
  <Typography {...props}>{children}</Typography>
);

ForPage.Title = ({ title, mb = 5 }: { title: string; mb?: number }) => (
  <ForPage.Typography variant="h4" sx={{ mb }}>
    {title}
  </ForPage.Typography>
);

ForPage.Tab = (props: TabUIProps) => <TabUI {...props} />;

ForPage.Card = (props: CardCustomProp) => <CardCustom {...props} />;

ForPage.Table = (props: TableCommonProps) => <TableCommon {...props} />;

ForPage.Grid = ({ children, ...props }: GridProps) => <Grid {...props}>{children}</Grid>;

ForPage.Stack = ({ ...props }: StackProps) => <Stack {...props} />;

ForPage.Breadcrumbs = ({ data, ...props }: BreadcrumbsProps) => {
  const dataLength = React.useMemo(() => data.length, [data]);

  return (
    <Box role="presentation" {...props}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" component={RouterLink} color="inherit" to="/">
          Bảng điều khiển
        </Link>

        {dataLength === 1 ? <Typography color="text.primary">{data[0].label}</Typography> : null}

        {dataLength > 1
          ? data.map((item, index) => {
              if (index === dataLength - 1) {
                return (
                  <Typography key={index} color="text.primary">
                    {item.label}
                  </Typography>
                );
              }

              return (
                <Link
                  underline="hover"
                  key={index}
                  component={RouterLink}
                  color="inherit"
                  to={item.to!}
                >
                  {item.label}
                </Link>
              );
            })
          : null}
      </Breadcrumbs>
    </Box>
  );
};

ForPage.StackCategory = ({ children, sx, ...props }: StackProps) => (
  <ForPage.Stack
    sx={{ mb: 2, ...sx }}
    direction={{ lg: "row", md: "column", xs: "column" }}
    alignItems={{ lg: "center" }}
    spacing={2}
    {...props}
  >
    {children}
  </ForPage.Stack>
);

ForPage.CardDashed = ({
  data,
  label,
  keyData,
  backgroundChip,
  colorChip,
  isNoneChip,
}: CardDashedProps) => {
  const handleClick = () => {
    console.info("You clicked the Chip.");
  };

  const handleDelete = () => {
    console.info("You clicked the delete icon.");
  };

  return (
    <Paper
      sx={{
        border: "1px dashed rgba(145, 158, 171, 0.16)",
        padding: 1,
        transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        display: "flex",
        flexDirection: "row",
        gap: 1,
        alignItems: "center",
      }}
    >
      <Box minWidth={80}>
        <Typography component={"span"} fontSize={14} fontWeight={600} lineHeight={1.57143}>
          {label}:
        </Typography>
      </Box>

      <Stack flexGrow={1} flexWrap={"wrap"} alignItems={"center"} flexDirection={"row"} gap={1}>
        {isArray(data) ? (
          data.map((item, index) => {
            if (!item?.[keyData]) return null;

            if (isNoneChip) {
              return (
                <Typography
                  key={index}
                  fontSize={14}
                  fontWeight={600}
                  lineHeight={1.57143}
                  sx={{ color: colorChip }}
                  color="red"
                >
                  {item[keyData]}
                </Typography>
              );
            }

            return (
              <ChipOverride
                background={backgroundChip}
                colorOverride={colorChip}
                key={index}
                label={item?.[keyData]}
                variant="filled"
                onClick={handleClick}
                onDelete={handleDelete}
              />
            );
          })
        ) : isNoneChip ? (
          <Typography
            color="red"
            fontSize={14}
            fontWeight={600}
            lineHeight={1.57143}
            sx={{ color: colorChip }}
          >
            {data}
          </Typography>
        ) : (
          <ChipOverride
            background={backgroundChip}
            colorOverride={colorChip}
            label={data}
            variant="filled"
            onClick={handleClick}
            onDelete={handleDelete}
          />
        )}
      </Stack>
    </Paper>
  );
};

ForPage.ResultFilter = ({ filters, numberResult, visible, onReset }: ResultFilterProps) => {
  if (!visible) return null;

  return (
    <Stack flexDirection={"column"} gap={2} mb={3}>
      <Box>
        <Typography component="span" fontSize={14} fontWeight={700}>
          {`${numberResult ?? ""} `}
          <Typography fontWeight={400} fontSize={14} component="span" color="text.secondary">
            kết quả được tìm thấy
          </Typography>
        </Typography>
      </Box>
      <Stack flexGrow={1} flexWrap={"wrap"} alignItems={"center"} flexDirection={"row"} gap={1}>
        {filters?.map((filter, index) => {
          return (
            <ForPage.CardDashed
              keyData="label"
              key={index}
              label={filter.label}
              data={filter.data}
            />
          );
        })}

        <Button startIcon={<DeleteIcon />} color="error" onClick={onReset}>
          Xóa
        </Button>
      </Stack>
    </Stack>
  );
};

ForPage.Dialog = ({ onAgree, onClose, open, textContent, maxWidth, title }: DialogProps) => {
  return (
    <Dialog
      PaperProps={{ sx: { borderRadius: "16px" } }}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">{textContent}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pb: 3, pr: 3 }}>
        <Button variant="contained" color="error" onClick={onClose}>
          Hủy bỏ
        </Button>
        <Button variant="contained" onClick={onAgree}>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForPage;
