import { SuccessResponseProp } from "~/types";
import axios from "~/services/axios";

class ServiceCommon {
  protected prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  public get = <Data, Pagination = unknown>(
    filters?: any
  ): Promise<SuccessResponseProp<Data[], Pagination>> => {
    return axios.get(`${this.prefix}`, { params: { ...filters } });
  };

  public post = async <Data>(data: Data): Promise<Data> => {
    const response: SuccessResponseProp<Data> = await axios.post(this.prefix, data);
    return response.metadata;
  };

  public patch = async <Data>(id: number | string, data: Data): Promise<Data> => {
    const response: SuccessResponseProp<Data> = await axios.patch(`${this.prefix}/${id}`, data);
    return response.metadata;
  };

  public getById = async <Data>(id: number | string): Promise<Data> => {
    const response: SuccessResponseProp<Data> = await axios.get(`${this.prefix}/${id}`);
    return response.metadata;
  };

  public delete = async <Response = unknown>(id: number | string) => {
    const response: SuccessResponseProp<Response> = await axios.delete(`${this.prefix}/${id}`);
    return response.metadata;
  };

  public restore = async (id: number | string) => {
    const response: SuccessResponseProp<boolean> = await axios.post(`${this.prefix}/Restore/${id}`);
    return response.metadata;
  };

  public deleteInTrash = async (id: number | string) => {
    const response: SuccessResponseProp<boolean> = await axios.post(
      `${this.prefix}/TruncateTrash/${id}`
    );
    return response.metadata;
  };

  get getPrefix() {
    return this.prefix;
  }
}

export default ServiceCommon;
