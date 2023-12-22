import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { Stack } from "@mui/material";
import { FC } from "react";
import { Link } from "react-router-dom";
import { ButtonActions } from "~/components";
import { DashboardPaths } from "~/types";

type ActionRoomTypeProps = {
  isRoom?: boolean;
  toTrash?: string;
  labelTrash?: string;
};

const ActionRoomType: FC<ActionRoomTypeProps> = ({ isRoom = false, toTrash, labelTrash }) => {
  if (isRoom) {
    return (
      <Stack>
        <ButtonActions
          LinkComponent={Link}
          to={DashboardPaths.AddRoom}
          startIcon={<PersonAddAlt1Icon />}
          variant="contained"
        >
          Thêm phòng
        </ButtonActions>
      </Stack>
    );
  }

  return (
    <Stack flexDirection={"row"} gap={2}>
      <ButtonActions LinkComponent={Link} to={DashboardPaths.AddRoomTypes} variant="contained">
        Thêm loại phòng
      </ButtonActions>

      <ButtonActions LinkComponent={Link} to={toTrash} color="error" variant="contained">
        {labelTrash}
      </ButtonActions>
    </Stack>
  );
};

export default ActionRoomType;
