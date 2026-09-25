export async function getDiscoverMoods() {
  const res = await fetch("/api/discover");

  if (!res.ok) {
    throw new Error("Erreur récupération moodboards");
  }

  return res.json();
}
