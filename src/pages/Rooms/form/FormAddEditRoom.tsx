import { Add } from "@mui/icons-material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  SelectInput,
  SelectInputAutoComplete,
  TextFieldBootstrap,
  UploadMultipleImage,
} from "~/components";
import { appActions } from "~/features/app";
import { bedsOptions } from "~/features/equipment";
import { floorActions, useFloorOptions } from "~/features/floor";
import { roomActions, useRoom } from "~/features/room";
import { useRoomTypeOptions } from "~/features/roomTypes";
import { ForPage } from "~/layouts";
import { useAppDispatch } from "~/stores";
import { BedsOptions, IFloor, IRoomNumber, RoomPayload } from "~/types";
import { convertRoomNumber } from "~/utils";
import RoomNumberItem from "../components/RoomNumberItem";
import { numberBedOptions, optionYesOrNo, smokingOptions } from "../helpers/optionRoom";
import useGetPricesByRoomTypeId from "../helpers/useGetPricesByRoomTypeId";
import useCalcRoomNumber from "../helpers/useShowRoomNumber";
import { roomSchema } from "../schema/roomSchema";
import FormDialogAddFloor from "./FormDialogAddFloor";
import FormDialogRoomNumber from "./FormDialogRoomNumber";
import SwitchShowDiscount from "./SwitchShowDiscount";

const { Grid, Card } = ForPage;

// One time slot every 1 minutes.
// const timeSlots = Array.from(new Array(24)).map((_, index) => ({
//   label: `${index < 10 ? `0${index}` : index}:00`,
//   value: index,
// }));

interface FormAddEditRoomProps {
  initialValues: RoomPayload;
  defaultValuesImages?: string[];
  onSubmit?: (...args: any[]) => void;
  textButton: string;
}

