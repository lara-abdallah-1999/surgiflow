import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useNavigate,useParams } from "react-router-dom";

import { useSurgeryStore } from "../store/surgeryStore";

export default function OperativeReport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const surgery = useSurgeryStore(
    (state) =>
      state.surgeries.find(
        (item) => item.id === id
      )
  );

  const updateSurgery = useSurgeryStore(
    (state) => state.updateSurgery
  );

  const [report, setReport] =
    useState(
      surgery?.operativeReport ?? ""
    );

  const [notes, setNotes] =
    useState(
      surgery?.surgeonNotes ?? ""
    );

  const [condition, setCondition] =
    useState(
      surgery?.patientCondition ??
        "Stable"
    );

  const [dischargeTime, setDischargeTime] =
    useState(
      surgery?.dischargeTime ?? ""
    );

  const [instructions, setInstructions] =
    useState(
      surgery?.dischargeInstructions ??
        ""
    );

  if (!surgery) {
    return (
      <div className="p-5">
        Surgery not found.
      </div>
    );
  }

  const surgeryId = surgery.id;

  function completeDischarge() {
    updateSurgery(surgeryId, {
      operativeReport: report,
      surgeonNotes: notes,
      patientCondition: condition,
      dischargeTime,
      dischargeInstructions:
        instructions,
      status: "Discharged",
    });

    navigate("/surgery");
  }

  return (
    <div data-workspace-page="OperativeReport" className="p-5">
      <div className="mb-5">
        <h1 className="text-xl font-semibold">
          Operative Report
        </h1>

        <p className="mt-1 text-xs text-[#667085]">
          {surgery.patientName}
          {" · "}
          {surgery.procedure}
        </p>
      </div>

      <div className="max-w-4xl space-y-3">
        <section className="rounded-lg border bg-white p-4">
          <label className="mb-1.5 block text-[11px] font-medium">
            How did the surgery go?
          </label>

          <textarea
            value={report}
            onChange={(event) =>
              setReport(
                event.target.value
              )
            }
            rows={4}
            className="w-full resize-none rounded-md border border-[#E4E7EC] p-3 text-xs"
            placeholder="Enter operative report..."
          />
        </section>

        <section className="rounded-lg border bg-white p-4">
          <label className="mb-1.5 block text-[11px] font-medium">
            Surgeon Notes
          </label>

          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(
                event.target.value
              )
            }
            rows={3}
            className="w-full resize-none rounded-md border border-[#E4E7EC] p-3 text-xs"
          />
        </section>

        <section className="rounded-lg border bg-white p-4">
          <div data-responsive-grid="2" className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-medium">
                Patient condition
              </label>

              <select
                value={condition}
                onChange={(event) =>
                  setCondition(
                    event.target.value
                  )
                }
                className="h-9 w-full rounded-md border px-2 text-xs"
              >
                <option>Stable</option>
                <option>
                  Requires Monitoring
                </option>
                <option>Complication</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-medium">
                Discharge time
              </label>

              <input
                type="time"
                value={dischargeTime}
                onChange={(event) =>
                  setDischargeTime(
                    event.target.value
                  )
                }
                className="h-9 w-full rounded-md border px-2 text-xs"
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border bg-white p-4">
          <label className="mb-1.5 block text-[11px] font-medium">
            Post-Operative Instructions
          </label>

          <textarea
            value={instructions}
            onChange={(event) =>
              setInstructions(
                event.target.value
              )
            }
            rows={4}
            className="w-full resize-none rounded-md border border-[#E4E7EC] p-3 text-xs"
            placeholder="Instructions given to the patient..."
          />
        </section>

        <button
          onClick={completeDischarge}
          className="flex items-center gap-2 rounded-md bg-[#172554] px-4 py-2 text-xs font-medium text-white"
        >
          <CheckCircle2 size={14} />
          Complete Discharge
        </button>
      </div>
    </div>
  );
}