import { Box, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { useRoom } from "~/features/room";
import ListGridItem from "./ListGridItem";

type ListGridProps = {};

const ListGrid: FC<ListGridProps> = () => {
  const { dataFrontDesk } = useRoom();

  return (
    <Stack gap={2}>
      {dataFrontDesk.length ? (
        dataFrontDesk.map((t) => <ListGridItem key={t.id} {...t} />)
      ) : (
        <Box>
          <Typography>Chưa có dữ liệu</Typography>
        </Box>
      )}
    </Stack>
  );
};

export default ListGrid;
