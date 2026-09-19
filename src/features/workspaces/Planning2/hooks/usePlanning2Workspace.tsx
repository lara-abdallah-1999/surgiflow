import { useEffect,useMemo,useRef,useState } from "react";
import { useSurgeryStore } from "../../../../store/surgeryStore";
import { type Surgery } from "../../../../types/surgery";
import { conflictsFor,isFinished,orderedCases } from "../../../../utils/planning";
import { localToday,toDateLabel } from "../config";
import { type PendingMove } from "../types";
import { isBoardStatus } from "../utils";

export function usePlanning2Workspace() {
  const surgeries =
    useSurgeryStore(
      (state) =>
        state.surgeries,
    );

  const updateSurgery =
    useSurgeryStore(
      (state) =>
        state.updateSurgery,
    );

  const [date, setDate] =
    useState(localToday);

  const [calendarOpen, setCalendarOpen] =
    useState(false);

  const [calendarMonth, setCalendarMonth] =
    useState(() => {
      const value = new Date(`${localToday()}T00:00:00`);
      return new Date(value.getFullYear(), value.getMonth(), 1);
    });

  const [search, setSearch] =
    useState("");

  const [
    draggedSurgeryId,
    setDraggedSurgeryId,
  ] = useState<string | null>(
    null,
  );

  const [
    dragOverCell,
    setDragOverCell,
  ] = useState<string | null>(
    null,
  );

  const [
    pendingMove,
    setPendingMove,
  ] = useState<PendingMove>(
    null,
  );

  const [doctor, setDoctor] =
    useState("");

  const [
    doctorFilterOpen,
    setDoctorFilterOpen,
  ] = useState(false);

  const [editing, setEditing] =
    useState<Surgery | null>(
      null,
    );

  const [notice, setNotice] =
    useState("");

  const [
    boardExpanded,
    setBoardExpanded,
  ] = useState(false);

  const doctorFilterRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const calendarRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          setNotice("");
        },
        2800,
      );

    return () =>
      window.clearTimeout(
        timer,
      );
  }, [notice]);

  useEffect(() => {
    if (!doctorFilterOpen) {
      return;
    }

    const handleMouseDown = (
      event: MouseEvent,
    ) => {
      const target =
        event.target as
          | Node
          | null;

      if (
        target &&
        doctorFilterRef.current &&
        !doctorFilterRef.current.contains(
          target,
        )
      ) {
        setDoctorFilterOpen(
          false,
        );
      }
    };

    document.addEventListener(
      "mousedown",
      handleMouseDown,
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleMouseDown,
      );
  }, [doctorFilterOpen]);

  useEffect(() => {
    if (!calendarOpen) {
      return;
    }

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node | null;

      if (
        target &&
        calendarRef.current &&
        !calendarRef.current.contains(target)
      ) {
        setCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () =>
      document.removeEventListener("mousedown", handleMouseDown);
  }, [calendarOpen]);

  useEffect(() => {
    const selected = new Date(`${date}T00:00:00`);

    if (!Number.isNaN(selected.getTime())) {
      setCalendarMonth(
        new Date(selected.getFullYear(), selected.getMonth(), 1),
      );
    }
  }, [date]);

  useEffect(() => {
    if (!boardExpanded) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setBoardExpanded(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [boardExpanded]);

  const rooms = useMemo(
    () =>
      [
        ...new Set(
          surgeries
            .map(
              (surgery) =>
                surgery.room,
            )
            .filter(Boolean),
        ),
      ].sort(),
    [surgeries],
  );

  const doctors =
    useMemo(
      () =>
        [
          ...new Set(
            surgeries.map(
              (surgery) =>
                surgery.doctor,
            ),
          ),
        ].sort(),
      [surgeries],
    );

  const scopedCases =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return orderedCases(
        surgeries.filter(
          (surgery) => {
            const matchesDate =
              surgery.date === date;

            const matchesBoardStatus =
              isBoardStatus(
                surgery.status,
              );

            const matchesDoctor =
              !doctor ||
              surgery.doctor ===
                doctor;

            const matchesSearch =
              !query ||
              [
                surgery.patientName,
                surgery.mrn,
                surgery.procedure,
                surgery.doctor,
                surgery.room,
                surgery.id,
              ].some((value) =>
                String(
                  value || "",
                )
                  .toLowerCase()
                  .includes(query),
              );

            return (
              matchesDate &&
              matchesBoardStatus &&
              matchesDoctor &&
              matchesSearch
            );
          },
        ),
      );
    }, [
      surgeries,
      date,
      doctor,
      search,
    ]);

  const roomRows = useMemo(
    () =>
      rooms.filter(
        (room) =>
          scopedCases.some(
            (surgery) =>
              surgery.room ===
              room,
          ) ||
          !search,
      ),
    [
      rooms,
      scopedCases,
      search,
    ],
  );

  const scheduledCases =
    scopedCases.filter(
      (surgery) =>
        !isFinished(surgery),
    ).length;

  const upcomingReady =
    scopedCases.filter(
      (surgery) =>
        surgery.status ===
          "Pre-Op" ||
        surgery.status ===
          "Ready",
    ).length;

  const inProgress =
    scopedCases.filter(
      (surgery) =>
        surgery.status ===
        "In Progress",
    ).length;

  const conflictCases =
    scopedCases.filter(
      (surgery) =>
        conflictsFor(
          surgery,
          scopedCases,
        ).length > 0,
    );

  const rangeLabel =
    toDateLabel(date);

  const draggedSurgery =
    draggedSurgeryId
      ? surgeries.find(
          (surgery) =>
            surgery.id ===
            draggedSurgeryId,
        ) ?? null
      : null;

  
  return { scheduledCases, upcomingReady, inProgress, conflictCases, setDate, date, calendarRef, setCalendarOpen, calendarOpen, rangeLabel, calendarMonth, setCalendarMonth, surgeries, search, setSearch, doctorFilterRef, setDoctorFilterOpen, doctor, doctorFilterOpen, setDoctor, doctors, notice, boardExpanded, setBoardExpanded, scopedCases, roomRows, draggedSurgery, dragOverCell, setDraggedSurgeryId, setDragOverCell, setPendingMove, setEditing, pendingMove, updateSurgery, setNotice, editing, rooms };
}
