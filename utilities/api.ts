export async function query(path: string) {
  return fetch(`http://localhost:3000${path}`).then((res) => res.json());
}

export async function mutation(path: string, body: object) {
  const res = await fetch(`http://localhost:3000${path}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return await res.json();
}
