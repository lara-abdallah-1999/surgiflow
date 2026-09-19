import { type Period } from "./types";


export function isPatientDateInPeriod(
  surgeryDate: string,
  selectedDate: string,
  period: Period,
) {
  const caseDate = new Date(
    surgeryDate.length === 10
      ? `${surgeryDate}T00:00:00`
      : surgeryDate,
  );

  const anchorDate = new Date(
    `${selectedDate}T00:00:00`,
  );

  if (
    Number.isNaN(
      caseDate.getTime(),
    ) ||
    Number.isNaN(
      anchorDate.getTime(),
    )
  ) {
    return false;
  }

  caseDate.setHours(
    0,
    0,
    0,
    0,
  );

  anchorDate.setHours(
    0,
    0,
    0,
    0,
  );

  if (period === "Day") {
    return (
      caseDate.getFullYear() ===
        anchorDate.getFullYear() &&
      caseDate.getMonth() ===
        anchorDate.getMonth() &&
      caseDate.getDate() ===
        anchorDate.getDate()
    );
  }

  if (period === "Week") {
    const start = new Date(
      anchorDate,
    );

    const day =
      start.getDay();

    const mondayOffset =
      day === 0
        ? -6
        : 1 - day;

    start.setDate(
      start.getDate() +
        mondayOffset,
    );

    const end =
      new Date(start);

    end.setDate(
      end.getDate() + 6,
    );

    end.setHours(
      23,
      59,
      59,
      999,
    );

    return (
      caseDate >= start &&
      caseDate <= end
    );
  }

  return (
    caseDate.getFullYear() ===
      anchorDate.getFullYear() &&
    caseDate.getMonth() ===
      anchorDate.getMonth()
  );
}
