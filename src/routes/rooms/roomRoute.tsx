import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Loadable } from "~/components";
import { roomAPI } from "~/services/apis/room";
import { roomTypeAPI } from "~/services/apis/roomType";
import { DashboardPaths } from "~/types";

const RoomPage = Loadable(lazy(() => import("~/pages/Rooms/RoomPage")));
const AddEditRoomPage = Loadable(lazy(() => import("~/pages/Rooms/AddEditRoomPage")));
const RoomTypePage = Loadable(lazy(() => import("~/pages/Rooms/RoomTypePage")));
const AddEditRoomTypePage = Loadable(lazy(() => import("~/pages/Rooms/AddEditRoomTypePage")));
const SetupPriceList = Loadable(lazy(() => import("~/pages/SetupPrice")));

const roomRoutes: Array<RouteObject> = [
  { path: DashboardPaths.RoomTypes, element: <RoomTypePage /> },
  { path: DashboardPaths.RoomTypesTrash + "/:type", element: <RoomTypePage /> },
  { path: DashboardPaths.AddRoomTypes, element: <AddEditRoomTypePage /> },
  { path: DashboardPaths.SetupPriceList, element: <SetupPriceList /> },
  {
    path: DashboardPaths.EditRoomTypes + "/:id",
    element: <AddEditRoomTypePage />,
    loader: async ({ params }) => {
      try {
        const response = await roomTypeAPI.getById(+params?.id!);
        return response;
      } catch (error) {
        return null;
      }
    },
  },
  { path: DashboardPaths.AddRoom, element: <AddEditRoomPage /> },
  {
    path: DashboardPaths.UpdateRoom + "/:id",
    element: <AddEditRoomPage />,
    loader: async ({ params }) => {
      try {
        const response = await roomAPI.getById(+params?.id!);
        return response;
      } catch (error) {
        return null;
      }
    },
  },
  { path: DashboardPaths.Room, element: <RoomPage /> },
];

export default roomRoutes;
