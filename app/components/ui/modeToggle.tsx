import { Moon, Sun } from "lucide-react";
import { Theme, useTheme } from "remix-themes";

import { Toggle } from "@/components/ui/toggle";

export function ModeToggle() {
  const [theme, setTheme] = useTheme();

  function handleTheme() {
    if (theme === "dark") {
      setTheme(Theme.LIGHT);
    } else {
      setTheme(Theme.DARK);
    }
  }
  return (
    <Toggle onPressedChange={handleTheme} aria-label="switch theme">
      {theme === "light" ? <Sun className="text-foreground h-[1.2rem] w-[1.2rem]" /> : <Moon className="text-foreground h-[1.2rem] w-[1.2rem]" />}
    </Toggle>
  );
}
