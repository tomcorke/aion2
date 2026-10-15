import type { FormEvent, ReactNode } from "react";
import {
  festivalOpeningModel,
  festivalPurchases,
  festivalRewards,
} from "../../../data/festival.ts";
import { Diamond } from "../../trim/Diamond/Diamond.tsx";
import STYLES from "./SimulatorForm.module.css";

// Form values as typed; the URL query uses the same keys.
export type Draft = {
  openings: string;
  startTokens: string;
  target: string;
  customTarget: string;
  participation: string;
};

export type DraftErrors = Partial<Record<keyof Draft, string>>;

type Props = {
  draft: Draft;
  errors: DraftErrors;
  onChange: (key: keyof Draft, value: string) => void;
  onSubmit: () => void;
};

const number = new Intl.NumberFormat("en-GB");

const labels: Record<keyof Draft, string> = {
  openings: "Openings",
  startTokens: "Starting tokens",
  target: "Target",
  customTarget: "Custom target tokens",
  participation: "Participation",
};

const groups = [
  { label: "Outfits", category: "outfit" },
  { label: "Accessories", category: "accessory" },
  { label: "Wings", category: "wing" },
] as const;

const participationTokens = festivalRewards.participation.tokens;

// Validation messages name the query key; show the field label instead.
// Openings have a tighter range than the generic safe-integer message says.
const message = (key: keyof Draft, error: string) =>
  key === "openings" && error.includes("safe integer")
    ? "Openings must be a whole number from 0 to 1,000."
    : error.replace(key, labels[key]);

function Field({
  name,
  hint,
  error,
  children,
}: {
  name: keyof Draft;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className={STYLES.field}>
      <label htmlFor={`festival-${name}`}>{labels[name]}</label>
      {children}
      {hint && (
        <span id={`festival-${name}-hint`} className={STYLES.hint}>
          {hint}
        </span>
      )}
      {error && (
        <span id={`festival-${name}-error`} className={STYLES.error}>
          {message(name, error)}
        </span>
      )}
    </div>
  );
}

function NumberInput({
  name,
  draft,
  errors,
  onChange,
}: Omit<Props, "onSubmit"> & { name: keyof Draft }) {
  const described = [
    `festival-${name}-hint`,
    errors[name] && `festival-${name}-error`,
  ].filter(Boolean);

  return (
    <input
      id={`festival-${name}`}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={draft[name]}
      aria-invalid={Boolean(errors[name])}
      aria-describedby={described.join(" ")}
      onChange={(event) => onChange(name, event.target.value)}
    />
  );
}

function TargetSelect({ draft, onChange }: Omit<Props, "onSubmit" | "errors">) {
  return (
    <select
      id="festival-target"
      value={draft.target}
      onChange={(event) => onChange("target", event.target.value)}
    >
      {groups.map(({ label, category }) => (
        <optgroup key={category} label={label}>
          {festivalPurchases
            .filter((purchase) => purchase.category === category)
            .map(({ id, name, total }) => (
              <option key={id} value={id}>
                {name}: {number.format(total)} tokens
              </option>
            ))}
        </optgroup>
      ))}
      <option value="custom">Custom token target</option>
    </select>
  );
}

const assumptions = [
  "Each opening is an independent draw from the token odds on the reference tab.",
  festivalOpeningModel.condition,
  festivalRewards.mappingCondition,
  `With participation on, each modeled opening is paired with one ${participationTokens}-token participation package. That pairing is a modeling assumption, not a claim about keys, claiming or daily income.`,
];

/** Model inputs, with the assumptions that drive the model beside them. */
export function SimulatorForm(props: Props) {
  const { draft, errors, onChange, onSubmit } = props;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className={STYLES.inputs}>
      <form className={STYLES.form} noValidate onSubmit={submit}>
        <Field
          name="openings"
          hint="Additional reward openings, 0 to 1,000. Not keys or days."
          error={errors.openings}
        >
          <NumberInput name="openings" {...props} />
        </Field>

        <Field
          name="startTokens"
          hint="Tokens you already hold."
          error={errors.startTokens}
        >
          <NumberInput name="startTokens" {...props} />
        </Field>

        <Field name="target" error={errors.target}>
          <TargetSelect draft={draft} onChange={onChange} />
        </Field>

        {draft.target === "custom" && (
          <Field
            name="customTarget"
            hint="Whole tokens, 0 or more."
            error={errors.customTarget}
          >
            <NumberInput name="customTarget" {...props} />
          </Field>
        )}

        <label className={STYLES.check}>
          <input
            type="checkbox"
            checked={draft.participation === "true"}
            onChange={(event) =>
              onChange("participation", String(event.target.checked))
            }
          />
          Add {participationTokens} participation tokens per opening
        </label>
        {errors.participation && (
          <span className={STYLES.error}>{errors.participation}</span>
        )}

        <button type="submit" className={STYLES.run}>
          Run simulation
        </button>
      </form>

      <ul className={STYLES.assumptions} aria-label="Model assumptions">
        {assumptions.map((item) => (
          <li key={item}>
            <Diamond />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
