/** Human-readable offer expiry from `expiringInHours` on product data */
export function formatOfferEnds(expiringInHours: number): string | null {
  if (expiringInHours <= 0) return null;
  if (expiringInHours < 1) {
    const mins = Math.max(1, Math.round(expiringInHours * 60));
    return `Ends in ${mins} min`;
  }
  if (expiringInHours < 24) {
    const h = Math.floor(expiringInHours);
    const m = Math.round((expiringInHours % 1) * 60);
    if (m > 0) return `Ends in ${h}h ${m}m`;
    return `Ends in ${h}h`;
  }
  const days = Math.floor(expiringInHours / 24);
  const remH = Math.round(expiringInHours % 24);
  if (days > 0 && remH > 0) return `Ends in ${days}d ${remH}h`;
  if (days > 0) return `Ends in ${days} day${days !== 1 ? "s" : ""}`;
  return `Ends in ${Math.round(expiringInHours)}h`;
}

export function formatQuantityLeft(quantityLeft: number): string | null {
  if (quantityLeft <= 0) return "Sold out";
  return `${quantityLeft} left`;
}
