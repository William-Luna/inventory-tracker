"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { formatCurrency, formatDate, getTime } from "@/app/_utils/formatters";

type Item = {
  id: number;
  name: string;
  category?: string | null;
  buyPrice?: number | string | null;
  buyDate?: string | number | null;
  sellPrice?: number | string | null;
  sellDate?: string | number | null;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const byRecentBuyDate = (a: Item, b: Item) =>
  getTime(b.buyDate) - getTime(a.buyDate);

const byRecentSellDate = (a: Item, b: Item) =>
  getTime(b.sellDate) - getTime(a.sellDate);

export default function Home() {
  const [unsoldItems, setUnsoldItems] = useState<Item[]>([]);
  const [soldItems, setSoldItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadItems = async () => {
      try {
        const [unsoldResponse, soldResponse] = await Promise.all([
          fetch(`${API_BASE}/api/items?unsold=true`, {
            cache: "no-store",
          }),
          fetch(`${API_BASE}/api/items?sold=true`, {
            cache: "no-store",
          }),
        ]);

        if (!unsoldResponse.ok || !soldResponse.ok) {
          throw new Error("Unable to fetch dashboard items");
        }

        const [unsoldData, soldData] = (await Promise.all([
          unsoldResponse.json(),
          soldResponse.json(),
        ])) as [Item[], Item[]];

        if (isMounted) {
          setUnsoldItems([...unsoldData].sort(byRecentBuyDate).slice(0, 5));
          setSoldItems([...soldData].sort(byRecentSellDate).slice(0, 5));
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong loading dashboard items."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadItems();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main>
      <div className="container">
        <header className="page-header">
          <div>
            <h1 className="title">Inventory Dashboard</h1>
            <p className="subtitle">Welcome user.</p>
          </div>
          <Link className="button" href="/items/new">
            Add item
          </Link>
        </header>

        <div className="dashboard-grid">
          <section className="card">
            <div className="card-header">
              <h2 className="subtitle">Inventory</h2>
              <Link className="text-link" href="/items">
                View All
              </Link>
            </div>

            {isLoading ? (
              <p className="empty">Loading inventory…</p>
            ) : error ? (
              <p className="empty">{error}</p>
            ) : unsoldItems.length === 0 ? (
              <p className="empty">No unsold items yet.</p>
            ) : (
              <table className="table fixed-table">
                <colgroup>
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "48%" }} />
                  <col style={{ width: "24%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>Buy Date</th>
                    <th>Name</th>
                    <th>Buy Price</th>
                  </tr>
                </thead>
                <tbody>
                  {unsoldItems.map((item) => (
                    <tr key={item.id}>
                      <td>{formatDate(item.buyDate)}</td>
                      <td>
                        <Link className="text-link" href={`/items/${item.id}`}>
                          {item.name}
                        </Link>
                      </td>
                      <td>{formatCurrency(item.buyPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="subtitle">Sales</h2>
              <Link className="text-link" href="/sales">
                View All
              </Link>
            </div>

            {isLoading ? (
              <p className="empty">Loading sales…</p>
            ) : error ? (
              <p className="empty">{error}</p>
            ) : soldItems.length === 0 ? (
              <p className="empty">No sold items yet.</p>
            ) : (
              <table className="table fixed-table">
                <colgroup>
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "48%" }} />
                  <col style={{ width: "24%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>Sell Date</th>
                    <th>Name</th>
                    <th>Sell Price</th>
                  </tr>
                </thead>
                <tbody>
                  {soldItems.map((item) => (
                    <tr key={item.id}>
                      <td>{formatDate(item.sellDate)}</td>
                      <td>
                        <Link className="text-link" href={`/items/${item.id}`}>
                          {item.name}
                        </Link>
                      </td>
                      <td>{formatCurrency(item.sellPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
