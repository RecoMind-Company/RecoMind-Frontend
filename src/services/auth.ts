// get user authentication status

export async function getUser(id: string | number) {
  const res = await fetch(`https://api.example.com/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}