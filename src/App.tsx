import { Button } from "@/components/ui/button";
import { useTheme } from "./use-theme";

function App() {
  const { toggleTheme, theme } = useTheme();
  return (
    <Button variant="outline" onClick={toggleTheme}>
      Toggle theme to {theme === "light" ? "dark" : "light"}
    </Button>
  );
}

export default App;
