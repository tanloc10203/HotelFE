import axios from "~/services/axios";
import {
  RoleEmployeePayload,
  RolePayload,
  SuccessResponseProp,
  TypeEmployeeResponse,
} from "~/types";

class RoleEmployeeAPI {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  public get = async (filters?: any): Promise<SuccessResponseProp<TypeEmployeeResponse[]>> => {
    const response: SuccessResponseProp<TypeEmployeeResponse[]> = await axios.get(
      `${this.prefix}`,
      { params: { ...filters } }
    );
    return response;
  };

  public post = async (data: RoleEmployeePayload): Promise<RolePayload[]> => {
    const response: SuccessResponseProp<RolePayload[]> = await axios.post(this.prefix, data);
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

export default new RoleEmployeeAPI("/RoleEmployees");
