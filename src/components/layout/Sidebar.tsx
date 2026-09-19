import { useSelectedCase } from "../../features/patient-context/useSelectedCase";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { getCaseJourney, type JourneyState } from "../../features/patient-context/caseContext";
import {
  Activity,
  CheckCircle2,
  Circle,
  CircleDot,
  CalendarDays,
  CalendarHeart,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Stethoscope,
  UserCheck,
  UsersRound,
} from "lucide-react";

import {
  useState,
  type ComponentType,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

type SignatureTone =
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

type NavItem = {
  label: string;
  path: string;
  icon: ComponentType<{
    strokeWidth?: number;
    size?: number;
    className?: string;
  }>;
  tone: SignatureTone;
  subtitle?: string;
  matches?: string[];
};

type NavSection = {
  label?: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      {
        label: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
        tone: "slate",
        subtitle: "Surgery command center",
        matches: ["/", "/dashboard"],
      },
    ],
  },
  {
    label: "Planning",
    items: [
      {
        label: "Schedule",
        path: "/schedule",
        icon: CalendarDays,
        tone: "lime",
        subtitle: "Operating schedule",
      },
      {
        label: "Planning",
        path: "/planning",
        icon: CalendarHeart,
        tone: "violet",
        subtitle: "Daily room sequence",
      },
      {
        label: "Today",
        path: "/waiting-list",
        icon: ListOrdered,
        tone: "rose",
        subtitle: "Unscheduled surgical cases",
      },
      {
        label: "Patients",
        path: "/patients",
        icon: UsersRound,
        tone: "fuchsia",
        subtitle: "Patient directory",
      },
    ],
  },
  {
    label: "Surgical Journey",
    items: [
      {
        label: "Reception",
        path: "/reception",
        icon: UserCheck,
        tone: "amber",
        subtitle: "Arrival & admission",
        matches: ["/reception", "/surgery-reception"],
      },
      {
        label: "Cashier",
        path: "/accounting",
        icon: CreditCard,
        tone: "indigo",
        subtitle: "Financial clearance",
      },
      {
        label: "Pre-Op",
        path: "/pre-op",
        icon: ClipboardCheck,
        tone: "blue",
        subtitle: "Clinical preparation",
        matches: ["/pre-op", "/preop"],
      },
      {
        label: "Surgery",
        path: "/surgery",
        icon: Activity,
        tone: "violet",
        subtitle: "Operating room",
      },
      // {
      //   label: "Recovery",
      //   path: "/recovery",
      //   icon: HeartPulse,
      //   tone: "teal",
      //   subtitle: "Post-anesthesia care",
      // },
      {
        label: "Post-Op",
        path: "/post-op",
        icon: Stethoscope,
        tone: "cyan",
        subtitle: "Follow-up & discharge",
        matches: ["/post-op", "/postop"],
      },
    ],
  },
];



