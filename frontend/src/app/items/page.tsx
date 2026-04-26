"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Item = {
  id: number;
  name: string;
  category?: string | null;
  buyPrice?: number | null;
  sellPrice?: number | null;
  sellDate?: string | null;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadItems = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/items`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Unable to fetch items");
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
              : "Something went wrong loading items."
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
            <h1 className="title">Inventory</h1>
            <p className="subtitle">All items in your collection.</p>
          </div>
          <Link className="button" href="/items/new">
            Add item
          </Link>
        </header>

        <section className="card">
          {isLoading ? (
            <p className="empty">Loading items…</p>
          ) : error ? (
            <p className="empty">{error}</p>
          ) : items.length === 0 ? (
            <p className="empty">
              No items yet. Add your first item to start tracking.
            </p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Buy Price</th>
                  <th>Sell Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const isSold = Boolean(item.sellDate);
                  return (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.category ?? "—"}</td>
                      <td>
                        {item.buyPrice != null
                          ? `$${item.buyPrice}`
                          : "—"}
                      </td>
                      <td>
                        {item.sellPrice != null
                          ? `$${item.sellPrice}`
                          : "—"}
                      </td>
                      <td>
                        <span className={`badge ${isSold ? "sold" : ""}`}>
                          {isSold ? "Sold" : "Unsold"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
        <p className="helper">
        </p>
      </div>
    </main>
  );
}
