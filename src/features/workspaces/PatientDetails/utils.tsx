


export function getCompletedStageCount(
  status: string,
) {
  switch (status) {
    case "Today":
      return 0;

    case "Booked":
    case "Confirmed":
      return 2;

    case "Patient Arrived":
    case "Reception":
      return 3;

    case "Payment Pending":
      return 3;

    case "Pre-Op":
      return 4;

    case "Ready":
      return 6;

    case "In Surgery":
    case "In Progress":
      return 6;

    case "Completed":
      return 7;

    case "Recovery":
      return 7;

    case "Follow-up":
      return 8;

    case "Discharged":
      return 10;

    default:
      return 0;
  }
}
