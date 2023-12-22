export const convertTabToStatus = (tab: number) => {
  let status: string;

  switch (tab) {
    case 1:
      status = "inactive";
      break;
    case 2:
      status = "active";
      break;
    case 3:
      status = "banned";
      break;
    case 4:
      status = "retired";
      break;
    default:
      status = "";
      break;
  }

  return status;
};

export const convertStatusToTabIndex = (status: string) => {
  let index: number;

  switch (status) {
    case "inactive":
      index = 1;
      break;
    case "active":
      index = 2;
      break;
    case "banned":
      index = 3;
      break;
    case "retired":
      index = 4;
      break;
    default:
      index = 0;
      break;
  }

  return index;
};
