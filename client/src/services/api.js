//src/services/api.js
export async function fetchStudies(pageUrl) {
  const url = pageUrl
    ? `http://localhost:3000/studies?url=${encodeURIComponent(pageUrl)}`
    : "http://localhost:3000/studies";

  try {
    const res = await fetch(url);
    const data = await res.json();

    //  HANDLE BACKEND ERROR
    if (!data || data.error) {
      console.error("Backend error:", data);
      return {
        items: [],
        next: null,
        prev: null
      };
    }

    return {
      items: Array.isArray(data.data) ? data.data : [],
      next: data.links?.next || null,
      prev: data.links?.prev || null
    };

  } catch (err) {
    console.error("Fetch failed:", err);
    return {
      items: [],
      next: null,
      prev: null
    };
  }
}

