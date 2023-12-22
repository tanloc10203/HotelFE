import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { FC } from "react";
import { Link } from "react-router-dom";
import { Actions, ButtonActions } from "~/components";
import { DashboardPaths } from "~/types";

type ActionDiscountProps = {};

const ActionDiscount: FC<ActionDiscountProps> = () => {
  return (
    <Actions>
      <ButtonActions
        LinkComponent={Link}
        to={DashboardPaths.AddPromotion}
        startIcon={<PersonAddAlt1Icon />}
      >
        Thêm khuyến mãi
      </ButtonActions>
    </Actions>
  );
};

export default ActionDiscount;
