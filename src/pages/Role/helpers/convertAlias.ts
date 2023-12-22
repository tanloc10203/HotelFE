export const convertAlias = (alias: string) => {
  if (alias.match(/add/)) return "Thêm";
  if (alias.match(/edit/)) return "Sửa";
  if (alias.match(/delete/)) return "Xóa";
  return "Xem";
};

export const convertAliasToColor = (alias: string) => {
  if (alias.match(/add/)) return "primary";
  if (alias.match(/edit/)) return "success";
  if (alias.match(/delete/)) return "error";
  return "secondary";
};
