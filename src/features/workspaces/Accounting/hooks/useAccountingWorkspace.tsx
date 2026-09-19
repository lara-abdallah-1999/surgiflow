import { useEffect,useMemo,useRef,useState } from "react";
import { useLocation,useNavigate,useSearchParams } from "react-router-dom";
import { useTablePageSize } from "../../../../hooks/useTablePageSize";
import { useSurgeryStore } from "../../../../store/surgeryStore";
import { ROW_HEIGHT } from "../config";
import { type Period,type SortDirection,type SortKey,type ToastState } from "../types";
import { getPatientMrn,getSortValue,getSurgeryProcedures,isDateInPeriod } from "../utils";

export function useAccountingWorkspace() {
  const location = useLocation();
  const navigate = useNavigate();
  const [caseParams, setCaseParams] = useSearchParams();

  const incomingHighlightId = caseParams.get("case") ??
    (
      location.state as
        | { highlightSurgeryId?: string }
        | null
    )?.highlightSurgeryId ?? null;

  const highlightHandledRef = useRef<string | null>(null);

  const [highlightedRowId, setHighlightedRowId] =
    useState<string | null>(null);

  const surgeries = useSurgeryStore(
    (state) => state.surgeries,
  );

  const recordPayment = useSurgeryStore(
    (state) => state.recordPayment,
  );

  const [search, setSearch] = useState("");

  const directCase = surgeries.find((item) => item.id === incomingHighlightId);
  const selectedId = directCase && directCase.paymentStatus !== "Paid" ? directCase.id : null;
  const receiptId = directCase?.paymentStatus === "Paid" ? directCase.id : null;

  function selectCasePanel(id: string | null, panel?: string) {
    setCaseParams((previous) => {
      const next = new URLSearchParams(previous);
      if (id) next.set("case", id);
      if (panel) next.set("panel", panel); else next.delete("panel");
      return next;
    });
  }

  const [amountDraft, setAmountDraft] = useState({ caseId: selectedId, value: "" });
  const amount = amountDraft.caseId === selectedId ? amountDraft.value : "";
  function setAmount(value: string) {
    setAmountDraft({ caseId: selectedId, value });
  }

  const [filterOpen, setFilterOpen] =
    useState(false);

  const filterRef = useRef<HTMLDivElement | null>(null);

  const [selectedDoctors, setSelectedDoctors] =
    useState<string[]>([]);

  const [
    selectedPaymentStatuses,
    setSelectedPaymentStatuses,
  ] = useState<string[]>([]);

  const [period, setPeriod] =
    useState<Period>("Day");

  const [selectedDate, setSelectedDate] =
    useState("2026-09-03");

  const [sortKey, setSortKey] =
    useState<SortKey>("date");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const [page, setPage] = useState(0);

  const rowsContainerRef =
    useRef<HTMLDivElement | null>(null);
  const pageSize = useTablePageSize(rowsContainerRef, ROW_HEIGHT);

  

  const [toast, setToast] =
    useState<ToastState>(null);

  const doctors = useMemo(
    () =>
      Array.from(
        new Set(
          surgeries.map(
            (surgery) => surgery.doctor,
          ),
        ),
      ),
    [surgeries],
  );

  const paymentStatuses = useMemo(
    () =>
      Array.from(
        new Set(
          surgeries.map(
            (surgery) =>
              surgery.paymentStatus,
          ),
        ),
      ),
    [surgeries],
  );

  const filtered = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return surgeries.filter((surgery) => {
      const mrn =
        getPatientMrn(surgery);

      const procedures =
        getSurgeryProcedures(surgery);

      const matchesSearch =
        !query ||
        surgery.patientName
          .toLowerCase()
          .includes(query) ||
        mrn
          .toLowerCase()
          .includes(query) ||
        procedures.some((procedure) =>
          procedure
            .name
            .toLowerCase()
            .includes(query),
        );

      const matchesDoctor =
        selectedDoctors.length === 0 ||
        selectedDoctors.includes(
          surgery.doctor,
        );

      const matchesPaymentStatus =
        selectedPaymentStatuses.length ===
          0 ||
        selectedPaymentStatuses.includes(
          surgery.paymentStatus,
        );

      const matchesDate = isDateInPeriod(
        surgery.date,
        selectedDate,
        period,
      );

      return (
        matchesSearch &&
        matchesDoctor &&
        matchesPaymentStatus &&
        matchesDate
      );
    });
  }, [
    surgeries,
    search,
    selectedDoctors,
    selectedPaymentStatuses,
    selectedDate,
    period,
  ]);

  const sorted = useMemo(() => {
    const copy = [...filtered];

    copy.sort((a, b) => {
      const left =
        getSortValue(a, sortKey);

      const right =
        getSortValue(b, sortKey);

      let result = 0;

      if (
        typeof left === "number" &&
        typeof right === "number"
      ) {
        result = left - right;
      } else {
        result = String(left).localeCompare(
          String(right),
          undefined,
          {
            numeric: true,
            sensitivity: "base",
          },
        );
      }

      return sortDirection === "asc"
        ? result
        : -result;
    });

    return copy;
  }, [
    filtered,
    sortKey,
    sortDirection,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      sorted.length / pageSize,
    ),
  );

  const visibleRows = useMemo(
    () =>
      sorted.slice(
        page * pageSize,
        page * pageSize + pageSize,
      ),
    [sorted, page, pageSize],
  );

  useEffect(() => {
    if (
      !incomingHighlightId ||
      highlightHandledRef.current === incomingHighlightId
    ) {
      return;
    }

    const target = surgeries.find(
      (surgery) => surgery.id === incomingHighlightId,
    );

    if (!target) return;

    highlightHandledRef.current = incomingHighlightId;

    /*
     * Make sure the transferred patient is visible even if the
     * Accounting page had filters left over from a previous visit.
     */
    setSearch("");
    setSelectedDoctors([]);
    setSelectedPaymentStatuses([]);
    setPeriod("Day");
    setSelectedDate(target.date);
    setHighlightedRowId(incomingHighlightId);

    const timeout = window.setTimeout(() => {
      setHighlightedRowId(null);
    }, 3500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [incomingHighlightId, surgeries]);

  useEffect(() => {
    if (!highlightedRowId) return;

    const rowIndex = sorted.findIndex(
      (surgery) => surgery.id === highlightedRowId,
    );

    if (rowIndex >= 0) {
      setPage(Math.floor(rowIndex / pageSize));
    }
  }, [highlightedRowId, sorted, pageSize]);

  const selected = surgeries.find(
    (surgery) =>
      surgery.id === selectedId,
  );


  const paidCount = surgeries.filter(
    (surgery) =>
      surgery.paymentStatus === "Paid",
  ).length;

  const pendingCount = surgeries.filter(
    (surgery) =>
      surgery.paymentStatus === "Pending",
  ).length;

  const partialCount = surgeries.filter(
    (surgery) =>
      surgery.paymentStatus ===
      "Partially Paid",
  ).length;

  const arrivedCount = surgeries.filter(
    (surgery) =>
      Boolean(surgery.arrivedAt),
  ).length;


  const activeFilterCount =
    selectedDoctors.length +
    selectedPaymentStatuses.length +
    (period !== "Day" ? 1 : 0);

  

  useEffect(() => {
    setPage(0);
  }, [
    search,
    selectedDoctors,
    selectedPaymentStatuses,
    selectedDate,
    period,
  ]);

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(
        Math.max(
          0,
          totalPages - 1,
        ),
      );
    }
  }, [
    page,
    totalPages,
  ]);

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key !== "Escape") {
        return;
      }

      if (selectedId) {
        closePanel();
      }

      if (receiptId) {
        closeReceipt();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [selectedId, receiptId]);

  useEffect(() => {
    if (!filterOpen) return;

    function handleMouseDown(event: MouseEvent) {
      const target = event.target as Node | null;

      if (
        target &&
        filterRef.current &&
        !filterRef.current.contains(target)
      ) {
        setFilterOpen(false);
      }
    }

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [filterOpen]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(
      () => setToast(null),
      3500,
    );

    return () =>
      window.clearTimeout(timer);
  }, [toast]);

  function showToast(
    type: "success" | "error",
    title: string,
    message: string,
  ) {
    setToast({
      type,
      title,
      message,
    });
  }

  function handleSort(
    key: SortKey,
  ) {
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

  function toggleDoctor(
    doctor: string,
  ) {
    setSelectedDoctors((current) =>
      current.includes(doctor)
        ? current.filter(
            (item) =>
              item !== doctor,
          )
        : [
            ...current,
            doctor,
          ],
    );
  }

  function togglePaymentStatus(
    status: string,
  ) {
    setSelectedPaymentStatuses(
      (current) =>
        current.includes(status)
          ? current.filter(
              (item) =>
                item !== status,
            )
          : [
              ...current,
              status,
            ],
    );
  }

  function clearFilters() {
    setSelectedDoctors([]);
    setSelectedPaymentStatuses([]);
    setPeriod("Day");
    setSelectedDate(
      "2026-09-03",
    );
  }

  function openPayment(
    surgeryId: string,
  ) {
    selectCasePanel(surgeryId, "payment");
    setAmount("");
  }

  function openReceipt(
    surgeryId: string,
  ) {
    selectCasePanel(surgeryId, "receipt");
  }

  function closeReceipt() {
    selectCasePanel(null);
  }

  function closePanel() {
    selectCasePanel(null);
    setAmount("");
  }

  function submitPayment() {
    if (!selected) {
      showToast(
        "error",
        "Payment not processed",
        "No patient is selected.",
      );
      return;
    }

    const value = Number(amount);

    const remaining =
      selected.cost -
      selected.paidAmount;

    if (
      !amount ||
      Number.isNaN(value)
    ) {
      showToast(
        "error",
        "Invalid payment",
        "Enter a valid payment amount.",
      );
      return;
    }

    if (value <= 0) {
      showToast(
        "error",
        "Invalid payment",
        "Payment amount must be greater than zero.",
      );
      return;
    }

    if (value > remaining) {
      showToast(
        "error",
        "Payment exceeds balance",
        `Maximum allowed payment is $${remaining.toLocaleString()}.`,
      );
      return;
    }

    try {
      const patientName =
        selected.patientName;

      recordPayment(
        selected.id,
        value,
      );

      setAmount("");

      showToast(
        "success",
        "Payment completed",
        `$${value.toLocaleString()} was recorded successfully for ${patientName}.`,
      );
    } catch {
      showToast(
        "error",
        "Payment failed",
        "Something went wrong while recording the payment. Please try again.",
      );
    }
  }

  
  return { directCase, amount, setAmount, submitPayment, navigate, toast, setToast, paidCount, pendingCount, partialCount, arrivedCount, search, setSearch, filterRef, setFilterOpen, filterOpen, activeFilterCount, clearFilters, doctors, selectedDoctors, toggleDoctor, paymentStatuses, selectedPaymentStatuses, togglePaymentStatus, setPeriod, period, selectedDate, setSelectedDate, setPage, sortKey, sortDirection, handleSort, rowsContainerRef, visibleRows, selectedId, highlightedRowId, openPayment, openReceipt, sorted, page, pageSize, totalPages };
}
