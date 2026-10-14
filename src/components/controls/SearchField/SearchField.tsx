import STYLES from "./SearchField.module.css";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function SearchField({ label, value, onChange }: Props) {
  return (
    <label className={STYLES.field}>
      <span>{label}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
