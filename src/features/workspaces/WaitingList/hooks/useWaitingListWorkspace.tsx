import { useEffect,useMemo,useRef,useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTablePageSize } from "../../../../hooks/useTablePageSize";
import { useSurgeryStore } from "../../../../store/surgeryStore";
import { ROW_HEIGHT,availability } from "../config";
import { type SortDirection,type SortKey } from "../types";
import { buildWhatsAppBookingMessage,getPatientMrn,getPatientPhone,getProcedureItems,normalizeWhatsAppPhone } from "../utils";

export function useWaitingListWorkspace() {
  const navigate = useNavigate();
  const surgeries = useSurgeryStore(
    (state) => state.surgeries
  );

  const updateSurgery = useSurgeryStore(
    (state) => state.updateSurgery
  );

  const [doctor, setDoctor] =
    useState("All Doctors");

  const [priority, setPriority] =
    useState("All");

  const [search, setSearch] =
    useState("");

  const [page, setPage] = useState(0);
  

  const [filterOpen, setFilterOpen] =
    useState(false);

  const [sortKey, setSortKey] =
    useState<SortKey>("patient");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const filterRef =
    useRef<HTMLDivElement | null>(null);

  const rowsContainerRef =
    useRef<HTMLDivElement | null>(null);
  const pageSize = useTablePageSize(rowsContainerRef, ROW_HEIGHT);

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [selectedDate, setSelectedDate] =
    useState("2026-09-03");

  const [selectedTime, setSelectedTime] =
    useState<string | null>(null);

  const waitingSurgeries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return surgeries.filter((surgery) => {
      const doctorMatch =
        doctor === "All Doctors" ||
        surgery.doctor === doctor;

      const priorityMatch =
        priority === "All" ||
        surgery.priority === priority;

      const procedures = getProcedureItems(
        surgery,
      )
        .map((item) =>
          `${item.name} ${item.site ?? ""}`,
        )
        .join(" ")
        .toLowerCase();

      const searchMatch =
        !query ||
        surgery.patientName
          .toLowerCase()
          .includes(query) ||
        surgery.id
          .toLowerCase()
          .includes(query) ||
        getPatientMrn(surgery)
          .toLowerCase()
          .includes(query) ||
        getPatientPhone(surgery)
          .toLowerCase()
          .includes(query) ||
        surgery.doctor
          .toLowerCase()
          .includes(query) ||
        procedures.includes(query);

      return (
        doctorMatch &&
        priorityMatch &&
        searchMatch &&
        surgery.status === "Today"
      );
    });
  }, [
    surgeries,
    doctor,
    priority,
    search,
  ]);

  const sortedSurgeries = useMemo(() => {
    const copy = [...waitingSurgeries];

    copy.sort((a, b) => {
      const getValue = (
        surgery: (typeof copy)[number],
      ) => {
        switch (sortKey) {
          case "patient":
            return surgery.patientName;
          case "case":
            return surgery.id;
          case "mrn":
            return getPatientMrn(surgery);
          case "number":
            return getPatientPhone(surgery);
          case "procedure":
            return (
              getProcedureItems(surgery)[0]
                ?.name ?? ""
            );
          case "doctor":
            return surgery.doctor;
          case "priority":
            return surgery.priority;
          default:
            return "";
        }
      };

      const result = String(
        getValue(a),
      ).localeCompare(
        String(getValue(b)),
        undefined,
        {
          numeric: true,
          sensitivity: "base",
        },
      );

      return sortDirection === "asc"
        ? result
        : -result;
    });

    return copy;
  }, [
    waitingSurgeries,
    sortKey,
    sortDirection,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      sortedSurgeries.length / pageSize,
    ),
  );

  const visibleSurgeries = useMemo(
    () =>
      sortedSurgeries.slice(
        page * pageSize,
        page * pageSize + pageSize,
      ),
    [sortedSurgeries, page, pageSize],
  );

  

  useEffect(() => {
    setPage(0);
  }, [search, doctor, priority]);

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(
        Math.max(0, totalPages - 1),
      );
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (!filterOpen) return;

    function handleOutsideClick(
      event: MouseEvent,
    ) {
      const target =
        event.target as Node | null;

      if (
        target &&
        filterRef.current &&
        !filterRef.current.contains(target)
      ) {
        setFilterOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
  }, [filterOpen]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((current) =>
        current === "asc"
          ? "desc"
          : "asc",
      );
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  }

  const selectedSurgery =
    surgeries.find(
      (surgery) => surgery.id === selectedId
    );

  const availableTimes =
    selectedSurgery
      ? availability[
          selectedSurgery.doctor
        ]?.[selectedDate] ?? []
      : [];

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedId(null);
        setSelectedTime(null);
      }
    }

    if (selectedSurgery) {
      document.addEventListener(
        "keydown",
        handleEscape
      );
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [selectedSurgery]);

  function closeModal() {
    setSelectedId(null);
    setSelectedTime(null);
  }

  function confirmBooking() {
    if (!selectedSurgery) {
      toast.error(
        "Unable to book surgery. Please select a patient.",
      );
      return;
    }

    if (!selectedTime) {
      toast.error(
        "Please select an available surgery time.",
      );
      return;
    }

    try {
      const phone = getPatientPhone(
        selectedSurgery,
      );

      const bookingMessage =
        buildWhatsAppBookingMessage({
          surgery: selectedSurgery,
          date: selectedDate,
          time: selectedTime,
        });

      updateSurgery(selectedSurgery.id, {
        date: selectedDate,
        time: selectedTime,
        status: "Booked",
      });

      if (phone) {
        const whatsappPhone =
          normalizeWhatsAppPhone(phone);

        const whatsappUrl =
          `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
            bookingMessage,
          )}`;

        window.open(
          whatsappUrl,
          "_blank",
          "noopener,noreferrer",
        );
      }

      closeModal();

      navigate("/reception", {
        state: {
          highlightSurgeryId: selectedSurgery.id,
          receptionToast: {
            type: "success",
            title: "Surgery booked successfully",
            message: `${selectedSurgery.patientName} was moved to Reception.`,
          },
        },
      });
    } catch (error) {
      console.error(
        "Unable to book surgery:",
        error,
      );

      toast.error(
        "Unable to book the surgery. Please try again.",
      );
    }
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  
  return { surgeries, waitingSurgeries, search, setSearch, filterRef, setFilterOpen, filterOpen, doctor, priority, setDoctor, setPriority, sortKey, sortDirection, handleSort, rowsContainerRef, visibleSurgeries, selectedId, setSelectedId, getInitials, sortedSurgeries, page, pageSize, setPage, totalPages, selectedSurgery, closeModal, selectedDate, setSelectedDate, setSelectedTime, availableTimes, selectedTime, confirmBooking };
}
