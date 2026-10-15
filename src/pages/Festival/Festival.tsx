import type { ReactNode } from "react";
import { Link, useMatch } from "react-router";
import { Tabs } from "../../components/controls/Tabs/Tabs.tsx";
import { FestivalSimulator } from "../../components/festival/FestivalSimulator/FestivalSimulator.tsx";
import { PageHero } from "../../components/shell/PageHero/PageHero.tsx";
import { SiteFooter } from "../../components/shell/SiteFooter/SiteFooter.tsx";
import { Diamond } from "../../components/trim/Diamond/Diamond.tsx";
import { Rule } from "../../components/trim/Rule/Rule.tsx";
import {
  festivalEntry,
  festivalGames,
  festivalKeys,
  festivalOpeningModel,
  festivalPurchases,
  festivalReviewed,
  festivalRewards,
  festivalSources,
  type FestivalPurchase,
} from "../../data/festival.ts";
import { useTitle } from "../../hooks/useTitle.ts";
import STYLES from "./Festival.module.css";

const number = new Intl.NumberFormat("en-GB");

const percent = new Intl.NumberFormat("en-GB", { style: "percent" });

const views = [
  { id: "reference", label: "Reference", to: "/festival" },
  { id: "simulator", label: "Token simulator", to: "/festival/simulator" },
];

// Shared purchase IDs make the shop and the simulator agree on cost.
const simulatorLink = (purchaseId: string) => ({
  pathname: "/festival/simulator",
  search: `?target=${encodeURIComponent(purchaseId)}`,
});

const shopTables: {
  caption: string;
  category: FestivalPurchase["category"];
}[] = [
  { caption: "Outfits", category: "outfit" },
  { caption: "Accessories", category: "accessory" },
  { caption: "Wings", category: "wing" },
];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={STYLES.section}>
      <h2 id={id}>{title}</h2>
      {children}
    </section>
  );
}

