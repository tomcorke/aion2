import { Link } from "react-router";
import { PageHead } from "../../components/PageHead/PageHead.tsx";
import { useTitle } from "../../useTitle.ts";

export function NotFound() {
  useTitle("Not found");

  return (
    <PageHead
      title="Page not found"
      lede={
        <>
          That page does not exist. <Link to="/">Back to the start</Link>.
        </>
      }
    />
  );
}
