"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Item = {
  id: number;
  name: string;
  category?: string | null;
  location?: string | null;
  buyPrice?: number | string | null;
  buyDate?: string | number | null;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const formatCurrency = (value?: number | string | null) => {
  if (value == null || value === "") {
    return "—";
  }

  return `$${value}`;
};

const formatDate = (value?: string | number | null) => {
  if (value == null || value === "") {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadItems = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/items?unsold=true`, {
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
            <p className="subtitle">Displaying All unsold items.</p>
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
            <table className="table fixed-table">
              <colgroup>
                <col style={{ width: "14%" }} />
                <col style={{ width: "30%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "24%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Buy Date</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Buy Price</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.buyDate)}</td>
                    <td>
                      <Link className="text-link" href={`/items/${item.id}`}>
                        {item.name}
                      </Link>
                    </td>
                    <td>{item.category ?? "—"}</td>
                    <td>{formatCurrency(item.buyPrice)}</td>
                    <td>{item.location ?? "—"}</td>
                  </tr>
                ))}
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
