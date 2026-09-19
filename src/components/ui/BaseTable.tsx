import type { ReactNode } from "react";

type BaseTableProps = {
  headers: string[];
  children: ReactNode;
  minWidth?: string;
};

export function BaseTable({
  headers,
  children,
  minWidth = "900px",
}: BaseTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className="w-full border-collapse"
        style={{ minWidth }}
      >
        <thead>
          <tr className="border-b border-[#E4E7EC] bg-[#F8FAFC]">
            {headers.map((header, index) => (
              <th
                key={`${header}-${index}`}
                className="
                  whitespace-nowrap
                  px-4
                  py-2.5
                  text-left
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.04em]
                  text-[#667085]
                "
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-[#F0F2F5]">
          {children}
        </tbody>
      </table>
    </div>
  );
}

type TableRowProps = {
  children: ReactNode;
  onClick?: () => void;
};

export function TableRow({
  children,
  onClick,
}: TableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={`
        group
        h-[52px]
        bg-white
        transition-colors
        hover:bg-[#F8FBFE]
        ${onClick ? "cursor-pointer" : ""}
      `}
    >
      {children}
    </tr>
  );
}

type TableCellProps = {
  children: ReactNode;
  className?: string;
};

export function TableCell({
  children,
  className = "",
}: TableCellProps) {
  return (
    <td
      className={`
        whitespace-nowrap
        px-4
        py-2.5
        text-[10px]
        text-[#475467]
        ${className}
      `}
    >
      {children}
    </td>
  );
}