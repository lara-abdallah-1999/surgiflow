



export function FormInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (
    value: string,
  ) => void;
  placeholder: string;
}) {
  return (
    <input
      value={value}
      onChange={(event) =>
        onChange(
          event.target.value,
        )
      }
      placeholder={placeholder}
      className="h-7 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-2.5 !text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-50"
    />
  );
}
