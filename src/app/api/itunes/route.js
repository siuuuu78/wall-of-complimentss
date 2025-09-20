export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const term = searchParams.get("term") || "";
    const country = searchParams.get("country") || "ID"; // sesuaikan kalau mau
    const limit = Number(searchParams.get("limit") || 10);
  
    if (!term.trim()) {
      return Response.json({ resultCount: 0, results: [] }, { status: 200 });
    }
  
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
      term
    )}&entity=song&country=${country}&limit=${limit}`;
  
    const r = await fetch(url, { cache: "no-store" });
    const data = await r.json();
    return Response.json(data);
  }
  