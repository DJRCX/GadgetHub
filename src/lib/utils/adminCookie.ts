export function clearAdminCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "admin_token=; path=/; max-age=0";
}
