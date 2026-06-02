import { themePalette, type ThemeKey } from "@/styles/theme.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

const STORAGE_KEY = "selected-theme";

type ThemeContextValue = {
  theme: ThemeKey;
  setTheme: (theme: ThemeKey) => Promise<void>;
  palette: (typeof themePalette)[ThemeKey];
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeKey>("light");

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === "dark") {
          setThemeState("dark");
        } else {
          setThemeState("light");
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      }
    };

    void loadTheme();
  }, []);

  const setTheme = async (nextTheme: ThemeKey) => {
    try {
      setThemeState(nextTheme);
      await AsyncStorage.setItem(STORAGE_KEY, nextTheme);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  const value = useMemo(
    () => ({ theme, setTheme, palette: themePalette[theme] }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