function Notes({ items }: { items: string[] }) {
  return (
    <ul className={STYLES.notes}>
      {items.map((item) => (
        <li key={item}>
          <Diamond />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function GamesTable() {
  return (
    <div className={STYLES.scroll}>
      <table className={STYLES.table}>
        <caption>Games</caption>
        <thead>
          <tr>
            <th scope="col">Game</th>
            <th scope="col">Players</th>
            <th scope="col">Round limit</th>
            <th scope="col">Objective</th>
          </tr>
        </thead>
        <tbody>
          {festivalGames.map(({ id, name, players, duration, objective }) => (
            <tr key={id}>
              <th scope="row">{name}</th>
              <td className={STYLES.figure}>
                {players.min}–{players.max}
              </td>
              <td className={STYLES.figure}>{duration}</td>
              <td>{objective}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PurchaseRows({ name, pieces, total }: FestivalPurchase) {
  if (pieces.length === 1)
    return (
      <tbody>
        <tr>
          <th scope="row">{name}</th>
          <td className={STYLES.figure}>{number.format(total)}</td>
        </tr>
      </tbody>
    );

  return (
    <tbody>
      <tr>
        <th scope="rowgroup" colSpan={2} className={STYLES.group}>
          {name}
        </th>
      </tr>
      {pieces.map((piece) => (
        <tr key={piece.id}>
          <th scope="row">{piece.name}</th>
          <td className={STYLES.figure}>{number.format(piece.price)}</td>
        </tr>
      ))}
      <tr className={STYLES.total}>
        <th scope="row">Total</th>
        <td className={STYLES.figure}>{number.format(total)}</td>
      </tr>
    </tbody>
  );
}

function ShopTable({ caption, category }: (typeof shopTables)[number]) {
  return (
    <table className={STYLES.table}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Piece</th>
          <th scope="col">Tokens</th>
        </tr>
      </thead>
      {festivalPurchases
        .filter((purchase) => purchase.category === category)
        .map((purchase) => (
          <PurchaseRows key={purchase.id} {...purchase} />
        ))}
    </table>
  );
}

function Shop() {
  const { currency, limit } = festivalPurchases[0]!;
  const conditions = [...new Set(festivalPurchases.map((p) => p.condition))];

  return (
    <Section id="festival-shop" title="Shop prices">
      <p>
        Prices in {currency}, one of each piece per {limit.scope}. Outfits,
        accessories and wings are bought separately.
      </p>

      <Notes items={conditions} />

      <div className={STYLES.shop}>
        {shopTables.map((table) => (
          <ShopTable key={table.category} {...table} />
        ))}
      </div>

      <h3>Simulate saving for a purchase</h3>
      <p className={STYLES.links}>
        {festivalPurchases.map(({ id, name }) => (
          <Link key={id} to={simulatorLink(id)}>
            {name} →
          </Link>
        ))}
      </p>
    </Section>
  );
}

function Keys() {
  const { storage, membership } = festivalKeys;

  return (
    <Section id="festival-keys" title="Keys and membership">
      <table className={STYLES.table}>
        <caption>Festival Key storage</caption>
        <tbody>
          <tr>
            <th scope="row">Normal</th>
            <td className={STYLES.figure}>{storage.normal}</td>
          </tr>
          <tr>
            <th scope="row">{membership.name} membership</th>
            <td className={STYLES.figure}>{storage.specialQuairerk}</td>
          </tr>
        </tbody>
      </table>

      <Notes
        items={[
          festivalKeys.storageCondition,
          `${membership.name} costs US$${membership.priceUsd} for ${membership.days} days.`,
          membership.condition,
          festivalKeys.refillCondition,
          festivalKeys.claimingCondition,
        ]}
      />
    </Section>
  );
}

function Odds() {
  return (
    <Section id="festival-odds" title="Token odds">
      <table className={STYLES.table}>
        <caption>Additional tokens per opening</caption>
        <thead>
          <tr>
            <th scope="col">Tokens</th>
            <th scope="col">Chance</th>
          </tr>
        </thead>
        <tbody>
          {festivalOpeningModel.outcomes.map(({ tokens, probability }) => (
            <tr key={tokens}>
              <td className={STYLES.figure}>{tokens}</td>
              <td className={STYLES.figure}>{percent.format(probability)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        Mean per opening:{" "}
        <strong className={STYLES.mean}>
          {festivalOpeningModel.meanTokens}
        </strong>{" "}
        tokens.
      </p>

      <Notes items={[festivalOpeningModel.condition]} />
    </Section>
  );
}

function Reference() {
  return (
    <div className={STYLES.reference}>
      <Section id="festival-games" title="Games">
        <GamesTable />
      </Section>

      <Rule gem />

      <Section id="festival-entry" title="Entering">
        <Notes
          items={[
            festivalEntry.instructions,
            festivalEntry.availability,
            festivalEntry.scheduleCondition,
            festivalEntry.levelCondition,
          ]}
        />
      </Section>

      <Rule gem />

      <Section id="festival-rewards" title="Rewards and cards">
        <Notes
          items={[
            festivalRewards.cards.selections,
            festivalRewards.sharedTable,
            festivalRewards.packageCondition,
            festivalRewards.mappingCondition,
          ]}
        />

        <h3>Other rewards</h3>
        <Notes items={festivalRewards.otherRewards} />
      </Section>

      <Rule gem />

      <Keys />

      <Rule gem />

      <Odds />

      <Rule gem />

      <Shop />
    </div>
  );
}

export function Festival() {
  useTitle("Shugo Festival");

  const view = useMatch("/festival/simulator") ? "simulator" : "reference";

  return (
    <>
      <PageHero
        title="Shugo Festival"
        lede="The nine games, how to enter, keys, token odds, shop prices and a token simulator."
      />

      <div className={STYLES.body}>
        <Tabs label="Festival view" tabs={views} selected={view}>
          {view === "simulator" ? (
            <Section id="festival-simulator" title="Token simulator">
              <FestivalSimulator />
            </Section>
          ) : (
            <Reference />
          )}
        </Tabs>
      </div>

      <SiteFooter sources={festivalSources} reviewed={festivalReviewed} />
    </>
  );
}
