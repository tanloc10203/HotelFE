import { FC, ReactNode, createContext, useCallback, useContext, useMemo, useState } from "react";
import { messageErrorAxios } from "~/helpers";
import { unitAPI } from "~/services/apis/unit";
import { IUnit, LoadingState, RadioState } from "~/types";

type UnitContextValues = {
  loading: LoadingState;
  units: IUnit[];
  error: string;
  unitOptions: RadioState[];
  addUnit: (addPayload: IUnit) => Promise<void>;
  getUnits: () => Promise<void>;
};

export const UnitContext = createContext<UnitContextValues>({
  loading: "ready",
  units: [],
  error: "",
  unitOptions: [],
  async addUnit(_: IUnit) {},
  async getUnits() {},
});

export const useUnits = () => useContext(UnitContext);

type UnitContextProviderProps = {
  children: ReactNode | JSX.Element;
};

const UnitContextProvider: FC<UnitContextProviderProps> = ({ children }) => {
  const [units, setUnits] = useState<IUnit[]>([]);
  const [loading, setLoading] = useState<LoadingState>("ready");
  const [error, setError] = useState("");

  const getUnits = async () => {
    try {
      setLoading("pending");
      const response = await unitAPI.get<IUnit>();
      setUnits(response.metadata);
      setLoading("success");
    } catch (error: any) {
      setLoading("error");
      const message = messageErrorAxios(error);
      setError(message);
      console.log("====================================");
      console.log(`error get Units`, error);
      console.log("====================================");
    } finally {
      setLoading("ready");
    }
  };

  const unitOptions = useMemo((): RadioState[] => {
    if (!units.length) return [];
    return units.map((v) => ({ label: v.name, value: v.id! }));
  }, [units]);

  const addUnit = useCallback(async (addPayload: IUnit) => {
    try {
      await unitAPI.post(addPayload);
      await getUnits();
    } catch (error) {
      const message = messageErrorAxios(error);
      setError(message);
      console.log("====================================");
      console.log(`add Units error`, error);
      console.log("====================================");
      throw error;
    }
  }, []);

  return (
    <UnitContext.Provider
      value={{
        addUnit,
        getUnits,
        unitOptions,
        units,
        error,
        loading,
      }}
    >
      {children}
    </UnitContext.Provider>
  );
};

export default UnitContextProvider;
