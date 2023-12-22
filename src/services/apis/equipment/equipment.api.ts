import ServiceCommon from "~/helpers/serviceCommon";
import axios from "~/services/axios";
import {
  GroupEquipment,
  GroupEquipmentArray,
  IEquipmentResponse,
  SuccessResponseProp,
} from "~/types";

class EquipmentAPI extends ServiceCommon {
  getGroups = async () => {
    const response: SuccessResponseProp<GroupEquipmentArray> = await axios.get(
      `${this.getPrefix}/Groups`
    );
    return response.metadata;
  };

  getFilterByGroup = async (group: GroupEquipment) => {
    const response: SuccessResponseProp<IEquipmentResponse[]> = await axios.get(
      `${this.getPrefix}/GroupFilter`,
      { params: { group } }
    );

    return response.metadata;
  };
}

export default new EquipmentAPI("/Equipments");
