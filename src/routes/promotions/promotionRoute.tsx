import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Loadable } from "~/components";
import { DashboardPaths } from "~/types";

const PromotionPage = Loadable(lazy(() => import("~/pages/Promotions/PromotionPage")));
const AddEditPromotionPage = Loadable(lazy(() => import("~/pages/Promotions/AddEditPromotionPage")));
const PromotionTypePage = Loadable(lazy(() => import("~/pages/Promotions/PromotionTypePage")));

const promotionRoutes: Array<RouteObject> = [
  { path: DashboardPaths.PromotionTypes, element: <PromotionTypePage /> },
  { path: DashboardPaths.AddPromotion, element: <AddEditPromotionPage /> },
  { path: DashboardPaths.UpdatePromotion + '/:id', element: <AddEditPromotionPage /> },
  { path: DashboardPaths.Promotion, element: <PromotionPage /> },
];

export default promotionRoutes;
