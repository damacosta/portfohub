"use server";
const baseUrlApi = process.env.BASE_URI_API;

export async function sendRequest(route, { arg }) {
  const res = await fetch(`${baseUrlApi}${route}`, {
    method: "POST",
    body: JSON.stringify(arg),
    headers: {
      "Content-Type": "application/json"
    }
  });
  const response = await res.json().catch(() => null);
  if (!res.ok) return Promise.reject(response);
  return response;
}