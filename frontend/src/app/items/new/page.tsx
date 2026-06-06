"use client";
import BackButton from "@/app/_components/BackButton";
import Link from "next/link";
import { useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

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

const initialState: FormState = {
  name: "",
  category: "",
  buyPrice: "",
  buyDate: "",
  sellPrice: "",
  sellDate: "",
  postagePrice: "",
  feesPrice: "",
  photoUrl: "",
  location: ""
};

export default function NewItemPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSold, setIsSold] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const payload = {
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

      const response = await fetch(`${API_BASE}/api/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error ?? "Unable to create item.");
      }

      setForm(initialState);
      setIsSold(false);
      setMessage("Item created. You can add another or return to the list.");
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Something went wrong saving."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <div className="container">
        <header className="page-header">
          <div>
            <h1 className="title">Add item</h1>
            <p className="subtitle">Log a new item into inventory.</p>
          </div>
          <BackButton className="button secondary" fallbackHref="/">
            Back
          </BackButton>
        </header>

        <section className="card">
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
              <button className="button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Create item"}
              </button>
              <Link className="button secondary" href="/">
                Cancel
              </Link>
            </div>
            {message ? <p className="helper">{message}</p> : null}
          </form>
        </section>
      </div>
    </main>
  );
}
