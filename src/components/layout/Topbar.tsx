import { useSurgeryStore } from "../../store/surgeryStore";
import {
  Activity,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  HeartPulse,
  ListOrdered,
  Search,
  Stethoscope,
  User,
  UserCheck,
  UsersRound,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
  type ComponentType,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

/* ============================================================
   TYPES
   ============================================================ */

type PageTone =
  | "amber"
  | "indigo"
  | "blue"
  | "violet"
  | "teal"
  | "cyan"
  | "rose"
  | "lime"
  | "fuchsia"
  | "slate";

type PageContext = {
  title: string;
  subtitle: string;
  tone: PageTone;
  icon: ComponentType<{
    size?: number;
    className?: string;
    strokeWidth?: number;
  }>;
};

type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
  path: string;
};

/* ============================================================
   SEARCH DATA
   ============================================================ */

/* ============================================================
   TOPBAR
   ============================================================ */

export function Topbar({ compact = false }: { compact?: boolean }) {
  const surgeries = useSurgeryStore((state) => state.surgeries);
  const clinicalItems: SearchItem[] = surgeries.map((surgery) => ({ id: surgery.id, title: surgery.patientName, subtitle: [surgery.id, surgery.patientId, surgery.procedure, surgery.doctor].join(" ? "), category: "Patient", icon: User, path: `/surgery/${encodeURIComponent(surgery.id)}` }));
  const navigate = useNavigate();
  const location = useLocation();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [now, setNow] = useState(() => new Date());

  const page = getPageContext(location.pathname);
  const tone = getToneStyle(page.tone);
  const PageIcon = page.icon;

  const filteredResults = clinicalItems.filter((item) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return true;
    }

    return [item.title, item.subtitle, item.category]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setIsSearchOpen((current) => !current);
        setSelectedIndex(0);
      }

      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    }

    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  function updateQuery(value: string) {
    setQuery(value);
    setSelectedIndex(0);
  }

  function handleInputKeyDown(
    event: ReactKeyboardEvent<HTMLInputElement>,
  ) {
    if (filteredResults.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setSelectedIndex(
        (current) => (current + 1) % filteredResults.length,
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setSelectedIndex(
        (current) =>
          (current - 1 + filteredResults.length) %
          filteredResults.length,
      );

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      const item = filteredResults[selectedIndex];

      if (item) {
        handleSelectItem(item.path);
      }
    }
  }

  function handleSelectItem(path: string) {
    navigate(path);
    setIsSearchOpen(false);
    updateQuery("");
  }


  const todayLabel = now.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const timeLabel = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <header className={compact ? "sidebar-utilities relative z-30 shrink-0 border-t border-slate-100 bg-white p-2" : "relative z-30 flex h-[58px] shrink-0 items-center border-b border-slate-200 bg-white px-3.5"}>
      {/* ====================================================== */}
      {/* PAGE CONTEXT                                           */}
      {/* ====================================================== */}

      <div className={compact ? "hidden" : "flex min-w-0 flex-1 items-center"}>
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] ${tone.iconBg} ${tone.iconText}`}
          >
            <PageIcon size={15} strokeWidth={2.1} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="truncate text-[13px] font-bold tracking-[-0.015em] text-slate-800">
                {page.title}
              </h1>

              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone.accent}`}
              />
            </div>

            <p className="mt-[1px] truncate text-[9px] font-medium text-slate-400">
              {page.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* TODAY + QUICK ACTIONS                                   */}
      {/* ====================================================== */}

      <div className={compact ? "flex flex-wrap justify-center gap-1" : "flex shrink-0 items-center gap-2.5"}>
        {/* Date / time */}
        <div className={compact ? "sidebar-clock mb-1 w-full text-center" : "hidden items-center whitespace-nowrap md:flex"}>
          <span className="text-[11.5px] font-semibold tracking-[-0.01em] text-slate-600">
            {todayLabel}
          </span>

          <span className="mx-2 text-[10px] text-slate-300">
            •
          </span>

          <span className="text-[13px] font-bold tracking-[-0.015em] text-slate-800">
            {timeLabel}
          </span>
        </div>

        <div className={compact ? "hidden" : "mx-0.5 hidden h-6 w-px bg-slate-200 md:block"} />

        {/* Search */}
        <button
          type="button"
          onClick={() => { setSelectedIndex(0); setIsSearchOpen(true); }}
          className={compact ? "hidden" : "group hidden h-9 w-[205px] items-center justify-between rounded-xl border border-slate-200 bg-white px-3 text-left transition hover:border-violet-200 hover:bg-violet-50/30 lg:flex"}
        >
          <div className="flex min-w-0 items-center gap-2">
            <Search
              size={14}
              className="shrink-0 text-slate-400 transition group-hover:text-violet-500"
            />

            <span className="truncate text-[9.5px] font-medium text-slate-400">
              Search clinical records
            </span>
          </div>

          <span className="ml-2 shrink-0 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[7.5px] font-semibold text-slate-400">
            Ctrl K
          </span>
        </button>

        <HeaderButton
          onClick={() => { setSelectedIndex(0); setIsSearchOpen(true); }}
          title="Search"
          className={compact ? "" : "lg:hidden"}
        >
          <Search size={15} />
        </HeaderButton>




      </div>

      {/* ====================================================== */}
      {/* SEARCH OVERLAY                                         */}
      {/* ====================================================== */}

      {isSearchOpen && (
        <>
          <button
            type="button"
            aria-label="Close search"
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[1.5px]"
          />

          <div className="fixed left-1/2 top-[78px] z-50 w-[min(560px,calc(100vw-28px))] -translate-x-1/2 overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
            {/* Search field */}

            <div className="border-b border-slate-100 p-3">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  autoFocus
                  value={query}
                  onChange={(event) => updateQuery(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Search patients, surgeries, case numbers or doctors..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-20 text-[10.5px] font-medium text-slate-700 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-50"
                />

                <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
                  {query && (
                    <button
                      type="button"
                      onClick={() => updateQuery("")}
                      className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 transition hover:bg-white hover:text-slate-600"
                    >
                      <X size={11} />
                    </button>
                  )}

                  <span className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[7.5px] font-semibold text-slate-400">
                    ESC
                  </span>
                </div>
              </div>
            </div>

            {/* Search heading */}

            <div className="flex items-center justify-between px-4 pb-1.5 pt-3">
              <div>
                <p className="text-[10px] font-bold text-slate-700">
                  Clinical Search
                </p>

                <p className="mt-0.5 text-[8.5px] text-slate-400">
                  Jump directly to a patient, surgery or doctor
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-2 py-1 text-[8px] font-semibold text-slate-500">
                {filteredResults.length} results
              </span>
            </div>

            {/* Results */}

            <div className="max-h-[330px] overflow-y-auto px-2.5 pb-2.5">
              {filteredResults.length === 0 ? (
                <div className="py-9 text-center">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                    <Search size={16} />
                  </div>

                  <p className="mt-2.5 text-[10px] font-semibold text-slate-600">
                    No records found
                  </p>

                  <p className="mt-1 text-[8.5px] text-slate-400">
                    Try another patient, doctor or case number
                  </p>
                </div>
              ) : (
                <ul className="space-y-1">
                  {filteredResults.map((item, index) => {
                    const Icon = item.icon;
                    const selected = index === selectedIndex;

                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onMouseEnter={() => setSelectedIndex(index)}
                          onClick={() => handleSelectItem(item.path)}
                          className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2.5 text-left transition ${
                            selected
                              ? "bg-violet-50/80"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                selected
                                  ? "bg-white text-violet-600 shadow-sm"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              <Icon size={13} />
                            </div>

                            <div className="min-w-0">
                              <p
                                className={`truncate text-[10px] font-semibold ${
                                  selected
                                    ? "text-violet-700"
                                    : "text-slate-700"
                                }`}
                              >
                                {item.title}
                              </p>

                              <p className="mt-0.5 truncate text-[8.5px] text-slate-400">
                                {item.subtitle}
                              </p>
                            </div>
                          </div>

                          <div className="ml-3 flex shrink-0 items-center gap-2">
                            <span className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[7.5px] font-semibold text-slate-500">
                              {item.category}
                            </span>

                            <ChevronRight
                              size={11}
                              className={
                                selected
                                  ? "text-violet-400"
                                  : "text-slate-300"
                              }
                            />
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Keyboard hint */}

            <div className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/70 px-4 py-2 text-[7.5px] font-medium text-slate-400">
              <span>↑↓ Navigate</span>
              <span>Enter Open</span>
              <span>Esc Close</span>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

/* ============================================================
   HEADER BUTTON
   ============================================================ */

function HeaderButton({
  children,
  onClick,
  title,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  title?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 ${className}`}
    >
      {children}
    </button>
  );
}

/* ============================================================
   PAGE CONTEXT
   ============================================================ */

function getPageContext(pathname: string): PageContext {
  if (pathname === "/" || pathname === "/dashboard") {
    return {
      title: "Dashboard",
      subtitle: "Surgery command center",
      tone: "slate",
      icon: Activity,
    };
  }

  if (
    pathname === "/reception" ||
    pathname.startsWith("/reception/") ||
    pathname === "/surgery-reception" ||
    pathname.startsWith("/surgery-reception/")
  ) {
    return {
      title: "Reception",
      subtitle: "Arrival & admission",
      tone: "amber",
      icon: UserCheck,
    };
  }

  if (
    pathname === "/cashier" ||
    pathname.startsWith("/cashier/")
  ) {
    return {
      title: "Cashier",
      subtitle: "Financial clearance & payment",
      tone: "indigo",
      icon: CreditCard,
    };
  }

  if (
    pathname === "/pre-op" ||
    pathname.startsWith("/pre-op/") ||
    pathname === "/preop" ||
    pathname.startsWith("/preop/")
  ) {
    return {
      title: "Pre-Op",
      subtitle: "Clinical preparation & anesthesia",
      tone: "blue",
      icon: ClipboardCheck,
    };
  }

  if (
    pathname === "/recovery" ||
    pathname.startsWith("/recovery/")
  ) {
    return {
      title: "Recovery",
      subtitle: "Post-anesthesia monitoring",
      tone: "teal",
      icon: HeartPulse,
    };
  }

  if (
    pathname === "/post-op" ||
    pathname.startsWith("/post-op/") ||
    pathname === "/postop" ||
    pathname.startsWith("/postop/")
  ) {
    return {
      title: "Post-Op",
      subtitle: "Follow-up & discharge planning",
      tone: "cyan",
      icon: Stethoscope,
    };
  }

  if (
    pathname === "/surgery" ||
    pathname.startsWith("/surgery/")
  ) {
    return {
      title: "Surgery",
      subtitle: "Operating room workflow",
      tone: "violet",
      icon: Activity,
    };
  }

  if (
    pathname === "/waiting-list" ||
    pathname.startsWith("/waiting-list/")
  ) {
    return {
      title: "Today",
      subtitle: "Unscheduled surgical cases",
      tone: "rose",
      icon: ListOrdered,
    };
  }

  if (pathname === "/planning") {
    return { title: "Planning", subtitle: "Daily room sequence & doctor itinerary", tone: "violet", icon: CalendarDays };
  }

  if (
    pathname === "/schedule" ||
    pathname.startsWith("/schedule/")
  ) {
    return {
      title: "Schedule",
      subtitle: "Surgical planning & operating rooms",
      tone: "lime",
      icon: CalendarDays,
    };
  }

  if (
    pathname === "/patients" ||
    pathname.startsWith("/patients/")
  ) {
    return {
      title: "Patients",
      subtitle: "Patient directory",
      tone: "fuchsia",
      icon: UsersRound,
    };
  }

  return {
    title: "SurgiFlow",
    subtitle: "Surgical care workspace",
    tone: "violet",
    icon: Activity,
  };
}

/* ============================================================
   TONES
   ============================================================ */

function getToneStyle(tone: PageTone) {
  const map = {
    amber: {
      accent: "bg-amber-500",
      iconBg: "bg-amber-50",
      iconText: "text-amber-600",
    },
    indigo: {
      accent: "bg-indigo-500",
      iconBg: "bg-indigo-50",
      iconText: "text-indigo-600",
    },
    blue: {
      accent: "bg-blue-500",
      iconBg: "bg-blue-50",
      iconText: "text-blue-600",
    },
    violet: {
      accent: "bg-violet-500",
      iconBg: "bg-violet-50",
      iconText: "text-violet-600",
    },
    teal: {
      accent: "bg-teal-500",
      iconBg: "bg-teal-50",
      iconText: "text-teal-600",
    },
    cyan: {
      accent: "bg-cyan-500",
      iconBg: "bg-cyan-50",
      iconText: "text-cyan-600",
    },
    rose: {
      accent: "bg-rose-500",
      iconBg: "bg-rose-50",
      iconText: "text-rose-600",
    },
    lime: {
      accent: "bg-lime-500",
      iconBg: "bg-lime-50",
      iconText: "text-lime-700",
    },
    fuchsia: {
      accent: "bg-fuchsia-500",
      iconBg: "bg-fuchsia-50",
      iconText: "text-fuchsia-600",
    },
    slate: {
      accent: "bg-slate-400",
      iconBg: "bg-slate-100",
      iconText: "text-slate-600",
    },
  };

  return map[tone];
}
