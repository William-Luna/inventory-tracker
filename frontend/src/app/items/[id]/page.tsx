import BackButton from "@/app/_components/BackButton";
import DeleteItemButton from "@/app/_components/DeleteItemButton";
import Link from "next/link";

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
};

type ItemDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const formatCurrency = (value?: number | string | null) => {
  if (value == null) {
    return "-";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
};

const formatDate = (value?: string | number | null) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

export default async function ItemDetailsPage({
  params,
}: ItemDetailsPageProps) {
  const { id } = await params;
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/api/items/${id}`, {
      cache: "no-store",
    });
  } catch {
    return (
      <main>
        <div className="container">
          <header className="page-header">
            <div>
              <h1 className="title">Item unavailable</h1>
              <p className="subtitle">
                Unable to connect to the inventory API for item #{id}.
              </p>
            </div>
            <BackButton className="button secondary" fallbackHref="/">
              Back
            </BackButton>
          </header>
        </div>
      </main>
    );
  }

  if (!response.ok) {
    return (
      <main>
        <div className="container">
          <header className="page-header">
            <div>
              <h1 className="title">Item not found</h1>
              <p className="subtitle">Unable to load item #{id}.</p>
            </div>
            <BackButton className="button secondary" fallbackHref="/">
              Back
            </BackButton>
          </header>
        </div>
      </main>
    );
  }

  const item = (await response.json()) as Item | null;

  if (!item) {
    return (
      <main>
        <div className="container">
          <header className="page-header">
            <div>
              <h1 className="title">Item not found</h1>
              <p className="subtitle">No item exists for ID {id}.</p>
            </div>
            <BackButton className="button secondary" fallbackHref="/">
              Back
            </BackButton>
          </header>
        </div>
      </main>
    );
  }

  const isSold = Boolean(item.sellDate);

  return (
    <main>
      <div className="container">
        <header className="page-header">
          <div>
            <h1 className="title">{item.name}</h1>
            <p className="subtitle">Item #{item.id} details.</p>
          </div>
          <div className="actions">
            <Link className="button" href={`/items/${item.id}/edit`}>
              Edit item
            </Link>
            <DeleteItemButton itemId={item.id} itemName={item.name} />
            <BackButton className="button secondary" fallbackHref="/">
              Back
            </BackButton>
          </div>
        </header>

        <section className="card detail-layout">
          {item.photoUrl ? (
            <img
              className="photo-preview"
              src={item.photoUrl}
              alt={item.name}
            />
          ) : (
            <div className="photo-placeholder">No photo</div>
          )}

          <div className="detail-grid">
            <div className="detail-row">
              <span>ID</span>
              <strong>{item.id}</strong>
            </div>
            <div className="detail-row">
              <span>Name</span>
              <strong>{item.name}</strong>
            </div>
            <div className="detail-row">
              <span>Category</span>
              <strong>{item.category ?? "-"}</strong>
            </div>
            <div className="detail-row">
              <span>Status</span>
              <strong>
                <span className={`badge ${isSold ? "sold" : ""}`}>
                  {isSold ? "Sold" : "Unsold"}
                </span>
              </strong>
            </div>
            <div className="detail-row">
              <span>Buy Price</span>
              <strong>{formatCurrency(item.buyPrice)}</strong>
            </div>
            <div className="detail-row">
              <span>Buy Date</span>
              <strong>{formatDate(item.buyDate)}</strong>
            </div>
            <div className="detail-row">
              <span>Sell Price</span>
              <strong>{formatCurrency(item.sellPrice)}</strong>
            </div>
            <div className="detail-row">
              <span>Sell Date</span>
              <strong>{formatDate(item.sellDate)}</strong>
            </div>
            <div className="detail-row">
              <span>Postage</span>
              <strong>{formatCurrency(item.postagePrice)}</strong>
            </div>
            <div className="detail-row">
              <span>Fees</span>
              <strong>{formatCurrency(item.feesPrice)}</strong>
            </div>
            <div className="detail-row">
              <span>Photo URL</span>
              <strong>{item.photoUrl ?? "-"}</strong>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
