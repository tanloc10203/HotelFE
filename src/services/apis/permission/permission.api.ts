import axios from "~/services/axios";
import { IPermission, SuccessResponseProp } from "~/types";

class PermissionAPI {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  public get = (filters?: any): Promise<SuccessResponseProp<IPermission[]>> => {
    return axios.get(`${this.prefix}`, { params: { ...filters } });
  };

  public post = async (data: Partial<IPermission>): Promise<IPermission> => {
    const response: SuccessResponseProp<IPermission> = await axios.post(this.prefix, data);
    return response.metadata;
  };

  public patch = async (id: number, data: Partial<IPermission>) => {
    const response: SuccessResponseProp<IPermission> = await axios.patch(
      `${this.prefix}/${id}`,
      data
    );
    return response.metadata;
  };

  public delete = async (id: number) => {
    const response: SuccessResponseProp<number> = await axios.delete(`${this.prefix}/${id}`);
    return response.metadata;
  };

  public getById = (id: number) => {
    return axios.get(`${this.prefix}/${id}`);
  };

  public getKey = () => {};

  get getPrefix() {
    return this.prefix;
  }
}

export default new PermissionAPI("/Permissions");
