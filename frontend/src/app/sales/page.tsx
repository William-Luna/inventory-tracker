"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  formatCents,
  formatCurrency,
  formatDate,
  getProfitLossCents,
  getProfitLossClassName,
} from "@/app/_utils/formatters";

type Item = {
  id: number;
  name: string;
  category?: string | null;
  buyPrice?: number | string | null;
  sellPrice?: number | string | null;
  sellDate?: string | number | null;
  feesPrice?: number | string | null;
  postagePrice?: number | string | null;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export default function SalesPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadItems = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/items?sold=true`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Unable to fetch sold items");
        }
        const data = (await response.json()) as Item[];
        if (isMounted) {
          setItems(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong loading sold items."
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
            <h1 className="title">Sales</h1>
            <p className="subtitle">Displaying all sold items.</p>
          </div>
          <Link className="button" href="/items/new">
            Add item
          </Link>
        </header>

        <section className="card">
          {isLoading ? (
            <p className="empty">Loading sold items…</p>
          ) : error ? (
            <p className="empty">{error}</p>
          ) : items.length === 0 ? (
            <p className="empty">No sold items yet.</p>
          ) : (
            <table className="table fixed-table">
              <colgroup>
                <col style={{ width: "12%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "12%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Sell Date</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Buy Price</th>
                  <th>Sell Price</th>
                  <th>Fees</th>
                  <th>Postage</th>
                  <th>P&amp;L</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const profitLossCents = getProfitLossCents(item);

                  return (
                    <tr key={item.id}>
                      <td>{formatDate(item.sellDate)}</td>
                      <td>
                        <Link className="text-link" href={`/items/${item.id}`}>
                          {item.name}
                        </Link>
                      </td>
                      <td>{item.category ?? "—"}</td>
                      <td>{formatCurrency(item.buyPrice)}</td>
                      <td>{formatCurrency(item.sellPrice)}</td>
                      <td>{formatCurrency(item.feesPrice)}</td>
                      <td>{formatCurrency(item.postagePrice)}</td>
                      <td className={getProfitLossClassName(profitLossCents)}>
                        {formatCents(profitLossCents)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
}