const FormAddEditRoom: FC<FormAddEditRoomProps> = ({
  onSubmit,
  defaultValuesImages,
  initialValues,
  textButton,
}) => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: roomSchema(!Boolean(initialValues.id)),
    onSubmit: (values, { resetForm }) => {
      if (!onSubmit) return;
      onSubmit?.({ ...values }, resetForm);
    },
  });

  const { isLoading, openDialogAddFloor } = useRoom();
  const { getByRoomTypeId } = useGetPricesByRoomTypeId();

  const { errors, touched, values, setFieldValue, handleSubmit, getFieldProps, handleChange } =
    formik;

  const [bedsSelect, setBedsSelect] = useState<BedsOptions[]>([]);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<
    (IRoomNumber & { lastId: string }) | null
  >(null);

  const { floorsData, roomTypesData, updateRoomNumber } = useCalcRoomNumber({
    setFieldValue,
    roomNumbers: values.room_numbers,
  });

  useEffect(() => {
    if (!initialValues.id || !initialValues.beds || !initialValues.room_type_id) return;

    setBedsSelect(initialValues.beds);
    getByRoomTypeId(+initialValues.room_type_id);
  }, [initialValues]);

  const optionsFloor = useFloorOptions();
  const optionsRoomType = useRoomTypeOptions();

  const beds = bedsOptions();

  const handleChangeValue = useCallback(
    async (values: Record<string, any>[] | Record<string, any> | null) => {
      values = values as BedsOptions[];
      setBedsSelect(values as BedsOptions[]);
      await setFieldValue("beds", values.length ? values : null);
    },
    []
  );

  const handleChangeQuantityBed = useCallback(
    async (value: number, select: BedsOptions) => {
      const newBedsSelect = [...values.beds!];
      const index = newBedsSelect.findIndex((p) => p.value === select.value);

      if (index !== -1) {
        newBedsSelect[index] = {
          ...newBedsSelect[index],
          quantity: value,
        };
      }

      setBedsSelect(newBedsSelect);
      await setFieldValue("beds", newBedsSelect);
    },
    [values]
  );

  const handleChangeSwitch = useCallback(
    async (value: boolean) => await setFieldValue("is_public", value),
    []
  );

  const handleChangeImages = useCallback(
    async (files: FileList) => {
      await setFieldValue("photo_publish", files[0]);
    },
    [values]
  );

  const handleOnRemove = useCallback(async () => {
    if (!values.photo_publish) return;
    await setFieldValue("photo_publish", "");
  }, [values]);

  const openDialogRoomNumber = useMemo(() => Boolean(selectedRoomNumber), [selectedRoomNumber]);

  const onCloseDialogRoomNumber = useCallback(() => setSelectedRoomNumber(null), []);

  const handleOnClickRoomNumber = useCallback((roomNumber: IRoomNumber) => {
    setSelectedRoomNumber({ ...roomNumber, lastId: roomNumber.id });
  }, []);

  const onSubmitFormDialogRoomNumber = useCallback(
    async (values: IRoomNumber & { lastId: string }, resetForm: any, setErrors: any) => {
      const error = await updateRoomNumber(values);

      if (error) {
        setErrors({ id: error });
        return;
      }
      resetForm();
      onCloseDialogRoomNumber();
    },
    [updateRoomNumber]
  );

  const handleChangeForGenerateRoomNumber = useCallback(
    async (name: "floor_id" | "room_type_id" | "room_quantity", value: string) => {
      handleChange(name)(value);

      if (name === "room_type_id") {
        await getByRoomTypeId(+value);
      }

      let status: "two" | "no" = "no";

      let { room_type_id, room_quantity, floor_id, room_numbers } = values;

      if (name === "floor_id" && room_type_id && room_quantity) {
        floor_id = value;
        status = "two";
      }
      if (name === "room_type_id" && floor_id && room_quantity) {
        room_type_id = value;
        status = "two";
      }
      if (name === "room_quantity" && room_type_id && floor_id) {
        room_quantity = value;
        status = "two";
      }

      if (status === "no" || !floorsData.length || !roomTypesData.length) return;
      // TODO: calc room numbers

      const floor = floorsData.find((f) => f.id === +(+floor_id));
      const roomType = roomTypesData.find((r) => r.id === +room_type_id);

      if (!floor || !roomType) {
        if (room_numbers.length) {
          await setFieldValue("room_numbers", null);
        }
        return;
      }

      const floorCharacter = floor.character;
      const roomTypeCharacter = roomType.character;

      const roomNumbersNew: IRoomNumber[] = [];

      for (let index = 0; index < +room_quantity; index++) {
        const roomNumberId = `${roomTypeCharacter}${floorCharacter}${convertRoomNumber(index + 1)}`;
        roomNumbersNew.push({ id: roomNumberId, status: "available", note: "" });
      }

      await setFieldValue("room_numbers", roomNumbersNew);
    },
    [values, floorsData, roomTypesData]
  );

  const initialValuesAddFloor = useMemo(() => {
    return { desc: "", name: "", character: "" };
  }, []);

  const onCloseDialogAddFloor = useCallback(() => {
    dispatch(roomActions.setToggleDialogAddFloor(false));
  }, []);

  const onOpenDialogAddFloor = useCallback(() => {
    dispatch(roomActions.setToggleDialogAddFloor(true));
  }, []);

  const onSubmitFormDialogAddFloor = useCallback((values: IFloor, resetForm: () => void) => {
    dispatch(appActions.openOverplay("Đang thêm vị trí phòng."));
    dispatch(floorActions.addDataStart({ ...values, character: `${values.character}`, resetForm }));
  }, []);

  return (
    <>
      {selectedRoomNumber ? (
        <FormDialogRoomNumber
          open={openDialogRoomNumber}
          initialValues={selectedRoomNumber}
          onClose={onCloseDialogRoomNumber}
          onSubmit={onSubmitFormDialogRoomNumber}
        />
      ) : null}

      {openDialogAddFloor ? (
        <FormDialogAddFloor
          open={openDialogAddFloor}
          initialValues={initialValuesAddFloor}
          onClose={onCloseDialogAddFloor}
          onSubmit={onSubmitFormDialogAddFloor}
        />
      ) : null}

      <FormikProvider value={formik}>
        <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <Grid container spacing={2} justifyContent="flex-end" direction="row">
                <Grid item md={4} xs={12}>
                  <Typography variant="h6">Loại phòng, số lượng phòng</Typography>
                  <Typography variant="body2" color={"text.secondary"}>
                    Vui lòng chọn...
                  </Typography>
                </Grid>

                <Grid item md={8} xs={12}>
                  <Card
                    title=""
                    sx={{
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    <SelectInput
                      {...getFieldProps("floor_id")}
                      onChange={(event) =>
                        handleChangeForGenerateRoomNumber("floor_id", event.target.value as string)
                      }
                      options={optionsFloor}
                      label="Vị trí phòng"
                      placeholder="Chọn vị trí phòng"
                      error={touched.floor_id && Boolean(errors.floor_id)}
                      helperText={touched.floor_id && errors.floor_id}
                      endAdornment={
                        <IconButton onClick={onOpenDialogAddFloor} sx={{ mr: 2 }}>
                          <Add />
                        </IconButton>
                      }
                    />

                    <SelectInput
                      {...getFieldProps("room_type_id")}
                      onChange={(event) =>
                        handleChangeForGenerateRoomNumber(
                          "room_type_id",
                          event.target.value as string
                        )
                      }
                      options={optionsRoomType}
                      label="Loại phòng"
                      placeholder="Chọn loại phòng"
                      error={touched.room_type_id && Boolean(errors.room_type_id)}
                      helperText={touched.room_type_id && errors.room_type_id}
                    />

                    <TextField
                      fullWidth
                      label="Số lượng phòng / loại phòng này"
                      type="number"
                      placeholder="VD: 2"
                      {...getFieldProps("room_quantity")}
                      onChange={(event) =>
                        handleChangeForGenerateRoomNumber(
                          "room_quantity",
                          event.target.value as string
                        )
                      }
                      error={touched.room_quantity && Boolean(errors.room_quantity)}
                      helperText={
                        (touched.room_quantity && errors.room_quantity) ??
                        "Sau khi điền sẽ hiển thị danh sách số phòng."
                      }
                      margin="normal"
                    />

                    {values.room_numbers.length ? (
                      <Box>
                        <Alert
                          sx={{ mt: 1 }}
                          icon={<TipsAndUpdatesIcon fontSize="inherit" />}
                          severity="warning"
                        >
                          Danh sách số phòng
                          <br></br>
                          Số phòng được tạo từ kí tự vị trí phòng + kí tự loại phòng + số lượng
                          phòng.
                          <br></br>
                          Bạn cũng có thể chỉnh sửa số phòng.
                        </Alert>
                        <Stack sx={{ mt: 1 }} flexDirection={"row"} flexWrap={"wrap"}>
                          {values.room_numbers.map((i, index) => (
                            <RoomNumberItem
                              onClick={handleOnClickRoomNumber}
                              roomNumber={i}
                              key={index}
                            />
                          ))}
                        </Stack>
                      </Box>
                    ) : null}
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={12} xs={12}>
              <Grid container spacing={2} justifyContent="flex-end" direction="row">
                <Grid item md={4} xs={12}>
                  <Typography variant="h6">Giường ngủ, diện tích</Typography>
                  <Typography variant="body2" color={"text.secondary"}>
                    Vui lòng chọn...
                  </Typography>
                </Grid>

                <Grid item md={8} xs={12}>
                  <Card
                    title=""
                    sx={{
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    <FormControl fullWidth margin="normal">
                      <FormLabel>Loại giường ngủ có sẳn trong phòng?</FormLabel>

                      <SelectInputAutoComplete
                        label="Giường ngủ"
                        placeholder="..."
                        value={bedsSelect}
                        options={beds}
                        keyOption="label"
                        error={touched.beds && Boolean(errors.beds)}
                        helperText={touched.beds && errors.beds}
                        onChange={handleChangeValue}
                      />

                      {bedsSelect?.length
                        ? bedsSelect.map((select, index) => (
                            <Grid container spacing={1} key={index}>
                              <Grid item xl={6} md={6} sm={12} xs={12}>
                                <TextField
                                  fullWidth
                                  margin="normal"
                                  disabled
                                  label="Đã chọn"
                                  placeholder="Chọn giường..."
                                  value={select.label}
                                />
                              </Grid>

                              <Grid item xl={6} md={6} sm={12} xs={12}>
                                <SelectInput
                                  value={select.quantity}
                                  options={numberBedOptions}
                                  label="Số lượng giường"
                                  placeholder="..."
                                  onChange={({ target: { value } }) =>
                                    handleChangeQuantityBed(value as number, select)
                                  }
                                />
                              </Grid>
                            </Grid>
                          ))
                        : null}
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                      <FormLabel>Bao nhiêu khách có thể ở trong phòng này?</FormLabel>

                      <Grid container spacing={1}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Người lớn"
                            {...getFieldProps("adults")}
                            type="number"
                            error={touched.adults && Boolean(errors.adults)}
                            helperText={touched.adults && errors.adults}
                            margin="normal"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Trẻ em"
                            type="number"
                            {...getFieldProps("children")}
                            error={touched.children && Boolean(errors.children)}
                            helperText={touched.children && errors.children}
                            margin="normal"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>
                    </FormControl>

                    <TextFieldBootstrap
                      label="Diện tích phòng (mét vuông)"
                      placeholder="1"
                      type="number"
                      fullWidth
                      {...getFieldProps("area")}
                      error={touched.area && Boolean(errors.area)}
                      helperText={touched.area && errors.area}
                      marginFormControl="normal"
                    />
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* <Grid item md={12} xs={12}>
              <Grid container spacing={2} justifyContent="flex-end" direction="row">
                <Grid item md={4} xs={12}>
                  <Typography variant="h6">Giá tiền</Typography>
                  <Typography variant="body2" color={"text.secondary"}>
                    Các giá tiền cơ bản...
                  </Typography>
                </Grid>

                <Grid item md={8} xs={12}>
                  <Card
                    title=""
                    sx={{
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Giá tiền theo ngày"
                      disabled
                      margin="normal"
                      value={prices?.price_day ?? ""}
                      InputProps={{
                        inputComponent: NumericFormatCustom as any,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Giá tiền theo giờ"
                      disabled
                      margin="normal"
                      value={prices?.price_hour ?? ""}
                      InputProps={{
                        inputComponent: NumericFormatCustom as any,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Giá tiền đặt phòng online theo ngày"
                      disabled
                      margin="normal"
                      value={prices?.price_day_online ?? ""}
                      InputProps={{
                        inputComponent: NumericFormatCustom as any,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Giá tiền đặt phòng online theo giờ"
                      disabled
                      value={prices?.price_hour_online ?? ""}
                      margin="normal"
                      InputProps={{
                        inputComponent: NumericFormatCustom as any,
                      }}
                    />
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={12} xs={12}>
              <Grid container spacing={2} justifyContent="flex-end" direction="row">
                <Grid item md={4} xs={12}>
                  <Typography variant="h6">Check-in, Check-out</Typography>
                  <Typography variant="body2" color={"text.secondary"}>
                    Sắp xếp thời gian đến và thời gian đi.
                  </Typography>
                </Grid>

                <Grid item md={8} xs={12}>
                  <Card
                    title=""
                    sx={{
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <FormLabel>Check-in</FormLabel>

                          <SelectInput
                            {...getFieldProps("check_in_from")}
                            options={timeSlots}
                            label="Từ"
                            placeholder="..."
                            error={touched.check_in_from && Boolean(errors.check_in_from)}
                            helperText={touched.check_in_from && errors.check_in_from}
                          />

                          <SelectInput
                            {...getFieldProps("check_in_to")}
                            options={timeSlots}
                            label="Đến"
                            placeholder="..."
                            error={touched.check_in_to && Boolean(errors.check_in_to)}
                            helperText={touched.check_in_to && errors.check_in_to}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <FormLabel>Check-out</FormLabel>

                          <SelectInput
                            {...getFieldProps("check_out_from")}
                            options={timeSlots}
                            label="Từ (Không bắt buộc)"
                            placeholder="..."
                            error={touched.check_out_from && Boolean(errors.check_out_from)}
                            helperText={touched.check_out_from && errors.check_out_from}
                          />

                          <SelectInput
                            {...getFieldProps("check_out_to")}
                            options={timeSlots}
                            label="Đến"
                            placeholder="..."
                            error={touched.check_out_to && Boolean(errors.check_out_to)}
                            helperText={touched.check_out_to && errors.check_out_to}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </Grid> */}

            <Grid item md={12} xs={12}>
              <Grid container spacing={2} justifyContent="flex-end" direction="row">
                <Grid item md={4} xs={12}>
                  <Typography variant="h6">Chính sách và dịch vụ</Typography>
                  <Typography variant="body2" color={"text.secondary"}>
                    Một vài chính sách áp dụng cho đặt phòng
                  </Typography>
                </Grid>

                <Grid item md={8} xs={12}>
                  <Card
                    title=""
                    sx={{
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    <SelectInput
                      {...getFieldProps("is_smoking")}
                      options={smokingOptions}
                      label="Chính sách hút thuốc"
                      placeholder="..."
                      error={touched.is_smoking && Boolean(errors.is_smoking)}
                      helperText={touched.is_smoking && errors.is_smoking}
                    />

                    <FormControl fullWidth margin="normal">
                      <Alert icon={<NotificationsIcon fontSize="inherit" />} severity="info">
                        <small>
                          Một số khách thích đi du lịch với những người bạn lông xù của họ. Hãy cho
                          biết liệu bạn có cho phép vật nuôi hay không và có áp dụng bất kỳ khoản
                          phí nào không
                        </small>
                      </Alert>
                      <SelectInput
                        {...getFieldProps("is_pets")}
                        options={optionYesOrNo}
                        label="Bạn có cho phép thú cưng?"
                        placeholder="..."
                        error={touched.is_pets && Boolean(errors.is_pets)}
                        helperText={touched.is_pets && errors.is_pets}
                      />
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                      <FormLabel>Có bải đậu xe cho khách không?</FormLabel>
                      <SelectInput
                        {...getFieldProps("is_parking")}
                        options={optionYesOrNo}
                        label="Chỗ đậu xe"
                        placeholder="..."
                        error={touched.is_parking && Boolean(errors.is_parking)}
                        helperText={touched.is_parking && errors.is_parking}
                      />
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                      <FormLabel>Có bửa sáng cho khách không?</FormLabel>
                      <SelectInput
                        {...getFieldProps("is_breakfast")}
                        options={optionYesOrNo}
                        label="Bửa sáng"
                        placeholder="..."
                        error={touched.is_breakfast && Boolean(errors.is_breakfast)}
                        helperText={touched.is_breakfast && errors.is_breakfast}
                      />
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                      <FormLabel>Có giường phụ cho khách không?</FormLabel>
                      <SelectInput
                        {...getFieldProps("is_extra_beds")}
                        options={optionYesOrNo}
                        label="Giường phụ"
                        placeholder="..."
                        error={touched.is_extra_beds && Boolean(errors.is_extra_beds)}
                        helperText={touched.is_extra_beds && errors.is_extra_beds}
                      />
                    </FormControl>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={12} xs={12}>
              <Grid container spacing={2} justifyContent="flex-end" direction="row">
                <Grid item md={4} xs={12}>
                  <Typography variant="h6">Ảnh</Typography>
                  <Typography variant="body2" color={"text.secondary"}>
                    Ảnh hiển thị cho phòng...
                  </Typography>
                </Grid>

                <Grid item md={8} xs={12}>
                  <Card
                    title=""
                    sx={{
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    <UploadMultipleImage
                      multiple={false}
                      label={"Ảnh hiển thị"}
                      defaultValues={defaultValuesImages}
                      values={values.photo_publish}
                      onChange={handleChangeImages}
                      onRemove={handleOnRemove}
                      error={touched.photo_publish && Boolean(errors.photo_publish)}
                      helperText={touched.photo_publish && errors.photo_publish}
                    />
                  </Card>
                </Grid>

                <Grid item md={8} xs={12} alignItems={"flex-end"}>
                  <Stack
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    flexDirection={"row"}
                  >
                    <SwitchShowDiscount
                      {...getFieldProps("is_public")}
                      onChecked={handleChangeSwitch}
                      label="Trạng thái hiển thị"
                    />

                    <Box>
                      <LoadingButton
                        type="submit"
                        size="large"
                        variant="contained"
                        sx={{ mt: 2 }}
                        disabled={isLoading === "pending"}
                        loading={isLoading === "pending"}
                      >
                        <span>{textButton}</span>
                      </LoadingButton>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </>
  );
};

export default FormAddEditRoom;
