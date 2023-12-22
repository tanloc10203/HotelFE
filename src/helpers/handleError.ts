import { AxiosError } from "axios";
import {
  INVALID_SIGNATURE,
  INVALID_USER_ID_DECODE,
  INVALID_USER_ID_DECODE_REFRESH_TOKEN,
  JWT_EXPIRED,
  MISSING_ACCESS_TOKEN,
  MISSING_CLIENT_ID,
  NOT_FOUND_KEY_STORE,
  REFRESH_TOKEN_OR_USER_UN_AUTHORIZATION,
  SOMETHING_WRONG_HAPPEN_REFRESH_TOKEN,
  USER_NOT_FOUND,
} from "~/constants";

export const isErrorAuthorization = (err: any) => {
  if (err instanceof AxiosError) {
    const status = err?.response?.status;
    const code = err?.response?.data?.code;

    if (
      (status === 403 &&
        (code === INVALID_SIGNATURE ||
          code === MISSING_CLIENT_ID ||
          code === INVALID_USER_ID_DECODE_REFRESH_TOKEN ||
          code === INVALID_USER_ID_DECODE ||
          code === SOMETHING_WRONG_HAPPEN_REFRESH_TOKEN ||
          code === REFRESH_TOKEN_OR_USER_UN_AUTHORIZATION ||
          code === JWT_EXPIRED)) ||
      (status === 404 && (code === NOT_FOUND_KEY_STORE || code === USER_NOT_FOUND)) ||
      (status === 401 && code === MISSING_ACCESS_TOKEN)
    ) {
      return true;
    }
  }

  return false;
};
