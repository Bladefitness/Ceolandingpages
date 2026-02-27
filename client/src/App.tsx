import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { FunnelProvider } from "./contexts/FunnelContext";
import Home from "./pages/Home";
import SmartQuiz from "./pages/SmartQuiz";
import Dashboard from "./pages/Dashboard";
import AdminLeads from "./pages/AdminLeads";
import PublicRoadmap from "./pages/PublicRoadmap";
import SharedPlaybook from "./pages/SharedPlaybook";
import SalesPage from "./pages/funnel/SalesPage";
import UpsellPage from "./pages/funnel/UpsellPage";
import DownsellPage from "./pages/funnel/DownsellPage";
import ThankYouPage from "./pages/funnel/ThankYouPage";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/quiz"} component={SmartQuiz} />
      <Route path="/dashboard/:id" component={Dashboard} />
      <Route path="/roadmap/:shareCode" component={PublicRoadmap} />
      <Route path="/playbook/:token" component={SharedPlaybook} />
      <Route path="/fb-ads-course" component={SalesPage} />
      <Route path="/offer/vault" component={UpsellPage} />
      <Route path="/offer/session" component={DownsellPage} />
      <Route path="/thank-you" component={ThankYouPage} />
      <Route path="/admin" component={AdminLeads} />
      <Route path="/admin/leads" component={AdminLeads} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <FunnelProvider>
            <Router />
          </FunnelProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
