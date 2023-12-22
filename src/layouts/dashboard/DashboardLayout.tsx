import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Loader, ScrollToTop, Scrollbar } from "~/components";
import { appActions } from "~/features/app";
import { useGetRole, useGetSession } from "~/features/auth";
import { socket } from "~/helpers";
import ErrorBoundary from "~/pages/ErrorBoundary";
import { useAppDispatch } from "~/stores";
import Header from "./header";
import { useProfileOwner, useUnload } from "./hook/useLoader";
import Nav from "./nav";
import useStyles from "./styles";

export default function DashboardLayout() {
  const session = useGetSession();
  const role = useGetRole();

  useUnload(session, role);

  const { Main, StyledRoot } = useStyles();
  const [open, setOpen] = useState(true);
  const handleOpenNav = () => setOpen((p) => !p);
  const handleCloseNav = () => setOpen(false);
  const dispatch = useAppDispatch();

  const { error, isLoading, isValidating } = useProfileOwner(role);

  // useSocket((socket) => {
  //   socket.connect();
  // }, []);

  useEffect(() => {
    socket.connect();

    socket.on("disconnect", () => {
      socket.connect();
    });
  }, []);

  useEffect(() => {
    if (!role) return;

    if (isLoading) {
      dispatch(appActions.openOverplay("Đang tải dữ liệu..."));
      return;
    }
  }, [isLoading, role]);

  if (isLoading) return null;

  if (error) {
    return <ErrorBoundary />;
  }

  return (
    <Scrollbar
      sx={{
        height: 1,
        // "& .simplebar-content": { height: 1, display: "flex", flexDirection: "column" },
      }}
    >
      {isValidating && <Loader />}

      <StyledRoot>
        <ScrollToTop />

        <Header open={open} onOpenNav={handleOpenNav} />

        <Nav openNav={open} onCloseNav={handleCloseNav} />

        <Main>
          <Outlet />
        </Main>
      </StyledRoot>
    </Scrollbar>
  );
}
