import { Container, Typography } from "@mui/material";
import { AxiosError } from "axios";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useSWRMutation from "swr/mutation";
import { HeadSeo, Logo, ScrollToTop } from "~/components";
import { LocalStorage } from "~/constants";
import { appActions } from "~/features/app";
import { authActions } from "~/features/auth";
import { getLocalStorage, setLocalStorage } from "~/helpers/localStorage";
import useResponsive from "~/hooks/useResponsive";
import { AuthAPI, loginEmployeeEndPoint as cacheKey } from "~/services/apis/auth";
import { useAppDispatch } from "~/stores";
import { DashboardPaths, LoginPayload } from "~/types";
import { generateSession, pushSessionToLocalStorage, sleep } from "~/utils";
import { LoginForm } from "../form";
import useStyles from "./style";

const LoginEmployeePage: FC = () => {
  const mdUp = useResponsive("up", "md");
  const { StyledContent, StyledRoot, StyledSection } = useStyles();
  const initialValues = { username: "", password: "" };

  const { trigger } = useSWRMutation(`${cacheKey}`, AuthAPI.login, {
    revalidate: false,
  });
  const navigation = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (values: LoginPayload) => {
    try {
      dispatch(appActions.openOverplay("Đang đăng nhập..."));
      await sleep(500);
      const response = await trigger(values);

      const tokenOwner = getLocalStorage(LocalStorage.ACCESS_TOKEN_OWNER);
      const session = generateSession();

      setLocalStorage(LocalStorage.ACCESS_TOKEN_EMPLOYEE, response.metadata, true);
      dispatch(authActions.setAccessToken({ token: response.metadata, type: "EMPLOYEE" }));
      dispatch(authActions.setRole("EMPLOYEE"));
      dispatch(authActions.setSession(session));

      if (tokenOwner) {
        pushSessionToLocalStorage({ path: location.pathname, session });
      }

      navigation(DashboardPaths.DashboardApp, {
        replace: true,
        state: { from: location.pathname },
      });

      toast.success("Đăng nhập thành công");
    } catch (error: any) {
      let msg = "";

      if (error instanceof AxiosError) {
        msg = error?.response?.data?.message ?? error.message;
      } else {
        msg = error.message;
      }

      toast.error(msg);
    } finally {
      dispatch(appActions.closeOverplay());
    }
  };

  return (
    <>
      <ScrollToTop />

      <HeadSeo title={"Đăng nhập"} />

      <StyledRoot>
        <Logo
          sx={{
            position: "fixed",
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Chào mừng quay trở lại
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Đăng nhập quản lý dành cho nhân viên
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
              Nếu bạn nhập sai 3 lần vui lòng thử lại sau vài phút
            </Typography>

            <LoginForm isOwner={false} initialValues={initialValues} onSubmit={handleSubmit} />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
};

export default LoginEmployeePage;
