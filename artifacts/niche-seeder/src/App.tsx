import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";
import { Dashboard } from "@/pages/dashboard";
import { Analyze } from "@/pages/analyze";
import { AnalysesList } from "@/pages/analyses-list";
import { AnalysisDetail } from "@/pages/analysis-detail";
import { ImageLab } from "@/pages/image-lab";
import { PhotoStudio } from "@/pages/photo-studio";
import { ThemeProvider } from "@/lib/theme";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/analyze" component={Analyze} />
        <Route path="/analyses" component={AnalysesList} />
        <Route path="/analyses/:id" component={AnalysisDetail} />
        <Route path="/image-lab" component={ImageLab} />
        <Route path="/photo-studio" component={PhotoStudio} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
