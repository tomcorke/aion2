import { useEffect, useState } from "react";
import { useMatch } from "react-router";
import { PageHero } from "../../components/shell/PageHero/PageHero.tsx";
import { SiteFooter } from "../../components/shell/SiteFooter/SiteFooter.tsx";
import { SkinCatalogue } from "../../components/skins/SkinCatalogue/SkinCatalogue.tsx";
import { currentGlobalSkinOfferEntries } from "../../data/currentGlobalSkinOffers.ts";
import { skinAcquisitionSources } from "../../data/skinAcquisitions.ts";
import {
  skinCatalogueAttribution,
  skinCatalogueLimitations,
  skinCatalogueReviewed,
  skinCatalogueScope,
} from "../../data/skinCatalogueMetadata.ts";
import { skinsSources } from "../../data/skins.ts";
import { useTitle } from "../../hooks/useTitle.ts";
import { loadSkinCatalogue } from "../../lib/skinCatalogueLoader.ts";
import STYLES from "./Skins.module.css";

type Catalogue = Awaited<ReturnType<typeof loadSkinCatalogue>>;

const footerSources = [
  ...new Set([
    ...skinsSources,
    ...skinAcquisitionSources,
    ...currentGlobalSkinOfferEntries.flatMap(({ acquisitions }) =>
      acquisitions.flatMap(({ sourceIds }) => sourceIds),
    ),
  ]),
];

// This is the page reconciliation date; each older source keeps its own check date.
const reviewed = skinCatalogueReviewed;

const limitations = skinCatalogueLimitations;

export function Skins() {
  useTitle("Skins");

  const setId = useMatch("/skins/:set")?.params.set;
  const [catalogue, setCatalogue] = useState<Catalogue | "loading" | "failed">(
    "loading",
  );

  // The full reference loads only on this page, so other pages stay light.
  useEffect(() => {
    let live = true;

    loadSkinCatalogue().then(
      (loaded) => live && setCatalogue(loaded),
      () => live && setCatalogue("failed"),
    );

    return () => {
      live = false;
    };
  }, []);

  const selected =
    typeof catalogue === "object"
      ? catalogue.skinCatalogueEntries.find(({ id }) => id === setId)
      : undefined;

  function body() {
    if (catalogue === "loading")
      return (
        <p role="status" className={STYLES.note}>
          Loading the appearance list…
        </p>
      );

    if (catalogue === "failed")
      return (
        <div role="alert" className={STYLES.failure}>
          <p>
            The appearance list didn&apos;t load, so nothing is shown. Your
            ticks are still saved in this browser.
          </p>
          <button type="button" onClick={() => window.location.reload()}>
            Reload the page
          </button>
        </div>
      );

    return (
      <SkinCatalogue
        entries={catalogue.skinCatalogueEntries}
        pieceIds={catalogue.skinCataloguePieceIds}
        setId={setId}
      />
    );
  }

  return (
    <>
      <PageHero
        title="Skins"
        lede="A reference to retained non-weapon inventory and recently advertised Global looks, with recorded routes, prices and your own checklist."
      />
      <div className={STYLES.body}>
        <p className={STYLES.note}>{skinCatalogueScope}</p>
        <details className={STYLES.limits}>
          <summary>What this list does not cover</summary>
          <ul>
            {limitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
        </details>
        <p className={STYLES.note}>
          Ticks are saved only in this browser. They are your own notes, not a
          synced account, character or Closet inventory.
        </p>
        {body()}
      </div>
      <SiteFooter
        sources={footerSources}
        reviewed={reviewed}
        attribution={[
          ...skinCatalogueAttribution,
          ...(selected?.attribution ?? []),
        ]}
      />
    </>
  );
}
