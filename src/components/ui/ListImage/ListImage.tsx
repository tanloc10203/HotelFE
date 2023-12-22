import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Stack } from "@mui/material";
import { FC, useCallback } from "react";
import { LazyLoading } from "~/components";
import { BoxTypeProps } from "~/types";
import useStyles from "./styles";

type Props = {
  listImages: string[];
  onRemove?: (src: string, index: number) => void;
} & BoxTypeProps;

const ListImage: FC<Props> = ({ listImages, onRemove, ...props }) => {
  if (!listImages.length) return null;

  const sxStyles = useStyles();

  const handleRemoveImage = useCallback(
    (src: string, index: number) => {
      if (!onRemove) return;
      onRemove(src, index);
    },
    [onRemove]
  );

  return (
    <Box mt={5} {...props}>
      {listImages.map((src, index) => (
        <Stack sx={sxStyles.containerImages} key={index}>
          <LazyLoading key={index} sxBox={sxStyles.image} src={src} />
          {onRemove ? (
            <IconButton
              onClick={() => handleRemoveImage(src, index)}
              sx={sxStyles.iconClose}
              size="small"
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          ) : null}
        </Stack>
      ))}
    </Box>
  );
};

export default ListImage;
