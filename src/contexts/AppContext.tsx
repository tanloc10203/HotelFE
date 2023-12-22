import { FC, ReactNode, createContext, useCallback, useContext, useState } from "react";

type AppContextValues = {
  openOverlay: boolean;
  onOpenOverlay: (text?: string) => void;
  onCloseOverlay: () => void;
  textOverlay: string;
};

export const AppContext = createContext<AppContextValues>({
  onCloseOverlay: () => {},
  onOpenOverlay: () => {},
  openOverlay: false,
  textOverlay: "",
});

export const useApp = () => useContext(AppContext);

type AppContextProviderProps = {
  children: ReactNode | JSX.Element;
};

const AppContextProvider: FC<AppContextProviderProps> = ({ children }) => {
  const [overlay, setOverlay] = useState<{
    open: boolean;
    text: string;
  }>({
    open: false,
    text: "Loading...",
  });

  const handleOpenOverlay = useCallback((text?: string) => {
    setOverlay((prev) => ({ open: true, text: text ?? prev.text }));
  }, []);

  const handleCloseOverlay = useCallback(() => {
    setOverlay((_) => ({ open: false, text: "Loading..." }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        openOverlay: overlay.open,
        textOverlay: overlay.text,
        onCloseOverlay: handleCloseOverlay,
        onOpenOverlay: handleOpenOverlay,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
