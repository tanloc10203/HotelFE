import axios from "~/services/axios";
import { RolePayload, SuccessResponseProp } from "~/types";

class RoleAPI {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  public get = (filters?: any): Promise<SuccessResponseProp<RolePayload[]>> => {
    return axios.get(`${this.prefix}`, { params: { ...filters } });
  };

  public post = async (data: RolePayload): Promise<RolePayload> => {
    const response: SuccessResponseProp<RolePayload> = await axios.post(this.prefix, data);
    return response.metadata;
  };

  public patch = async (id: number, data: Partial<RolePayload>): Promise<RolePayload> => {
    const response: SuccessResponseProp<RolePayload> = await axios.patch(
      `${this.prefix}/${id}`,
      data
    );
    return response.metadata;
  };

  public getById = async (id: number): Promise<RolePayload> => {
    const response: SuccessResponseProp<RolePayload> = await axios.get(`${this.prefix}/${id}`);
    return response.metadata;
  };

  public getKey = () => {};

  get getPrefix() {
    return this.prefix;
  }
}

export default new RoleAPI("/Roles");
