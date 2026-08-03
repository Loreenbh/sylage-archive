export async function getReferences() {
  const res = await fetch("/api/users/references")

  if (!res.ok) {
    throw new Error("Failed to fetch references")
  }

  return res.json()
}