/**
 * Modo liviano automático: equipos con ≤ 4 núcleos o ≤ 4 GB de RAM.
 * Sin grano, sin cursor custom ni parallax extra, y los videos esperan un play manual.
 * `?lite=1` / `?lite=0` lo fuerzan para probar.
 */
export function isLite() {
  if (typeof navigator === "undefined") return false;
  const forced = new URLSearchParams(window.location.search).get("lite");
  if (forced) return forced === "1";
  const n = navigator as Navigator & { deviceMemory?: number };
  return (n.hardwareConcurrency ?? 8) <= 4 || (n.deviceMemory ?? 8) <= 4;
}
