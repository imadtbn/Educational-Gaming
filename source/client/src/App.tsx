/**
 * Style: رحلة الحروف والأرقام — تنقّل مباشر بين محطات تعلّم قليلة وواضحة.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProgressProvider } from "./contexts/ProgressContext";
import CelebrationToast from "./components/CelebrationToast";
import PwaInstallPrompt from "./components/PwaInstallPrompt";
import Home from "./pages/Home";
import Arabic from "./pages/Arabic";
import English from "./pages/English";
import Animals from "./pages/Animals";
import Numbers from "./pages/Numbers";
import Games from "./pages/Games";
import Writing from "./pages/Writing";
import Stories from "./pages/Stories";

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/arabic" component={Arabic} />
      <Route path="/english" component={English} />
      <Route path="/animals" component={Animals} />
      <Route path="/numbers" component={Numbers} />
      <Route path="/writing" component={Writing} />
      <Route path="/games" component={Games} />
      <Route path="/stories" component={Stories} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ProgressProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider><Toaster /><CelebrationToast /><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}><AppRoutes /></WouterRouter><PwaInstallPrompt /></TooltipProvider>
        </ThemeProvider>
      </ProgressProvider>
    </ErrorBoundary>
  );
}

export default App;
