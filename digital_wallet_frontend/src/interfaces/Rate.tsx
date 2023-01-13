import { Currency } from "./Currency";

export   interface Rate {
    id: number,
    rate: number,
    currency: Currency,
    createdAt: Date,
    deletedAt: Date
  }