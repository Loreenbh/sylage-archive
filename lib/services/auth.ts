export async function getCurrentUser() {
  const res = await fetch("/api/auth/me");

  if (!res.ok) {
    throw new Error("Erreur récupération utilisateur");
  }

  return res.json();
}
