import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Loadable } from "~/components";
import { DashboardPaths } from "~/types";

const EquipmentPage = Loadable(lazy(() => import("~/pages/Equipments/EquipmentPage")));
// const AddEditEquipmentPage = Loadable(
//   lazy(() => import("~/pages/Equipments/AddEditEquipmentPage"))
// );
const EquipmentTypePage = Loadable(lazy(() => import("~/pages/Equipments/EquipmentTypePage")));

const EquipmentRoutes: Array<RouteObject> = [
  { path: DashboardPaths.EquipmentTypes, element: <EquipmentTypePage /> },
  // { path: DashboardPaths.AddEquipment, element: <AddEditEquipmentPage /> },
  // { path: DashboardPaths.UpdateEquipment + "/:id", element: <AddEditEquipmentPage /> },
  { path: DashboardPaths.Equipment, element: <EquipmentPage /> },
  { path: DashboardPaths.EquipmentTrash + "/:type", element: <EquipmentPage /> },
];

export default EquipmentRoutes;
