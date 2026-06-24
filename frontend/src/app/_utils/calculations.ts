import {formatCents, toCents} from "@/app/_utils/formatters";

type MoneyValue = number | string | null | undefined;
type DateValue = string | number | null | undefined;


export type AnalyticsItem = {
  buyPrice?: MoneyValue;
  sellPrice?: MoneyValue;
  feesPrice?: MoneyValue;
  postagePrice?: MoneyValue;
  buyDate?: DateValue;
  sellDate?: DateValue;
  category?: string | null;
};

export const getRevenueCents = (items: AnalyticsItem[]) => {
    items.reduce((total, item) => total + toCents(item.sellPrice), 0);