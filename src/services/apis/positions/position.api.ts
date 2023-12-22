import axios from "~/services/axios";
import { IPosition, RolePayload, SuccessResponseProp } from "~/types";

class PositionAPI {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  public get = (filters?: any): Promise<SuccessResponseProp<IPosition[]>> => {
    return axios.get(`${this.prefix}`, { params: { ...filters } });
  };

  public post = async (data: IPosition): Promise<IPosition> => {
    const response: SuccessResponseProp<IPosition> = await axios.post(this.prefix, data);
    return response.metadata;
  };

  public patch = async (id: number, data: IPosition): Promise<IPosition> => {
    const response: SuccessResponseProp<IPosition> = await axios.patch(
      `${this.prefix}/${id}`,
      data
    );
    return response.metadata;
  };

  public getById = async (id: number): Promise<RolePayload> => {
    const response: SuccessResponseProp<RolePayload> = await axios.get(`${this.prefix}/${id}`);
    return response.metadata;
  };

  public delete = async (id: number) => {
    const response = await axios.delete(`${this.prefix}/${id}`);
    return response;
  };

  public getKey = () => {};

  get getPrefix() {
    return this.prefix;
  }
}

export default new PositionAPI("/Positions");
