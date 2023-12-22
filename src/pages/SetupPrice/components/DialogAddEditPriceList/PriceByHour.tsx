import { Fade, List, Stack } from "@mui/material";
import { FC, ReactNode } from "react";
import { TransitionGroup } from "react-transition-group";
import { IPriceByHour } from "~/types";

type PriceByHourProps = {
  data: IPriceByHour[];
  onAdd?: () => void;
  children: ReactNode;
};

const PriceByHour: FC<PriceByHourProps> = ({ children }) => {
  return (
    <Stack flexDirection={"column"}>
      <Fade in={true}>
        <Stack>
          <List sx={{ p: 0 }}>
            <TransitionGroup>{children}</TransitionGroup>
          </List>
        </Stack>
      </Fade>
    </Stack>
  );
};

export default PriceByHour;
