
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TimetableProvider } from "./context/TimetableContext";
import Index from "./pages/Index";
import Generator from "./pages/Generator";
import Timetable from "./pages/Timetable";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TimetableProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/generator" element={<Generator />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TimetableProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
