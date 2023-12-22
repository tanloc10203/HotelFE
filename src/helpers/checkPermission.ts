import { ACCESS_DENIED, NOT_ROLES } from "~/constants";
import { employeeAPI } from "~/services/apis/emloyee";

export const passPermissions = async (alias: string, isOwner = false) => {
  if (isOwner) return "PASS";
  if (!alias) return "ALIAS_EMPTY";

  try {
    // console.log("====================================");
    // console.log(`check alias`, { alias, isOwner });
    // console.log("====================================");
    const response = await employeeAPI.getPermissions();

    console.log("====================================");
    console.log(`response`, response);
    console.log("====================================");
    const responseLength = response?.length;

    if (!responseLength) return NOT_ROLES;

    for (let index = 0; index < responseLength; index++) {
      const { permissions } = response[index];

      if (permissions.length) {
        const findIndex = permissions.findIndex((p) => p.alias === alias);
        console.log("====================================");
        console.log({ findIndex, alias, permissions });
        console.log("====================================");
        if (findIndex !== -1) return "PASS";
      }
    }

    return ACCESS_DENIED;
  } catch (error) {
    console.log(`error passPermissions `, error);
    return "ERROR";
  }
};
