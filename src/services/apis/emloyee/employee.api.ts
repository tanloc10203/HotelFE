import axios from "~/services/axios";
import {
  IEmployeePayload,
  IEmployeePayloadEdit,
  RolePayload,
  SuccessResponseProp,
  TypeEmployeeResponse,
} from "~/types";

type Options = { limit: number; page: number; totalRows: number; totalPage: number };

class EmployeeAPI {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  public get = async (
    filters?: any
  ): Promise<SuccessResponseProp<TypeEmployeeResponse[], Options>> => {
    const response: SuccessResponseProp<TypeEmployeeResponse[], Options> = await axios.get(
      `${this.prefix}`,
      { params: { ...filters } }
    );
    return response;
  };

  public getPermissions = async (): Promise<RolePayload[]> => {
    const response: SuccessResponseProp<RolePayload[]> = await axios.get(
      `${this.prefix}/Permissions`
    );
    return response.metadata;
  };

  public post = async (data: IEmployeePayload): Promise<TypeEmployeeResponse> => {
    const response: SuccessResponseProp<TypeEmployeeResponse> = await axios.post(this.prefix, data);
    return response.metadata;
  };

  public patch = async (id: number, data: IEmployeePayloadEdit): Promise<TypeEmployeeResponse> => {
    const response: SuccessResponseProp<TypeEmployeeResponse> = await axios.patch(
      `${this.prefix}/${id}`,
      data
    );
    return response.metadata;
  };

  public getById = async (id: number): Promise<TypeEmployeeResponse> => {
    const response: SuccessResponseProp<TypeEmployeeResponse> = await axios.get(
      `${this.prefix}/${id}`
    );
    return response.metadata;
  };

  public getKey = () => {};

  get getPrefix() {
    return this.prefix;
  }
}

export default new EmployeeAPI("/Employees");
