import { FC } from "react";
import { ForPage } from "~/layouts";
import { ProfileCommon } from "../components";

const { Container, HeadSeo } = ForPage;

const Profile: FC = () => {
  return (
    <ForPage>
      <HeadSeo title="Thông tin cá nhân" />

      <Container maxWidth="md">
        <ProfileCommon />
      </Container>
    </ForPage>
  );
};

export default Profile;