export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const compact = useMediaQuery("(max-width: 1279px)");
  const [expandedOnCompact, setExpandedOnCompact] = useState(false);
  const [collapsedOnDesktop, setCollapsedOnDesktop] = useState(false);
  const collapsed = compact ? !expandedOnCompact : collapsedOnDesktop;
  const setCollapsed = (value: boolean) => compact ? setExpandedOnCompact(!value) : setCollapsedOnDesktop(value);
  const surgery = useSelectedCase();
  const journey = surgery ? getCaseJourney(surgery) : [];

  return (
    <aside
      data-collapsed={collapsed}
      data-overlay={compact && !collapsed}
      className={`app-sidebar relative flex h-dvh max-h-dvh shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white transition-[width] duration-300 ${
        collapsed ? "w-[72px]" : "w-[228px]"
      }`}
    >
      <div className="flex h-[54px] shrink-0 items-center gap-1.5 border-b border-slate-200 px-2.5">
        {collapsed ? (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
            aria-expanded={false}
            title="Expand sidebar"
            className="sidebar-expand relative mx-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            <span className="sidebar-collapsed-logo absolute inset-0 flex items-center justify-center rounded-[10px] bg-violet-600 text-white shadow-[0_5px_14px_rgba(124,58,237,0.22)] transition-opacity">
              <Activity size={16} strokeWidth={2.3} />
            </span>
            <span className="sidebar-expand-icon absolute inset-0 flex items-center justify-center rounded-[10px] border border-slate-200 bg-white text-violet-600 opacity-0 transition-opacity">
              <ChevronRight size={16} />
            </span>
          </button>
        ) : (
          <>
            <button type="button" onClick={() => navigate("/")} aria-label="SurgiFlow dashboard" className="flex min-w-0 flex-1 items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-violet-600 text-white shadow-[0_5px_14px_rgba(124,58,237,0.22)]"><Activity size={16} strokeWidth={2.3} /></span>
              <div className="min-w-0 text-left">
                <p className="truncate text-[13px] font-bold tracking-[-0.02em] text-slate-800">SurgiFlow</p>
                <p className="mt-0.5 truncate text-[8.5px] font-semibold uppercase tracking-[0.12em] text-slate-400" title="Surgical Care Workspace">Surgical Care Workspace</p>
              </div>
            </button>
            <button type="button" onClick={() => setCollapsed(true)} aria-label="Collapse sidebar" aria-expanded={true} title="Collapse sidebar" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-violet-600">
              <ChevronLeft size={12} />
            </button>
          </>
        )}
      </div>

      <div className="sidebar-navigation min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-2 py-1">
        <div className="flex min-h-full flex-col gap-1.5">
          {NAV_SECTIONS.filter((section) => section.label !== "Surgical Journey" || surgery).map((section, sectionIndex) => (
            <section key={section.label ?? `section-${sectionIndex}`}>
              {section.label && !collapsed && (
                <div className="sidebar-label mb-1 flex items-center gap-2 px-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    {section.label}
                  </span>
                  <span className="h-px flex-1 bg-slate-100" />
                </div>
              )}

              {section.label && collapsed && (
                <div className="mx-auto mb-1.5 h-px w-7 bg-slate-100" />
              )}

              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <SidebarItem
                    key={item.label}
                    item={item}
                    collapsed={collapsed}
                    active={isActiveRoute(location.pathname, item)}
                    journeyState={section.label === "Surgical Journey" ? journey.find((step) => step.label === item.label)?.state : undefined}
                    onClick={() => {
                      navigate(section.label === "Surgical Journey" ? journey.find((step) => step.label === item.label)?.path ?? item.path : item.path);
                      setExpandedOnCompact(false);
                    }}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* <Topbar compact /> */}
      <div className="shrink-0 border-t border-slate-100 p-2">
        <div
          className={`flex h-[42px] items-center rounded-xl border border-slate-100 bg-slate-50/70 ${
            collapsed ? "justify-center px-1" : "gap-2 px-1.5"
          }`}
        >
          {!collapsed && (
            <div className="sidebar-label flex min-w-0 flex-1 items-center gap-2 px-0.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[8px] font-bold text-slate-600 shadow-sm">
                LA
              </div>

              <div className="min-w-0">
                <p className="truncate text-[10px] font-bold text-slate-700">
                  Lara Abdallah
                </p>
                <p className="mt-0.5 truncate text-[8.5px] text-slate-400">
                  Clinical System
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => console.log("Logging out...")}
            aria-label="Logout"
            title="Logout"
            className="mx-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-violet-600"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({
  item,
  active,
  collapsed,
  onClick,
  journeyState,
}: {
  journeyState?: JourneyState;
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  const style = getToneStyle(item.tone);

  return (
    <div className="group/item relative">
      <button
        type="button"
        onClick={onClick}
        aria-label={item.label + (journeyState ? ": " + journeyState : "")}
        aria-current={active ? "page" : undefined}
        title={item.label + (journeyState ? ": " + journeyState : "")}
        className={`relative flex h-[40px] w-full items-center rounded-xl transition ${
          collapsed ? "justify-center px-0" : "gap-2.5 px-2"
        } ${active ? style.activeBg : "hover:bg-slate-50"}`}
      >
        {active && (
          <span
            className={`absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full ${style.accent}`}
          />
        )}

        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${
            active
              ? `${style.iconBg} ${style.iconText}`
              : item.tone === "slate"
                ? "bg-slate-100 text-slate-400 group-hover/item:text-slate-600"
                : `${style.softBg} ${style.softText}`
          }`}
        >
          {journeyState === "complete" ? <CheckCircle2 size={17} className="text-emerald-500" /> : journeyState === "current" ? <CircleDot size={17} className="text-violet-600" /> : journeyState === "pending" ? <Circle size={17} className="text-slate-400" /> : <Icon size={14} strokeWidth={2} />}
        </div>

        {!collapsed && (
          <>
            <div className="sidebar-label min-w-0 flex-1 text-left">
              <p
                className={`truncate text-[11px] font-semibold transition ${
                  active
                    ? style.text
                    : "text-slate-600 group-hover/item:text-slate-800"
                }`}
              >
                {item.label}
              </p>

              {item.subtitle && (
                <p className="mt-0.5 truncate text-[8.5px] text-slate-400">
                  {item.subtitle}
                </p>
              )}
            </div>

            {active && (
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.accent}`}
              />
            )}
          </>
        )}
      </button>

      {collapsed && (
        <div className="pointer-events-none invisible absolute left-[calc(100%+8px)] top-1/2 z-[100] w-[175px] -translate-y-1/2 translate-x-1 rounded-xl border border-slate-200 bg-white p-2.5 opacity-0 shadow-[0_12px_30px_rgba(15,23,42,0.14)] transition-all group-hover/item:visible group-hover/item:translate-x-0 group-hover/item:opacity-100">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${style.iconBg} ${style.iconText}`}
            >
              <Icon size={12} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[10.5px] font-bold text-slate-700">
                {item.label}
              </p>

              {item.subtitle && (
                <p className="mt-0.5 text-[9px] leading-3.5 text-slate-400">
                  {item.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function isActiveRoute(pathname: string, item: NavItem) {
  const paths = item.matches ?? [item.path];

  if (item.label === "Dashboard") {
    return paths.includes(pathname);
  }

  if (item.label === "Surgery") {
    return pathname === "/surgery" || pathname.startsWith("/surgery/");
  }

  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function getToneStyle(tone: SignatureTone) {
  const styles = {
    amber: {
      activeBg: "bg-amber-50/70",
      iconBg: "bg-amber-100",
      iconText: "text-amber-700",
      softBg: "bg-amber-50/55",
      softText: "text-amber-500",
      text: "text-amber-700",
      accent: "bg-amber-500",
    },
    indigo: {
      activeBg: "bg-indigo-50/70",
      iconBg: "bg-indigo-100",
      iconText: "text-indigo-700",
      softBg: "bg-indigo-50/55",
      softText: "text-indigo-500",
      text: "text-indigo-700",
      accent: "bg-indigo-500",
    },
    blue: {
      activeBg: "bg-blue-50/70",
      iconBg: "bg-blue-100",
      iconText: "text-blue-700",
      softBg: "bg-blue-50/55",
      softText: "text-blue-500",
      text: "text-blue-700",
      accent: "bg-blue-500",
    },
    violet: {
      activeBg: "bg-violet-50/70",
      iconBg: "bg-violet-100",
      iconText: "text-violet-700",
      softBg: "bg-violet-50/55",
      softText: "text-violet-500",
      text: "text-violet-700",
      accent: "bg-violet-500",
    },
    teal: {
      activeBg: "bg-teal-50/70",
      iconBg: "bg-teal-100",
      iconText: "text-teal-700",
      softBg: "bg-teal-50/55",
      softText: "text-teal-500",
      text: "text-teal-700",
      accent: "bg-teal-500",
    },
    cyan: {
      activeBg: "bg-cyan-50/70",
      iconBg: "bg-cyan-100",
      iconText: "text-cyan-700",
      softBg: "bg-cyan-50/55",
      softText: "text-cyan-500",
      text: "text-cyan-700",
      accent: "bg-cyan-500",
    },
    rose: {
      activeBg: "bg-rose-50/70",
      iconBg: "bg-rose-100",
      iconText: "text-rose-700",
      softBg: "bg-rose-50/55",
      softText: "text-rose-500",
      text: "text-rose-700",
      accent: "bg-rose-500",
    },
    lime: {
      activeBg: "bg-lime-50/80",
      iconBg: "bg-lime-100",
      iconText: "text-lime-700",
      softBg: "bg-lime-50/70",
      softText: "text-lime-600",
      text: "text-lime-700",
      accent: "bg-lime-500",
    },
    fuchsia: {
      activeBg: "bg-fuchsia-50/75",
      iconBg: "bg-fuchsia-100",
      iconText: "text-fuchsia-700",
      softBg: "bg-fuchsia-50/60",
      softText: "text-fuchsia-500",
      text: "text-fuchsia-700",
      accent: "bg-fuchsia-500",
    },
    slate: {
      activeBg: "bg-slate-100",
      iconBg: "bg-slate-200",
      iconText: "text-slate-700",
      softBg: "bg-slate-100",
      softText: "text-slate-500",
      text: "text-slate-700",
      accent: "bg-slate-500",
    },
  };

  return styles[tone];
}
