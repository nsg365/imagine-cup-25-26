export async function getRoute(startLat, startLon, destLat, destLon) {
  const url = `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${destLon},${destLat}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.routes?.[0]?.geometry || null;
  } catch (e) {
    console.error("OSRM routing error", e);
    return null;
  }
}
