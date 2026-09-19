import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppLayout } from "./components/layout/AppLayout";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Patients = lazy(() => import("./pages/Patients"));
const PatientDetails = lazy(() => import("./pages/PatientDetails"));
const WaitingList = lazy(() => import("./pages/WaitingList"));
const Accounting = lazy(() => import("./pages/Accounting"));
const PreOp = lazy(() => import("./pages/PreOp"));
const Surgery = lazy(() => import("./pages/Surgery"));
const PostOp = lazy(() => import("./pages/PostOp"));
const SurgeryDetails = lazy(() => import("./pages/SurgeryDetails"));
const Schedule = lazy(() => import("./pages/schedule"));
const Planning = lazy(() => import("./pages/Planning"));
const Planning2 = lazy(() => import("./pages/Planning2"));
const SurgeryReception = lazy(() => import("./pages/SurgeryReception"));
const Recovery = lazy(() => import("./pages/Recovery"));
const PreOpDetails = lazy(() => import("./pages/PreOpDetails"));
const PostOpDetails = lazy(() => import("./pages/PostOpDetails"));
const ReceptionDetails = lazy(() => import("./pages/ReceptionDetails"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/planning" element={<Planning />} />

          <Route 
            path="/planning2" 
            element={<Planning2 />} 
          />

          <Route path="/" element={<Dashboard />} />

          <Route
            path="/patients"
            element={<Patients />}
          />

          <Route
            path="/patients/:id"
            element={<PatientDetails />}
          />

          <Route
            path="/waiting-list"
            element={<WaitingList />}
          />

          <Route
            path="/accounting"
            element={<Accounting />}
          />

          <Route
            path="/pre-op"
            element={<PreOp />}
          />

          <Route 
            path="/pre-op/:id" 
            element={<PreOpDetails />} />

          <Route
            path="/post-op"
            element={<PostOp />}
          />

          <Route 
            path="/post-op/:id" 
            element={<PostOpDetails />} />

          <Route
            path="/surgery"
            element={<Surgery />}
          />

          <Route
            path="/surgery/:id/report"
            element={<SurgeryDetails />}
          />

          <Route
            path="/surgery/:id"
            element={<SurgeryDetails />}
          />

          <Route
            path="/schedule"
            element={<Schedule />}
          />
          <Route
            path="/recovery"
            element={<Recovery />}
          />

          <Route
            path="/reception"
            element={<SurgeryReception />}
          />

          <Route 
            path="/reception/:id" 
            element={<ReceptionDetails />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;