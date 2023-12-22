import { Box, Button, FormControl, FormHelperText, Stack, Typography } from "@mui/material";
import { ChangeEvent, FC, ReactNode, memo, useCallback, useEffect, useRef, useState } from "react";
import { IconImage, ListImage } from "~/components";
import { StackType } from "~/types";
import { getBlobImg } from "~/utils";
import useStyles from "./styles";

type UploadMultipleImageProps = {
  label: string;
  values?: any;
  defaultValues?: string[];
  onChange?: (files: FileList) => void;
  onRemove?: (file: any) => void;
  error?: boolean;
  helperText?: ReactNode;
  multiple?: boolean;
} & Omit<StackType, "onChange">;

const UploadMultipleImage: FC<UploadMultipleImageProps> = ({
  label,
  error,
  helperText,
  defaultValues,
  values,
  multiple = true,
  onChange,
  onRemove,
  ...props
}) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const sxStyles = useStyles(error);
  const [imagesBlob, setImagesBlob] = useState<string[]>([]);

  useEffect(() => {
    if (!defaultValues || !defaultValues.length) return;
    setImagesBlob(defaultValues);
  }, [defaultValues]);

  const handleClickUpload = useCallback(() => {
    if (!imageRef.current) return;
    imageRef.current.click();
  }, [imageRef.current]);

  const handleChangeImages = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const {
        target: { files },
      } = event;

      if (!files || !files?.length) return;

      const blobs = await Promise.all(
        Array.from(files).map(
          (file): Promise<string> =>
            new Promise(async (resolve, reject) => {
              try {
                const { url } = await getBlobImg(file);
                resolve(url);
              } catch (error) {
                reject(error);
              }
            })
        )
      );

      if (multiple) {
        setImagesBlob((prev) => [...prev, ...blobs]);
      } else {
        setImagesBlob(blobs);
      }

      if (onChange) onChange(files);
    },
    [onChange, multiple]
  );

  const handleRemoveImage = useCallback(
    (image: string, index: number) => {
      if (!onRemove) return;

      setImagesBlob((prev) => prev.filter((p) => p !== image));

      if (Array.isArray(values)) {
        onRemove(values[index]);
      } else {
        onRemove("");
      }
    },
    [onRemove]
  );

  const handleRemoveAll = useCallback(() => {
    if (!onRemove) return;
    setImagesBlob([]);
    onRemove(values);
  }, [onRemove, values]);

  return (
    <FormControl margin={"normal"} fullWidth error={error}>
      <Stack gap={2}>
        {label ? <Typography sx={sxStyles.label}>{label}</Typography> : null}
        <Stack sx={{ width: "100%" }} {...props}>
          <Box onClick={handleClickUpload} sx={sxStyles.boxInputContainer}>
            <input
              accept="image/*"
              multiple={multiple}
              type="file"
              tabIndex={-1}
              style={{ display: "none" }}
              ref={imageRef}
              onChange={handleChangeImages}
            />

            <Stack justifyContent={"center"} alignItems={"center"} gap={2}>
              <IconImage sx={sxStyles.iconImage} />
              <Stack>
                <Typography variant="h6" lineHeight={1.55556} fontSize={"1.125rem"}>
                  Chọn file ảnh
                </Typography>
              </Stack>
            </Stack>
          </Box>

          {/* List Image */}
          <Stack flex={1}>
            <ListImage mt={props.mt} listImages={imagesBlob} onRemove={handleRemoveImage} />

            {/* Action Remove */}
            {imagesBlob.length ? (
              <Stack mt={4} justifyContent={"flex-end"} alignItems={"flex-end"} flex={1}>
                <Box>
                  <Button variant="outlined" color="error" onClick={handleRemoveAll}>
                    Xóa tất cả
                  </Button>
                </Box>
              </Stack>
            ) : null}
          </Stack>
        </Stack>
      </Stack>

      {error ? <FormHelperText sx={{ mt: 2 }}>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};

export default memo(
  UploadMultipleImage,
  (prevProps, nextProps) => prevProps.defaultValues?.length === nextProps.defaultValues?.length
);
