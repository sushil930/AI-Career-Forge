import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import AnalyzeResume from "./pages/AnalyzeResume";
import ResumeBuilder from "./pages/ResumeBuilder";
import JobMatch from "./pages/JobMatch";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import CoverLetterGenerator from "./pages/dashboard/CoverLetterGenerator";
import MyResumes from "./pages/dashboard/MyResumes";
import HelpAndTips from "./pages/dashboard/HelpAndTips";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main site routes */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Home />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Auth />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/analyze"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <AnalyzeResume />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/builder"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <ResumeBuilder />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/job-match"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <JobMatch />
                </main>
                <Footer />
              </>
            }
          />

          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="analyze" element={<AnalyzeResume />} />
            <Route path="builder" element={<ResumeBuilder />} />
            <Route path="job-match" element={<JobMatch />} />
            <Route path="cover-letter" element={<CoverLetterGenerator />} />
            <Route path="my-resumes" element={<MyResumes />} />
            <Route path="help" element={<HelpAndTips />} />
          </Route>

          {/* Redirect /dashboard to /dashboard if missing trailing slash */}
          <Route path="/dashboard" element={<Navigate to="/dashboard" replace />} />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
