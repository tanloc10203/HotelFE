import { redirect } from "react-router-dom";
import { LocalStorage } from "~/constants";
import { authActions } from "~/features/auth";
import { getLocalStorage } from "~/helpers/localStorage";
import { store } from "~/stores";
import { SinglePaths } from "~/types";
import { generateSession, handleTwoToken, isOwnerRoute } from "~/utils";

export type AcceptSession = {
  session: string;
  path: string;
};

const loaderDashboard = () => {
  const { employee, owner, role, session: sessionStore } = store.getState().auth;
  const session = getLocalStorage(LocalStorage.LAST_SESSION);
  const acceptsSession = getLocalStorage(LocalStorage.ACCEPTS_SESSION);
  const tokenOwner = owner.accessToken;
  const tokenEmployee = employee.accessToken;

  /** @description use case: unAuthentication. Priority redirect route login employee */
  if (!tokenOwner && !tokenEmployee) return redirect(SinglePaths.LoginEmployee);

  /** @description use case: only one token (employee || owner) and have role and sessionStore */
  if ((tokenOwner || tokenEmployee) && role && sessionStore) {
    console.log(`use case: only one token (employee || owner) and have role and sessionStore`);
    return {
      owner: role === "OWNER" ? tokenOwner : null,
      employee: role === "EMPLOYEE" ? tokenEmployee : null,
    };
  }

  /** @description use case: have 2 token */
  if (tokenEmployee && tokenOwner) {
    /**
     * @description use case: Unknown because can not 2 in 1 is null
     * or acceptsSession length = 0
     * @returns Priority role employee
     */
    if (
      !acceptsSession ||
      !session ||
      (acceptsSession && (JSON.parse(acceptsSession) as AcceptSession[]).length === 0)
    ) {
      console.log(`use case: Unknown because can not 2 in 1 is null`);
      const session = handleTwoToken(SinglePaths.LoginEmployee);
      store.dispatch(authActions.setRole("EMPLOYEE"));
      store.dispatch(authActions.setSession(session));
      return {
        employee: tokenEmployee,
        owner: null,
      };
    }

    const newAcceptsSession = JSON.parse(acceptsSession) as AcceptSession[];

    const filter = newAcceptsSession.filter((t) => t.session === session);

    /** @description use case: session filter => not found */
    if (filter.length === 0) {
      /** @description use case: not found session but acceptsSession length = 1 */
      if (newAcceptsSession.length === 1) {
        console.log(`use case: not found session but acceptsSession length = 1`);
        const path = newAcceptsSession[0].path;
        const session = handleTwoToken(path);
        const isOwner = isOwnerRoute(path);
        store.dispatch(authActions.setSession(session));
        store.dispatch(authActions.setRole(isOwner ? "OWNER" : "EMPLOYEE"));

        return {
          owner: isOwner ? tokenOwner : null,
          employee: !isOwner ? tokenEmployee : null,
        };
      }

      /**
       * @description: use case: not found session but acceptsSession length = 2
       * ['/login', '/owner/login'], 2 token compare time expired rather than
       */
      const acceptsOne = newAcceptsSession[0];
      const acceptsTwo = newAcceptsSession[1];
      let checkCompareAcceptOne = false;

      if (+acceptsOne.session > +acceptsTwo.session) {
        checkCompareAcceptOne = true;
      }

      const path = checkCompareAcceptOne ? acceptsOne.path : acceptsTwo.path;
      const isOwner = isOwnerRoute(path);
      const session = handleTwoToken(path);
      store.dispatch(authActions.setSession(session));
      store.dispatch(authActions.setRole(isOwner ? "OWNER" : "EMPLOYEE"));
      console.log(`use case: not found session but acceptsSession length = 2`);

      return {
        owner: isOwner ? tokenOwner : null,
        employee: !isOwner ? tokenEmployee : null,
      };
    }

    /** @description use case: session filter => founder and if is owner route */
    if (isOwnerRoute(filter[0].path)) {
      console.log(`use case: session filter => founder and if is owner route`);
      const session = handleTwoToken(SinglePaths.LoginOwner);
      store.dispatch(authActions.setRole("OWNER"));
      store.dispatch(authActions.setSession(session));
      return {
        owner: tokenOwner,
        employee: null,
      };
    }

    console.log(`use case: session filter => founder and else is employee route`);
    const newSession = handleTwoToken(SinglePaths.LoginEmployee);
    store.dispatch(authActions.setRole("EMPLOYEE"));
    store.dispatch(authActions.setSession(newSession));

    /** @description use case: session filter => founder and else is employee route */
    return {
      owner: null,
      employee: tokenEmployee,
    };
  }

  const newSession = generateSession();

  /** @description use case: one only token owner */
  if (tokenOwner) {
    console.log(`use case: one only token owner`);
    store.dispatch(authActions.setRole("OWNER"));
    store.dispatch(authActions.setSession(newSession));
    return {
      owner: tokenOwner,
      employee: null,
    };
  }

  /** @description use case: one only token employee */
  console.log(`use case: one only token employee`);
  store.dispatch(authActions.setRole("EMPLOYEE"));
  store.dispatch(authActions.setSession(newSession));
  return {
    owner: null,
    employee: tokenEmployee,
  };
};

export type LoaderDashboard = ReturnType<typeof loaderDashboard>;

export default loaderDashboard;
