import { ClinicalAddForm } from "./ClinicalAddForm";
import { Pill } from "lucide-react";
import { RequiredLabel } from "./RequiredLabel";
import { FormInput } from "./FormInput";



export function MedicationForm({
  value,
  onChange,
  onCancel,
  onSave,
}: {
  value: {
    name: string;
    dose: string;
    frequency: string;
    duration: string;
  };
  onChange: React.Dispatch<
    React.SetStateAction<{
      name: string;
      dose: string;
      frequency: string;
      duration: string;
    }>
  >;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <ClinicalAddForm
      eyebrow="New prescription"
      title="Medication"
      icon={<Pill size={12} />}
      tone="cyan"
      onCancel={onCancel}
      onSave={onSave}
      saveLabel="Add Medication"
    >
      <div>
        <RequiredLabel>
          Medication name
        </RequiredLabel>

        <FormInput
          placeholder="e.g. Paracetamol"
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

      <div data-responsive-grid="3" className="grid grid-cols-3 gap-2">
        <div>
          <RequiredLabel>
            Dose
          </RequiredLabel>

          <FormInput
            placeholder="500 mg"
            value={value.dose}
            onChange={(value) =>
              onChange(
                (current) => ({
                  ...current,
                  dose: value,
                }),
              )
            }
          />
        </div>

        <div>
          <RequiredLabel>
            Frequency
          </RequiredLabel>

          <FormInput
            placeholder="Every 6h"
            value={value.frequency}
            onChange={(value) =>
              onChange(
                (current) => ({
                  ...current,
                  frequency: value,
                }),
              )
            }
          />
        </div>

        <div>
          <RequiredLabel>
            Duration
          </RequiredLabel>

          <FormInput
            placeholder="5 days"
            value={value.duration}
            onChange={(value) =>
              onChange(
                (current) => ({
                  ...current,
                  duration: value,
                }),
              )
            }
          />
        </div>
      </div>
    </ClinicalAddForm>
  );
}
