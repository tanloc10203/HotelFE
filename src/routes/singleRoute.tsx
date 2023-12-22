import { lazy } from "react";
import { Navigate, RouteObject, redirect } from "react-router-dom";
import { Loadable } from "~/components";
import { LocalStorage } from "~/constants";
import { authActions } from "~/features/auth";
import { getLocalStorage } from "~/helpers/localStorage";
import { SimpleLayout } from "~/layouts";
import { store } from "~/stores";
import { DashboardPaths, SinglePaths } from "~/types";
import { handleTwoToken } from "~/utils";

const ErrorBoundary = Loadable(lazy(() => import("~/pages/ErrorBoundary")));
const LoginPage = Loadable(lazy(() => import("~/pages/Auth/Login")));
const ResetPasswordPage = Loadable(lazy(() => import("~/pages/Auth/ResetPassword")));
const LoginEmployeePage = Loadable(lazy(() => import("~/pages/Auth/LoginEmployee")));

const singleRoute: Array<RouteObject> = [
  {
    path: SinglePaths.LoginOwner,
    element: <LoginPage />,
    loader: () => {
      const tokenOwner = getLocalStorage(LocalStorage.ACCESS_TOKEN_OWNER);
      const tokenEmployee = getLocalStorage(LocalStorage.ACCESS_TOKEN_EMPLOYEE);

      if (tokenOwner) {
        if (tokenEmployee) {
          const session = handleTwoToken(SinglePaths.LoginOwner);
          store.dispatch(authActions.setSession(session));
          store.dispatch(authActions.setRole("OWNER"));
        }
        return redirect(DashboardPaths.DashboardApp);
      }

      return null;
    },
    errorElement: <ErrorBoundary />,
  },
  {
    path: SinglePaths.ResetPassword + "/:userId/:token/:type",
    element: <ResetPasswordPage />,
    loader: ({ params }) => {
      if (!params?.userId || !params?.token || !params?.type) {
        throw new Response("Đã có lỗi xảy ra thiếu dữ liệu", { status: 400 });
      }

      return null;
    },
    errorElement: <ErrorBoundary />,
  },
  {
    path: SinglePaths.LoginEmployee,
    element: <LoginEmployeePage />,
    errorElement: <ErrorBoundary />,
    loader: () => {
      const tokenEmployee = getLocalStorage(LocalStorage.ACCESS_TOKEN_EMPLOYEE);
      const tokenOwner = getLocalStorage(LocalStorage.ACCESS_TOKEN_OWNER);

      if (tokenEmployee) {
        if (tokenOwner) {
          const session = handleTwoToken(SinglePaths.LoginEmployee);
          store.dispatch(authActions.setSession(session));
          store.dispatch(authActions.setRole("EMPLOYEE"));
        }
        return redirect(DashboardPaths.DashboardApp);
      }

      return null;
    },
  },
  {
    element: <SimpleLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { element: <Navigate to="/dashboard/app" />, index: true },
      { path: SinglePaths.ErrorBoundary, element: <ErrorBoundary /> },
      { path: SinglePaths.Any, element: <Navigate to="/404" /> },
    ],
  },
  {
    path: SinglePaths.Any,
    element: <Navigate to="/404" replace />,
  },
];

export default singleRoute;
