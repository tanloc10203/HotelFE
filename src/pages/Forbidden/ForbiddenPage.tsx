import { Box, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { Navigate, useParams } from "react-router-dom";
import { ForbiddenCodes, isCodeForbidden } from "~/helpers";
import { ForPage } from "~/layouts";
import { SinglePaths } from "~/types";
import IconForbidden from "./components/IconForbidden";

const { HeadSeo, Container } = ForPage;

const ForbiddenPage: FC = () => {
  const { code } = useParams();

  if (isCodeForbidden(code!)) {
    return (
      <ForPage>
        <HeadSeo title={ForbiddenCodes[code]} />
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ mt: 3, mb: 10 }}>
            <Typography fontWeight={"bold"} fontSize={28} textAlign={"center"}>
              Không được phép
            </Typography>
            <Typography mt={2} color="text.secondary">
              {ForbiddenCodes[code]}
            </Typography>
          </Box>
          <Stack direction={"row"} justifyContent={"center"} alignItems={"center"}>
            <img src="/assets/images/forbidden/forbidden1.png" width={250} />
            <img src="/assets/images/forbidden/forbidden2.webp" width={300} />
            <IconForbidden />
          </Stack>
        </Container>
      </ForPage>
    );
  }

  return <Navigate to={SinglePaths.ErrorBoundary} replace />;
};

export default ForbiddenPage;
