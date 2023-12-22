import { createBrowserRouter } from "react-router-dom";
import dashboardRoutes from "./protect";
import singleRoute from "./singleRoute";

const router = createBrowserRouter([...dashboardRoutes, ...singleRoute]);

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}

export type RouterApp = ReturnType<typeof createBrowserRouter>;

export default router;
