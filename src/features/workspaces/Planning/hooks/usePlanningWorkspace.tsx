import { useMemo,useState } from "react";
import { useSurgeryStore } from "../../../../store/surgeryStore";
import { type Surgery } from "../../../../types/surgery";
import { isFinished,orderedCases } from "../../../../utils/planning";
import { localToday } from "../config";

export function usePlanningWorkspace() {
  const surgeries = useSurgeryStore(
    (state) => state.surgeries,
  );

  const updateSurgery = useSurgeryStore(
    (state) => state.updateSurgery,
  );

  const [date, setDate] =
    useState(localToday);

  const [doctor, setDoctor] =
    useState("");

  const [doctorFilterOpen, setDoctorFilterOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<Surgery | null>(null);

  const [notice, setNotice] =
    useState("");

  const rooms = useMemo(
    () =>
      [
        ...new Set(
          surgeries
            .map((surgery) => surgery.room)
            .filter(Boolean),
        ),
      ].sort(),
    [surgeries],
  );

  const doctors = useMemo(
    () =>
      [
        ...new Set(
          surgeries.map(
            (surgery) => surgery.doctor,
          ),
        ),
      ].sort(),
    [surgeries],
  );

  const dayCases = useMemo(
    () =>
      orderedCases(
        surgeries.filter(
          (surgery) =>
            surgery.date === date,
        ),
      ),
    [surgeries, date],
  );

  const visible = useMemo(
    () =>
      dayCases.filter(
        (surgery) =>
          !doctor ||
          surgery.doctor === doctor,
      ),
    [dayCases, doctor],
  );

  const itinerary = useMemo(
    () =>
      visible.filter(
        (surgery) => !isFinished(surgery),
      ),
    [visible],
  );




  
  return { setDate, date, setDoctorFilterOpen, doctor, doctorFilterOpen, setDoctor, doctors, notice, itinerary, setEditing, dayCases, rooms, editing, surgeries, updateSurgery, setNotice };
}
