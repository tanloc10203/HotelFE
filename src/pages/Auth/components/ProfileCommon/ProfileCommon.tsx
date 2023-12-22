import UploadIcon from "@mui/icons-material/Upload";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { FC, SyntheticEvent, useMemo, useState, useRef, useCallback, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import account from "~/_mock/account";
import { useApp } from "~/contexts/AppContext";
import { useGetRole, useGetUser } from "~/features/auth";
import useResponsive from "~/hooks/useResponsive";
import { ForPage } from "~/layouts";
import {
  AuthAPI,
  changePasswordOwnerEndPoint as catchKey,
  changePasswordEmployeeEndPoint as catchKeyEmployee,
  profileOwnerEndPoint,
  profileEmployeeEndPoint,
  uploadAvatarEmployeeEndPoint as uploadEmployee,
  uploadAvatarOwnerEndPoint as uploadOwner,
  changeProfileEmployeeEndPoint as profileEmployee,
  changeProfileOwnerEndPoint as profileOwner,
} from "~/services/apis/auth";
import { ChangePasswordPayload, UserState } from "~/types";
import { getBlobImg, getInfoData, removeNullObj, sleep } from "~/utils";
import { ChangePasswordForm, GeneraForm, ProfileForm } from "../../form";
import CloseIcon from "@mui/icons-material/Close";

const { Card } = ForPage;

type ProfileCommonProps = {};

const options = [
  { value: 0, label: "Tổng quan" },
  { value: 1, label: "Chỉnh sửa thông tin cá nhân" },
  { value: 2, label: "Thay đổi mật khẩu" },
  { value: 3, label: "Đổi ảnh đại diện" },
];

const ProfileCommon: FC<ProfileCommonProps> = () => {
  const role = useGetRole()!;
  const user = useGetUser(role)!;
  const isDesktop = useResponsive("up", "sm");
  const { onCloseOverlay, onOpenOverlay } = useApp();
  const { trigger } = useSWRMutation(
    role === "EMPLOYEE" ? catchKeyEmployee : catchKey,
    AuthAPI.changePasswordOwner,
    {
      revalidate: false,
    }
  );
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(0);
  const [imageBlob, setImageBlob] = useState("");

  const initialValues = useMemo(() => {
    let userOld = { ...user };

    Object.keys(userOld).forEach((key) => {
      // @ts-ignore
      if (!userOld[key]) userOld[key] = "";
    });

    return userOld;
  }, [user]);

  const initialValuesChangePassword: ChangePasswordPayload = {
    newPassword: "",
    password: "",
    confirmPassword: "",
  };

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeValueSelect = (event: SelectChangeEvent) => {
    setValue(+event.target.value);
  };

  const handleSubmitChangeProfile = useCallback(
    async (values: UserState) => {
      const url = role === "EMPLOYEE" ? profileEmployee : profileOwner;

      const newValues = removeNullObj(
        getInfoData(values, [
          "first_name",
          "last_name",
          "gender",
          "desc",
          "address",
          "birth_date",
          "id",
          "phone_number",
        ])
      );

      try {
        onOpenOverlay("Đang đăng nhập...");
        await sleep(500);
        const response = await AuthAPI.changeProfileOwner(url, {
          ...newValues,
          birth_date: dayjs(newValues.birth_date).format("YYYY-MM-DD"),
        } as any);

        mutate(role === "EMPLOYEE" ? profileEmployeeEndPoint : profileOwnerEndPoint, response, {
          rollbackOnError: true,
          populateCache: true,
          revalidate: true,
        });

        toast.success("Thay đổi mật khẩu thành công");

        onCloseOverlay();
      } catch (error: any) {
        onCloseOverlay();

        let msg = "";

        if (error instanceof AxiosError) {
          msg = error?.response?.data?.message ?? error.message;
        } else {
          msg = error.message;
        }

        toast.error(msg);
      }
    },
    [role]
  );

  const handleSubmitChangePassword = async (
    values: ChangePasswordPayload,
    resetForm: () => void
  ) => {
    try {
      onOpenOverlay("Đang đăng nhập...");
      await sleep(500);
      await trigger(values);

      toast.success("Thay đổi mật khẩu thành công");
      resetForm();

      onCloseOverlay();
    } catch (error: any) {
      onCloseOverlay();

      let msg = "";

      if (error instanceof AxiosError) {
        msg = error?.response?.data?.message ?? error.message;
      } else {
        msg = error.message;
      }

      toast.error(msg);
    }
  };

  const handleSubmitGeneraForm = () => {};

  const handleClickUpload = useCallback(() => {
    if (!inputRef.current) return;
    inputRef.current.click();
  }, [inputRef.current]);

  const filterOptions = useMemo(() => {
    return options.filter((o) => o.value === value)[0];
  }, [options, value]);

  const handleChangeAvatar = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (!inputRef.current || !inputRef.current.files) return;
      const imgBlob = await getBlobImg(event.target.files![0]);
      setImageBlob(imgBlob.url);
    },
    [inputRef.current]
  );

  const handleCancel = useCallback(() => {
    if (!inputRef.current) return;
    setImageBlob("");
    inputRef.current.files = null;
  }, [inputRef.current]);

  const handleUploadAvatar = useCallback(async () => {
    if (!inputRef.current || !inputRef.current.files || !imageBlob) return;
    const url = role === "EMPLOYEE" ? uploadEmployee : uploadOwner;

    try {
      onOpenOverlay("Đang cập nhật...");
      await sleep(500);
      const response = await AuthAPI.uploadAvatar(url, user.id, inputRef.current.files![0]);

      mutate(role === "EMPLOYEE" ? profileEmployeeEndPoint : profileOwnerEndPoint, response, {
        rollbackOnError: true,
        populateCache: true,
        revalidate: true,
      });

      toast.success("Thay đổi thành công");

      handleCancel();

      onCloseOverlay();
    } catch (error: any) {
      onCloseOverlay();

      let msg = "";

      if (error instanceof AxiosError) {
        msg = error?.response?.data?.message ?? error.message;
      } else {
        msg = error.message;
      }

      toast.error(msg);
    }
  }, [inputRef.current, user, profileOwnerEndPoint, imageBlob, role]);

  return (
    <Box>
      <Card title="Thông tin cá nhân">
        <Stack direction={{ md: "row", xs: "column" }} alignItems={"center"} spacing={4}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ position: "relative" }}>
              {imageBlob && (
                <IconButton
                  aria-label="delete"
                  size="large"
                  color="error"
                  sx={{ position: "absolute", top: 0, right: -35 }}
                  onClick={handleCancel}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              )}
              <Avatar
                src={imageBlob || (user.photo ?? account.photoURL)}
                alt="photoURL"
                sx={{ width: 100, height: 100 }}
              />
              {value === 3 && (
                <>
                  <label htmlFor="avatar">
                    <IconButton
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: -20,
                        background:
                          theme.palette.mode === "light"
                            ? "rgba(0,0,0,0.1)"
                            : "rgba(255,255,255,0.5)",
                      }}
                      color={theme.palette.mode === "light" ? "primary" : "primary"}
                      onClick={handleClickUpload}
                    >
                      <UploadIcon />
                    </IconButton>
                    <input
                      type="file"
                      id="avatar"
                      hidden
                      ref={inputRef}
                      accept="image/*"
                      onChange={handleChangeAvatar}
                    />
                  </label>
                </>
              )}
            </Box>

            {value === 3 && (
              <Box mt={2}>
                <LoadingButton onClick={handleUploadAvatar} variant="contained">
                  Thay đổi
                </LoadingButton>
              </Box>
            )}
          </Box>

          <Box>
            <Stack direction={"row"} spacing={1} mb={1}>
              <Typography variant="h5" fontSize={{ xs: 14, sm: 19 }}>
                {user.display_name}
              </Typography>
              <Typography variant="h5" fontSize={18} color={"gray"}>
                {" / "}
              </Typography>
              <Typography variant="h5" fontSize={{ xs: 14, sm: 19 }}>
                {filterOptions.label}
              </Typography>
            </Stack>
            <Typography variant="caption" fontStyle={"italic"} color={"gray"}>
              Quản lý và cập nhật tài khoản của bạn
            </Typography>
          </Box>
        </Stack>

        {!isDesktop ? (
          <Box sx={{ mt: 2, px: 2 }}>
            <FormControl fullWidth>
              <Select value={value + ""} onChange={handleChangeValueSelect} displayEmpty>
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ) : (
          <Box sx={{ width: "100%", bgcolor: "background.paper", mt: 2 }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              {options.map((option) => (
                <Tab key={option.value} value={option.value} label={option.label} />
              ))}
            </Tabs>
          </Box>
        )}
      </Card>

      {value === 0 && (
        <GeneraForm initialValues={initialValues} onSubmit={handleSubmitGeneraForm} />
      )}
      {value === 1 && (
        <ProfileForm initialValues={initialValues} onSubmit={handleSubmitChangeProfile} />
      )}
      {value === 2 && (
        <Box sx={{ px: { md: 5, xs: 2 }, mt: 2 }}>
          <ChangePasswordForm
            initialValues={initialValuesChangePassword}
            onSubmit={handleSubmitChangePassword}
          />
        </Box>
      )}
    </Box>
  );
};

export default ProfileCommon;
