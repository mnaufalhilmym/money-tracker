const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export function formatRupiah(amount: number) {
  return rupiahFormatter.format(amount).replace(/\s/g, "");
}
