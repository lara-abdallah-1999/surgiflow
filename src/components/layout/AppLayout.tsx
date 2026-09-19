import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";

import { Sidebar } from "./Sidebar";
import { useSelectedCase } from "../../features/patient-context/useSelectedCase";
import { PatientContextHeader } from "../../features/patient-context/PatientContextHeader";
import { PatientHeaderHost } from "../../features/patient-context/headerHost";
import { ModuleCopilot } from "../../features/copilot/components/ModuleCopilot";
import { PageLoading } from "./PageLoading";

export function AppLayout() {
  const surgery = useSelectedCase();
  const [headerHost, setHeaderHost] = useState<HTMLDivElement | null>(null);
  return (
    <div className="app-shell flex h-dvh overflow-hidden bg-[#F5F7FA]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {surgery && <PatientContextHeader surgery={surgery} toolsRef={setHeaderHost} />}

        <PatientHeaderHost.Provider value={surgery ? headerHost : null}>
        <main id="main-content" className="app-main min-h-0 min-w-0 flex-1 overflow-auto" tabIndex={-1}>
          <div className="workspace-page h-full min-h-0"><Suspense fallback={<PageLoading />}><Outlet /></Suspense></div>
          <ModuleCopilot />
        </main>
        </PatientHeaderHost.Provider>
      </div>
    </div>
  );
}
