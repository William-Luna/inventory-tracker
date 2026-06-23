"use client";

import BackButton from "@/app/_components/BackButton";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

type Item = {
  id: number;
  name: string;
  category?: string | null;
  buyPrice?: number | string | null;
  buyDate?: string | number | null;
  sellPrice?: number | string | null;
  sellDate?: string | number | null;
  postagePrice?: number | string | null;
  feesPrice?: number | string | null;
  photoUrl?: string | null;
  location?: string | null;
};

type FormState = {
  name: string;
  category: string;
  buyPrice: string;
  buyDate: string;
  sellPrice: string;
  sellDate: string;
  postagePrice: string;
  feesPrice: string;
  photoUrl: string;
  location: string;
};

const emptyForm: FormState = {
  name: "",
  category: "",
  buyPrice: "",
  buyDate: "",
  sellPrice: "",
  sellDate: "",
  postagePrice: "",
  feesPrice: "",
  photoUrl: "",
  location: "",
};

const toInputDate = (value?: string | number | null) => {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
};

const toInputValue = (value?: number | string | null) =>
  value == null ? "" : String(value);

export default function EditItemPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const itemId = params.id;

  const [form, setForm] = useState<FormState>(emptyForm);
  const [isSold, setIsSold] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadItem = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/items/${itemId}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load item.");
        }

        const item = (await response.json()) as Item | null;

        if (!item) {
          throw new Error("Item not found.");
        }

        if (isMounted) {
          setForm({
            name: item.name,
            category: item.category ?? "",
            buyPrice: toInputValue(item.buyPrice),
            buyDate: toInputDate(item.buyDate),
            sellPrice: toInputValue(item.sellPrice),
            sellDate: toInputDate(item.sellDate),
            postagePrice: toInputValue(item.postagePrice),
            feesPrice: toInputValue(item.feesPrice),
            photoUrl: item.photoUrl ?? "",
            location: item.location ?? "",
          });
          setIsSold(Boolean(item.sellDate));
          setMessage(null);
        }
      } catch (err) {
        if (isMounted) {
          setMessage(
            err instanceof Error
              ? err.message
              : "Something went wrong loading this item.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadItem();

    return () => {
      isMounted = false;
    };
  }, [itemId]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const payload = {
        id: Number(itemId),
        name: form.name,
        category: form.category || null,
        buyPrice: form.buyPrice ? Number(form.buyPrice) : 0,
        buyDate: form.buyDate || null,
        sellPrice: isSold && form.sellPrice ? Number(form.sellPrice) : null,
        sellDate: isSold ? form.sellDate || null : null,
        postagePrice:
          isSold && form.postagePrice ? Number(form.postagePrice) : null,
        feesPrice: isSold && form.feesPrice ? Number(form.feesPrice) : null,
        photoUrl: form.photoUrl || null,
        location: form.location || null,
      };

      const response = await fetch(`${API_BASE}/api/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to update item.");
      }

      router.push(`/items/${itemId}`);
      router.refresh();
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Something went wrong saving.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadFailed = !isLoading && message && form.name === "";

  return (
    <main>
      <div className="container">
        <header className="page-header">
          <div>
            <h1 className="title">Edit item</h1>
            <p className="subtitle">Update item #{itemId}.</p>
          </div>
          <BackButton
            className="button secondary"
            fallbackHref={`/items/${itemId}`}
          >
            Back
          </BackButton>
        </header>

        <section className="card">
          {isLoading ? (
            <p className="empty">Loading item...</p>
          ) : loadFailed ? (
            <p className="empty">{message}</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <label className="field">
                  Name
                  <input
                    required
                    value={form.name}
                    onChange={(event) =>
                      handleChange("name", event.target.value)
                    }
                    placeholder="Charizard Holo PSA 10"
                  />
                </label>
                <label className="field">
                  Category
                  <input
                    required
                    value={form.category}
                    onChange={(event) =>
                      handleChange("category", event.target.value)
                    }
                    placeholder="Trading Cards"
                  />
                </label>
                <label className="field">
                  Location
                  <input
                    value={form.location}
                    onChange={(event) =>
                      handleChange("location", event.target.value)
                    }
                  />
                </label>
                <label className="field">
                  Buy Price
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={form.buyPrice}
                    onChange={(event) =>
                      handleChange("buyPrice", event.target.value)
                    }
                    placeholder="0.00"
                  />
                </label>
                <label className="field">
                  Buy Date
                  <input
                    required
                    type="date"
                    value={form.buyDate}
                    onChange={(event) =>
                      handleChange("buyDate", event.target.value)
                    }
                  />
                </label>
              </div>
              <div className="form-section-header">
                <span className="section-label">Sold details</span>
                <label className="toggle" htmlFor="is-sold">
                  <input
                    id="is-sold"
                    type="checkbox"
                    checked={isSold}
                    onChange={(event) => setIsSold(event.target.checked)}
                  />
                  <span className="toggle-track" aria-hidden="true">
                    <span className="toggle-thumb" />
                  </span>
                  <span>{isSold ? "Sold" : "Not sold yet"}</span>
                </label>
              </div>
              <fieldset
                className={`sell-fields ${!isSold ? "is-disabled" : ""}`}
                disabled={!isSold}
              >
                <div className="form-grid">
                  <label className="field">
                    Sell Price
                    <input
                      required={isSold}
                      type="number"
                      step="0.01"
                      value={form.sellPrice}
                      onChange={(event) =>
                        handleChange("sellPrice", event.target.value)
                      }
                      placeholder="0.00"
                    />
                  </label>
                  <label className="field">
                    Sell Date
                    <input
                      required={isSold}
                      type="date"
                      value={form.sellDate}
                      onChange={(event) =>
                        handleChange("sellDate", event.target.value)
                      }
                    />
                  </label>
                  <label className="field">
                    Postage
                    <input
                      required={isSold}
                      type="number"
                      step="0.01"
                      value={form.postagePrice}
                      onChange={(event) =>
                        handleChange("postagePrice", event.target.value)
                      }
                      placeholder="0.00"
                    />
                  </label>
                  <label className="field">
                    Fees
                    <input
                      required={isSold}
                      type="number"
                      step="0.01"
                      value={form.feesPrice}
                      onChange={(event) =>
                        handleChange("feesPrice", event.target.value)
                      }
                      placeholder="0.00"
                    />
                  </label>
                </div>
              </fieldset>
              <div className="form-grid">
                <label className="field">
                  Photo URL
                  <input
                    type="url"
                    value={form.photoUrl}
                    onChange={(event) =>
                      handleChange("photoUrl", event.target.value)
                    }
                    placeholder="https://"
                  />
                </label>
              </div>

              <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
                <button
                  className="button"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save changes"}
                </button>
                <Link className="button secondary" href={`/items/${itemId}`}>
                  Cancel
                </Link>
              </div>
              {message ? <p className="helper">{message}</p> : null}
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
