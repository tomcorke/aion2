import { useEffect } from "react";

export function useTitle(title?: string) {
  useEffect(() => {
    document.title = title
      ? `${title} · AION 2 Field Notes`
      : "AION 2 Field Notes";
  }, [title]);
}
