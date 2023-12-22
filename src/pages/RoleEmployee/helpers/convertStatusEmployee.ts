import { StatusEmployee } from "~/types";

export const convertStatusEmployee = (status: StatusEmployee) => {
  switch (status) {
    case "active":
      return { default: "rgba(34, 197, 94, 0.16)", active: "rgb(34, 197, 94)" };
    case "banned":
      return { default: "rgba(255, 171, 0, 0.16)", active: "rgb(255, 171, 0)" };
    case "inactive":
      return { default: "rgba(255, 86, 48, 0.16)", active: "rgb(255, 86, 48)" };
    default:
      return { default: "rgba(145, 158, 171, 0.16)", active: "rgb(145, 158, 171)" };
  }
};

export const convertGender = (gender: "MALE" | "FEMALE" | "OTHERS") => {
  if (gender === "FEMALE") return "Nữ";
  if (gender === "MALE") return "Nam";
  return "Khác";
};
