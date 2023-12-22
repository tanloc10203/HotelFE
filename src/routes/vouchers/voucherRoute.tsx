import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Loadable } from "~/components";
import { DashboardPaths } from "~/types";

const VoucherPage = Loadable(lazy(() => import("~/pages/Vouchers/VoucherPage")));
const AddEditVoucherPage = Loadable(lazy(() => import("~/pages/Vouchers/AddEditVoucherPage")));

const voucherRoutes: Array<RouteObject> = [
  { path: DashboardPaths.AddVoucher, element: <AddEditVoucherPage /> },
  { path: DashboardPaths.UpdateVoucher + '/:id', element: <AddEditVoucherPage /> },
  { path: DashboardPaths.Voucher, element: <VoucherPage /> },
];

export default voucherRoutes;
