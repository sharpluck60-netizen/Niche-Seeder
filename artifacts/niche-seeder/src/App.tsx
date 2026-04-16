import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { Switch, Route, Redirect, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Landing } from "@/pages/landing";
import { Layout } from "@/components/layout";
import { Dashboard } from "@/pages/dashboard";
import { Analyze } from "@/pages/analyze";
import { AnalysesList } from "@/pages/analyses-list";
import { AnalysisDetail } from "@/pages/analysis-detail";
import { ImageLab } from "@/pages/image-lab";
import { PhotoStudio } from "@/pages/photo-studio";
import { CreativeStudio } from "@/pages/creative-studio";
import { CaptionGenerator } from "@/pages/caption-generator";
import { DanceStudio } from "@/pages/dance-studio";
import { PhantomPassport } from "@/pages/phantom-passport";
import { HairstyleLab } from "@/pages/hairstyle-lab";
import { DirectorLab } from "@/pages/director-lab";
import { StoryBible } from "@/pages/story-bible";
import { DramaEngine } from "@/pages/drama-engine";
import { ThemeProvider } from "@/lib/theme";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// NOTE: in dev this env var will be empty, in prod it will be automatically set
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

const queryClient = new QueryClient();

function SignInPage() {
  // To update login providers, app branding, or OAuth settings use the Auth
  // pane in the workspace toolbar. More information can be found in the Replit docs.
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        forceRedirectUrl={`${basePath}/dashboard`}
      />
    </div>
  );
}

function SignUpPage() {
  // To update login providers, app branding, or OAuth settings use the Auth
  // pane in the workspace toolbar. More information can be found in the Replit docs.
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
        forceRedirectUrl={`${basePath}/dashboard`}
      />
    </div>
  );
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/dashboard" />
      </Show>
      <Show when="signed-out">
        <Landing />
      </Show>
    </>
  );
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <>
      <Show when="signed-in">
        <Layout>
          <Component />
        </Layout>
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeRedirect} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/analyze" component={() => <ProtectedRoute component={Analyze} />} />
      <Route path="/analyses" component={() => <ProtectedRoute component={AnalysesList} />} />
      <Route path="/analyses/:id" component={() => <ProtectedRoute component={AnalysisDetail} />} />
      <Route path="/image-lab" component={() => <ProtectedRoute component={ImageLab} />} />
      <Route path="/photo-studio" component={() => <ProtectedRoute component={PhotoStudio} />} />
      <Route path="/creative-studio" component={() => <ProtectedRoute component={CreativeStudio} />} />
      <Route path="/caption-lab" component={() => <ProtectedRoute component={CaptionGenerator} />} />
      <Route path="/dance-studio" component={() => <ProtectedRoute component={DanceStudio} />} />
      <Route path="/phantom-passport" component={() => <ProtectedRoute component={PhantomPassport} />} />
      <Route path="/hairstyle-lab" component={() => <ProtectedRoute component={HairstyleLab} />} />
      <Route path="/director-lab" component={() => <ProtectedRoute component={DirectorLab} />} />
      <Route path="/story-bible" component={() => <ProtectedRoute component={StoryBible} />} />
      <Route path="/drama-engine" component={() => <ProtectedRoute component={DramaEngine} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  if (!clerkPubKey) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <RouterWithoutClerk />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <ClerkQueryClientCacheInvalidator />
            <Router />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function RouterWithoutClerk() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
