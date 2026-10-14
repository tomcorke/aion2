import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import STYLES from "./Tabs.module.css";

export type Tab = {
  id: string;
  label: string;
  to: string;
};

type Props = {
  label: string;
  tabs: Tab[];
  // Undefined when the route names no known tab; the first tab stays reachable.
  selected?: string;
  children: ReactNode;
};

const moves: Record<string, (index: number, count: number) => number> = {
  ArrowRight: (index, count) => (index + 1) % count,
  ArrowLeft: (index, count) => (index - 1 + count) % count,
  Home: () => 0,
  End: (_, count) => count - 1,
};

/** Route-backed tabs: each tab is a link, so the URL holds the selection and history restores it. */
export function Tabs({ label, tabs, selected, children }: Props) {
  const id = useId();
  const navigate = useNavigate();
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);
  const current = tabs.findIndex((tab) => tab.id === selected);

  function onKeyDown(event: KeyboardEvent, index: number) {
    const move = moves[event.key];

    if (!move) return;

    event.preventDefault();

    const next = move(index, tabs.length);

    navigate(tabs[next].to);
    refs.current[next]?.focus();
  }

  return (
    <>
      <div role="tablist" aria-label={label} className={STYLES.list}>
        {tabs.map((tab, index) => (
          <Link
            key={tab.id}
            ref={(element) => {
              refs.current[index] = element;
            }}
            id={`${id}-${tab.id}`}
            role="tab"
            to={tab.to}
            aria-selected={index === current}
            tabIndex={index === Math.max(current, 0) ? 0 : -1}
            className={STYLES.tab}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {current < 0 ? (
        children
      ) : (
        <div
          role="tabpanel"
          aria-labelledby={`${id}-${tabs[current].id}`}
          className={STYLES.panel}
        >
          {children}
        </div>
      )}
    </>
  );
}
