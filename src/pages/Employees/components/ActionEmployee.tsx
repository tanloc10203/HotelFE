import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import * as React from "react";
import { Link } from "react-router-dom";
import { Actions, ButtonActions } from "~/components";
import { DashboardPaths } from "~/types";

const ActionEmployee: React.FC = () => {
  return (
    <Actions>
      <ButtonActions
        LinkComponent={Link}
        to={DashboardPaths.AddEmployee}
        startIcon={<PersonAddAlt1Icon />}
      >
        Thêm nhân viên
      </ButtonActions>
      <ButtonActions
        LinkComponent={Link}
        to={DashboardPaths.AddEmployee}
        color="inherit"
        startIcon={<PersonAddAlt1Icon />}
      >
        Thùng rác
      </ButtonActions>
    </Actions>
  );
};

export default ActionEmployee;
