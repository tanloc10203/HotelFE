export interface IPermission {
  id?: number;
  name: string;
  alias: string;
  desc: string;
  created_at?: string;
  updated_at?: string;
}

export type ChildrenPermissionModule = {
  selected: boolean;
} & IPermission;

export interface IPermissionModule {
  moduleName: string;
  children: ChildrenPermissionModule[];
}
