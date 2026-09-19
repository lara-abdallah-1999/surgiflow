/** At least one row remains reachable; a small viewport must not force five rows. */
export function getPageCapacity(height: number, rowHeight: number, maximum = 50) {
  if (!Number.isFinite(height) || height <= 0 || !Number.isFinite(rowHeight) || rowHeight <= 0) return null;
  return Math.max(1, Math.min(maximum, Math.floor(height / rowHeight)));
}
