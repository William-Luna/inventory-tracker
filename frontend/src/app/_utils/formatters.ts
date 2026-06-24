export type MoneyValue = number | string | null | undefined;
export type DateValue = string | number | null | undefined;

export type ProfitLossItem = {
  buyPrice?: MoneyValue;
  sellPrice?: MoneyValue;
  feesPrice?: MoneyValue;
  postagePrice?: MoneyValue;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export const formatCurrency = (value: MoneyValue, fallback = "—") => {
  if (value == null || value === "") {
    return fallback;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue)
    ? currencyFormatter.format(numberValue)
    : fallback;
};

export const formatDate = (value: DateValue, fallback = "—") => {
  if (value == null || value === "") {
    return fallback;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : dateFormatter.format(date);
};

//convert number to cents (1.00 = 100 cents)
export const toCents = (value: MoneyValue) => {
  if (value == null || value === "") {
    return 0;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? Math.round(numberValue * 100) : 0;
};

//display cents to regular dollar format
export const formatCents = (cents: number) =>
  currencyFormatter.format(cents / 100);

export const getProfitLossCents = (item: ProfitLossItem) =>
  toCents(item.sellPrice) -
  toCents(item.buyPrice) -
  toCents(item.feesPrice) -
  toCents(item.postagePrice);

export const getProfitLossClassName = (cents: number) => {
  if (cents > 0) {
    return "profit-loss profit-loss--positive";
  }

  if (cents < 0) {
    return "profit-loss profit-loss--negative";
  }

  return "profit-loss";
};

export const getTime = (value: DateValue) => {
  if (value == null || value === "") {
    return 0;
  }

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
};
