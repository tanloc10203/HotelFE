import { useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { LocalStorage } from "~/constants";
import { appActions } from "~/features/app";
import { authActions } from "~/features/auth";
import { isErrorAuthorization } from "~/helpers";
import { getLocalStorage, setLocalStorage } from "~/helpers/localStorage";
import { AcceptSession, LoaderDashboard } from "~/routes/loaderProtect";
import {
  AuthAPI,
  profileEmployeeEndPoint as catchKeyEmployee,
  profileOwnerEndPoint as catchKeyOwner,
} from "~/services/apis/auth";
import { store, useAppDispatch } from "~/stores";
import { RoleStates, SinglePaths } from "~/types";
import { generateSession } from "~/utils";

export const useUnload = (session: string, role: RoleStates | null) => {
  useEffect(() => {
    if (!session || !role) return;

    window.onbeforeunload = function (event) {
      event.preventDefault();

      console.log(`onbeforeunload`, { session, role });

      let acceptsSession: string | null | AcceptSession[] = getLocalStorage(
        LocalStorage.ACCEPTS_SESSION
      );

      if (!acceptsSession) {
        return;
      }

      acceptsSession = JSON.parse(acceptsSession) as AcceptSession[];

      if (acceptsSession?.length === 0) return;

      const newSession = generateSession();

      let index = acceptsSession.findIndex((t) => t.session === session);

      if (index === -1) {
        const path = role === "EMPLOYEE" ? SinglePaths.LoginEmployee : SinglePaths.LoginOwner;

        index = acceptsSession.findIndex((t) => t.path === path);

        if (index === -1) {
          acceptsSession.push({
            path: path,
            session: newSession,
          });
        } else {
          acceptsSession[index] = {
            ...acceptsSession[index],
            session: newSession,
          };
        }
      } else {
        acceptsSession[index] = {
          ...acceptsSession[index],
          session: newSession,
        };
      }

      setLocalStorage(LocalStorage.LAST_SESSION, newSession);
      setLocalStorage(LocalStorage.ACCEPTS_SESSION, JSON.stringify(acceptsSession));
      console.log(`set LocalStorage.LAST_SESSION, LocalStorage.ACCEPTS_SESSION`);
    };

    return () => {};
  }, [session, role]);
};

export const useLoaderToken = () => {
  const dataLoader = useLoaderData() as LoaderDashboard;
  return dataLoader;
};

export const useProfileOwner = (role: RoleStates | null) => {
  const navigation = useNavigate();
  const dispatch = useAppDispatch();
  const cacheKey = role === "EMPLOYEE" ? catchKeyEmployee : catchKeyOwner;
  const path = role === "EMPLOYEE" ? SinglePaths.LoginEmployee : SinglePaths.LoginOwner;

  const response = useSWR(cacheKey, (url) => AuthAPI.getProfile(url), {
    revalidateOnFocus: false,
    revalidateIfStale: true,
    isPaused: () => !role,
    onSuccess(data) {
      dispatch(authActions.setUser({ type: role!, user: data.metadata! }));
      dispatch(appActions.closeOverplay());
    },
    onError(err) {
      console.log(`error`, err);
      dispatch(appActions.closeOverplay());

      if (isErrorAuthorization(err)) {
        const { role } = store.getState().auth;

        if (role === "EMPLOYEE") {
          store.dispatch(authActions.setResetState("EMPLOYEE"));
        } else {
          store.dispatch(authActions.setResetState("OWNER"));
        }

        navigation(path, { replace: true });
      }
    },
  });

  return response;
};
