export async function uploadImage(imageData: string) {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageData }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Erreur upload");
  }

  return data.url;
}
