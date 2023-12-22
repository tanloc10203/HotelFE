import { Box, Container, Typography } from "@mui/material";
import { AxiosError } from "axios";
import React, { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { HeadSeo, ScrollToTop } from "~/components";
import { JWT_EXPIRED } from "~/constants";
import { useApp } from "~/contexts/AppContext";
import { AuthAPI, resetPasswordEmployee, resetPasswordOwner } from "~/services/apis/auth";
import { ChangePasswordPayload, SinglePaths } from "~/types";
import { sleep } from "~/utils";
import useStyles from "../Login/style";
import { FormResetPassword } from "../form";
import DialogFormForgotPassword from "../form/DialogFormForgotPassword/DialogFormForgotPassword";

type Props = {};

type ParamResponse = {
  userId: string;
  token: string;
  type: "employee" | "owner";
};

const ResetPassword: React.FC<Props> = () => {
  const params = useParams() as unknown as Readonly<ParamResponse>;
  const { StyledContent, StyledRoot } = useStyles();
  const { onCloseOverlay, onOpenOverlay } = useApp();
  const [response, setResponse] = useState<{ type: "error" | "success" | null; text: string }>({
    type: null,
    text: "",
  });
  const [expired, setExpired] = useState(false);
  const navigation = useNavigate();

  const handleSubmit = useCallback(
    async (values: Pick<ChangePasswordPayload, "password">, resetForm: () => void) => {
      const url = params.type === "employee" ? resetPasswordEmployee : resetPasswordOwner;
      setExpired(false);
      setResponse({ type: null, text: "" });

      try {
        onOpenOverlay("Đang đăng nhập...");
        await sleep(300);
        await AuthAPI.resetPassword(`${url}/${params.userId}/${params.token}`, values);
        resetForm();

        toast.success("Thay đổi mật khẩu thành công");
        setResponse({ type: "success", text: "Thay đổi mật khẩu thành công bạn có thể đăng nhập" });

        const timer = setTimeout(() => {
          navigation(
            params.type === "employee" ? SinglePaths.LoginEmployee : SinglePaths.LoginOwner,
            {
              replace: true,
            }
          );
          clearTimeout(timer);
        }, 1000);
      } catch (error: any) {
        let msg = "";

        if (error instanceof AxiosError) {
          msg = error?.response?.data?.message ?? error.message;

          if (error?.response?.data?.code === JWT_EXPIRED) {
            setExpired(true);
          }
        } else {
          msg = error.message;
        }

        setResponse({ type: "error", text: msg });
        toast.error(msg);
      } finally {
        onCloseOverlay();
      }
    },
    []
  );

  return (
    <>
      <ScrollToTop />

      <HeadSeo title={"Thay đổi mật khẩu"} />

      <StyledRoot>
        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Thay đổi mật khẩu
            </Typography>

            <Typography variant="body2" sx={{ mb: response.text ? 2 : 5 }}>
              Nếu bạn nhập sai 3 lần vui lòng thử lại sau vài phút
            </Typography>

            {response.text ? (
              <Box sx={{ mb: 5 }}>
                <Typography
                  mb={1}
                  variant="body2"
                  color={response.type === "error" ? "error" : "green"}
                  fontStyle={"italic"}
                  fontWeight={700}
                >
                  {response.text}
                </Typography>
                {expired ? (
                  <DialogFormForgotPassword isResend isOwner={params.type === "owner"} />
                ) : null}
              </Box>
            ) : null}

            <FormResetPassword initialValues={{ password: "" }} onSubmit={handleSubmit} />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
};

export default ResetPassword;
