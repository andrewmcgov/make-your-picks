export async function customFetch({url, body}: {url: string; body?: any}) {
  const res = await fetch(url, {
    method: 'POST',
    body,
  });

  return res.json();
}
