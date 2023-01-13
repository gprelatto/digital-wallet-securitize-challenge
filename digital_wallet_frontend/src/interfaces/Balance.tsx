import { Rate } from "./Rate";

export interface Balance {
    rates: Rate[],
    rate: number,
    balance: number,
    changeCurrency: (currency: string) => void
  }