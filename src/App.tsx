import { useTheme } from "@mui/material";
import { ConfigProvider } from "antd";
import locale from "antd/locale/vi_VN";
import "dayjs/locale/vi";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { OverplayLoading, SnackbarCommon, StyledChart } from "~/components";
import { router } from "~/routes";
import AttributeContextProvider from "./contexts/AttributeContext";
import UnitContextProvider from "./contexts/UnitContext";
import buildProvidersTree from "./helpers/buildProvidersTree";
import { sagaMiddleware, store } from "./stores";
import ThemeProvider from "./theme";

const ProvidersTree = buildProvidersTree([
  [HelmetProvider],
  [Provider, { store }],
  [ThemeProvider],
  [UnitContextProvider],
  [AttributeContextProvider],
  [ConfigProvider, { locale }],
]);

export default function App() {
  const theme = useTheme();

  useEffect(() => {
    sagaMiddleware.setContext({ router: router });
  }, [router, sagaMiddleware]);

  return (
    <ProvidersTree>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
      <StyledChart />
      <OverplayLoading />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme.palette.mode}
      />
      <SnackbarCommon />
    </ProvidersTree>
  );
}
