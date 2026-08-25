/**
 * Style: رحلة الحروف والأرقام — تنقّل مباشر بين محطات تعلّم قليلة وواضحة.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Arabic from "./pages/Arabic";
import English from "./pages/English";
import Animals from "./pages/Animals";
import Numbers from "./pages/Numbers";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/arabic" component={Arabic} />
      <Route path="/english" component={English} />
      <Route path="/animals" component={Animals} />
      <Route path="/numbers" component={Numbers} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider><Toaster /><Router /></TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
