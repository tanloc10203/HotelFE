import { FC, ReactNode, createContext, useCallback, useContext, useMemo, useState } from "react";
import { messageErrorAxios } from "~/helpers";
import { attributeAPI } from "~/services/apis/attribute";

import { AttributeType, LoadingState, RadioState } from "~/types";

type AttributeContextValues = {
  loading: LoadingState;
  attributes: AttributeType[];
  error: string;
  attributeOptions: RadioState[];
  addAttribute: (addPayload: AttributeType) => Promise<void>;
  getAttributes: () => Promise<void>;
};

export const AttributeContext = createContext<AttributeContextValues>({
  loading: "ready",
  attributes: [],
  error: "",
  attributeOptions: [],
  async addAttribute(_: AttributeType) {},
  async getAttributes() {},
});

export const useAttributes = () => useContext(AttributeContext);

type AttributeContextProviderProps = {
  children: ReactNode | JSX.Element;
};

const AttributeContextProvider: FC<AttributeContextProviderProps> = ({ children }) => {
  const [attributes, setAttributes] = useState<AttributeType[]>([]);
  const [loading, setLoading] = useState<LoadingState>("ready");
  const [error, setError] = useState("");

  const getAttributes = async () => {
    try {
      setLoading("pending");
      const response = await attributeAPI.get<AttributeType>();
      setAttributes(response.metadata);
      setLoading("success");
    } catch (error: any) {
      setLoading("error");
      const message = messageErrorAxios(error);
      setError(message);
      console.log("====================================");
      console.log(`error get Attributes`, error);
      console.log("====================================");
    } finally {
      setLoading("ready");
    }
  };

  const attributeOptions = useMemo((): RadioState[] => {
    if (!attributes.length) return [];
    return attributes.map((v) => ({ label: v.name, value: v.id! }));
  }, [attributes]);

  const addAttribute = useCallback(async (addPayload: AttributeType) => {
    try {
      await attributeAPI.post(addPayload);
      await getAttributes();
    } catch (error) {
      const message = messageErrorAxios(error);
      setError(message);
      console.log("====================================");
      console.log(`add Attributes error`, error);
      console.log("====================================");
      throw error;
    }
  }, []);

  return (
    <AttributeContext.Provider
      value={{
        addAttribute,
        getAttributes,
        attributeOptions,
        attributes,
        error,
        loading,
      }}
    >
      {children}
    </AttributeContext.Provider>
  );
};

export default AttributeContextProvider;
