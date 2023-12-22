import { Typography } from "@mui/material";
import { AxiosError } from "axios";
import { FC } from "react";
import { toast } from "react-toastify";
import useSWRMutation from "swr/mutation";
import { Logo } from "~/components";
import { useApp } from "~/contexts/AppContext";
import useResponsive from "~/hooks/useResponsive";
import { ForPage } from "~/layouts";
import { AuthAPI, changePasswordOwnerEndPoint as catchKey } from "~/services/apis/auth";
import { ChangePasswordPayload } from "~/types";
import { sleep } from "~/utils";
import { ChangePasswordForm } from "../form";
import useStyles from "./styles";

const { Container, HeadSeo } = ForPage;

const ChangePassword: FC = () => {
  const { StyledContent, StyledRoot, StyledSection } = useStyles();
  const mdUp = useResponsive("up", "md");
  const { onCloseOverlay, onOpenOverlay } = useApp();
  const { trigger } = useSWRMutation(catchKey, AuthAPI.changePasswordOwner, {
    revalidate: false,
  });

  const initialValues: ChangePasswordPayload = {
    newPassword: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values: ChangePasswordPayload, resetForm: () => void) => {
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

  return (
    <ForPage>
      <HeadSeo title="Thay đổi mật khẩu" />

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
            <Typography variant="h4" sx={{ px: 5, mt: 10, mb: 5 }}>
              Thay đổi mật khẩu để an toàn hơn
            </Typography>

            <img src="/assets/illustrations/changePwd.png" alt="login" width={400} height={400} />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Thay đổi mật khẩu
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
              Chúng tôi khuyến khích bạn đổi mật khẩu sau 3 tháng sử dụng. Để sử dụng an toàn hơn.
            </Typography>

            <ChangePasswordForm initialValues={initialValues} onSubmit={handleSubmit} />
          </StyledContent>
        </Container>
      </StyledRoot>
    </ForPage>
  );
};

export default ChangePassword;
