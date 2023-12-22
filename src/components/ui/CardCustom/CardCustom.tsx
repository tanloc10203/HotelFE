import { Card, CardContent, CardHeader } from "@mui/material";
import { ReactNode } from "react";
import { CardType, SXProps } from "~/types";

export type CardCustomProp = {
  subHeader?: string;
  title: string;
  children: ReactNode | JSX.Element;
  action?: ReactNode;
  sxCardContent?: SXProps;
} & CardType;

const CardCustom = ({
  subHeader,
  title,
  children,
  action,
  sxCardContent,
  ...others
}: CardCustomProp) => {
  return (
    <Card {...others}>
      {title ? <CardHeader title={title} subheader={subHeader} action={action} /> : null}
      <CardContent sx={sxCardContent}>{children}</CardContent>
    </Card>
  );
};

export default CardCustom;
