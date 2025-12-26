// src/api/osrm.js

export async function getRoute(startLat, startLon, destLat, destLon) {
  const url = `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${destLon},${destLat}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`OSRM HTTP error ${res.status}`);
    }

    const data = await res.json();

    if (!data.routes || data.routes.length === 0) {
      console.warn("⚠️ OSRM: No route found");
      return null;
    }

    return data.routes[0].geometry;
  } catch (error) {
    console.error("❌ OSRM routing error:", error.message);
    return null;
  }
}
