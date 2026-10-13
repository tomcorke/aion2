import { useEffect } from "react";

export function useTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · AION 2 Notes` : "AION 2 Notes";
  }, [title]);
}
