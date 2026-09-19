import { type FollowUpOrder } from "../types";
import { ClinicalAddForm } from "./ClinicalAddForm";
import { FlaskConical } from "lucide-react";
import { RequiredLabel } from "./RequiredLabel";
import { FormInput } from "./FormInput";
import { ModernPostOpDatePicker } from "./ModernPostOpDatePicker";
import { formatDateInput } from "../utils";



export function OrderForm({
  value,
  onChange,
  onCancel,
  onSave,
}: {
  value: {
    type: FollowUpOrder["type"];
    name: string;
    dueDate: string;
  };
  onChange: React.Dispatch<
    React.SetStateAction<{
      type: FollowUpOrder["type"];
      name: string;
      dueDate: string;
    }>
  >;
  onCancel: () => void;
  onSave: () => void;
}) {
  const requestTypes: FollowUpOrder["type"][] =
    [
      "Lab Test",
      "X-Ray",
      "MRI",
      "CT Scan",
      "Ultrasound",
    ];

  return (
    <ClinicalAddForm
      eyebrow="New investigation"
      title="Test / Imaging"
      icon={
        <FlaskConical size={12} />
      }
      tone="amber"
      onCancel={onCancel}
      onSave={onSave}
      saveLabel="Add Request"
    >
      <div>
        <RequiredLabel>
          Type
        </RequiredLabel>

        <div className="grid grid-cols-5 gap-1">
          {requestTypes.map(
            (type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  onChange(
                    (current) => ({
                      ...current,
                      type,
                    }),
                  )
                }
                className={`h-6 rounded-md border px-1 !text-[10px] font-semibold transition ${
                  value.type === type
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                {type}
              </button>
            ),
          )}
        </div>
      </div>

      <div data-responsive-grid="2" className="grid grid-cols-[1fr_118px] gap-2">
        <div>
          <RequiredLabel>
            Test / imaging name
          </RequiredLabel>

          <FormInput
            placeholder="e.g. Complete Blood Count"
            value={value.name}
            onChange={(value) =>
              onChange(
                (current) => ({
                  ...current,
                  name: value,
                }),
              )
            }
          />
        </div>

        <div>
          <RequiredLabel>
            Due date
          </RequiredLabel>

          <ModernPostOpDatePicker
            value={value.dueDate}
            min={formatDateInput(
              new Date(),
            )}
            tone="amber"
            onChange={(date) =>
              onChange(
                (current) => ({
                  ...current,
                  dueDate: date,
                }),
              )
            }
          />
        </div>
      </div>
    </ClinicalAddForm>
  );
}
