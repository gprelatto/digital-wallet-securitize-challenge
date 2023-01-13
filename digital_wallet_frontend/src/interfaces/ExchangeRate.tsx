export interface ExchangeRate {
  currency: string,
  rate: number,
  updateRate: (currency:string,rate: number) => void,
  refreshRates: () => void
}
