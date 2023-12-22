import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Loadable } from "~/components";
import { DashboardPaths } from "~/types";

const PostPage = Loadable(lazy(() => import("~/pages/Posts/PostPage")));
const AddEditPostPage = Loadable(lazy(() => import("~/pages/Posts/AddEditPostPage")));
const PostCategoryPage = Loadable(lazy(() => import("~/pages/Posts/PostCategoryPage")));

const postRoutes: Array<RouteObject> = [
  { path: DashboardPaths.PostCategory, element: <PostCategoryPage /> },
  { path: DashboardPaths.AddPost, element: <AddEditPostPage /> },
  { path: DashboardPaths.UpdatePost + '/:id', element: <AddEditPostPage /> },
  { path: DashboardPaths.Post, element: <PostPage /> },
];

export default postRoutes;
