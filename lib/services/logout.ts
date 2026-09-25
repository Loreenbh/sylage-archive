export async function logout() {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error("Erreur lors de la deconnexion");
  }
  return true;
}
