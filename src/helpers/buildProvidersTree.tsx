import { ReactNode } from "react";

const buildProvidersTree = (componentWithProps: any[]) => {
  const initialComponent = ({ children }: { children: ReactNode }) => <>{children}</>;

  return componentWithProps.reduce((WrapperComponents, [Provider, props = {}]) => {
    return ({ children }: { children: ReactNode }) => {
      return (
        <WrapperComponents>
          <Provider {...props}>{children}</Provider>
        </WrapperComponents>
      );
    };
  }, initialComponent);
};

export default buildProvidersTree;
