export async function getProfileData(username?: string) {
  const url = username ? `/api/profile?user=${username}` : `/api/profile`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Erreur récupération profil");
  }

  return res.json();
}

export async function updateUser(data: {
  avatar_url?: string;
  username?: string;
  oldPassword?: string;
  password?: string;
}) {
  const res = await fetch("/api/users", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error ?? "Erreur mise à jour utilisateur");
  }

  return result;
}

export async function deleteUser() {
  const res = await fetch("/api/users", {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error);
  }

  return data;
}
