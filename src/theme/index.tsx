import { ReactNode, createContext, useLayoutEffect, useMemo, useState } from "react";
// @mui
import { CssBaseline } from "@mui/material";
import {
  ThemeProvider as MUIThemeProvider,
  Shadows,
  StyledEngineProvider,
  ThemeOptions,
  createTheme,
} from "@mui/material/styles";
import { TypographyOptions } from "@mui/material/styles/createTypography";
import customShadows from "./customShadows";
import GlobalStyles from "./globalStyles";
import componentsOverride from "./overrides";
import shadows from "./shadows";
import typography from "./typography";
import { LocalStorage } from "~/constants";
import { ThemeModes } from "~/types";
import { viVN } from "@mui/x-date-pickers/locales";
import { viVN as coreViVN } from "@mui/material/locale";
import "dayjs/locale/vi";

// ----------------------------------------------------------------------

interface ThemeProviderProps {
  children: ReactNode;
}

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeModes>(() => {
    const mode: ThemeModes = (localStorage.getItem(LocalStorage.THEME) as ThemeModes) ?? "light";
    return mode;
  });

  useLayoutEffect(() => {
    localStorage.setItem(LocalStorage.THEME, mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
        },
        viVN,
        coreViVN,
        shape: { borderRadius: 6 },
        typography: typography as TypographyOptions,
        shadows: shadows() as Shadows,
        customShadows: customShadows(),
      } as Partial<ThemeOptions>),
    [mode]
  );

  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ColorModeContext.Provider value={colorMode}>
        <MUIThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles />
          {children}
        </MUIThemeProvider>
      </ColorModeContext.Provider>
    </StyledEngineProvider>
  );
}
