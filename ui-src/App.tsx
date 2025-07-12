import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import { GOOGLE_API_KEY } from "./dev";
import "./App.css";
import "./Control.css";

const MAP_TYPES = ["roadmap", "satellite", "terrain", "hybrid"];
const MAP_THEMES = ["light", "dark", "light-mono", "dark-mono"];
const MAP_STYLE_IDS: Record<string, string> = {
  light: "2934550e19d08aab1bbf511d",            // e.g. "abcd1234efgh5678"
  dark: "2934550e19d08aab1bbf511d",              // e.g. "ijkl9012mnop3456"
  "light-mono": "2934550e19d08aab8ddc14aa",     // monochrome light variant
  "dark-mono": "2934550e19d08aab8ddc14aa",       // monochrome dark variant
};

const App = () => {
  const [location, setLocation] = useState("");
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(14);
  const [loading, setLoading] = useState(false);
  const [mapType, setMapType] = useState("roadmap");
  const [mapTheme, setMapTheme] = useState<MapTheme>("light");

  // 🗺 Auto-detect city by IP on first load
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://ipapi.co/json");
        const data = await res.json();
        setLocation(data.postal);
      } catch (err) {
        console.error("IP lookup failed", err);
      }
    })();
  }, []);

  /** Build URL & set map */
  const fetchMap = async (loc: string, zoomLevel: number, type: string, theme: MapTheme) => {
    if (!loc) return;
    setLoading(true);

    // 1️⃣ Geocode address → coords
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(loc)}&key=${GOOGLE_API_KEY}`
    );
    const geo = await geoRes.json();
    if (!geo.results?.length) {
      setLoading(false);
      alert("Location not found");
      return;
    }
    const { lat, lng } = geo.results[0].geometry.location;

    // 2️⃣ Style logic – only roadmap supports styled maps
    const styleParam = type === "roadmap" && MAP_STYLE_IDS[theme]
      ? `&map_id=${MAP_STYLE_IDS[theme]}`
      : "";

    const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoomLevel}&size=800x600&maptype=${type}${styleParam}&key=${GOOGLE_API_KEY}`;

    setMapUrl(url);
    setLoading(false);
  };

  // Debounce network calls
  const debouncedFetch = useCallback(
    debounce((loc, z, t, th) => fetchMap(loc, z, t, th), 500),
    []
  );

  // Trigger on dependency changes
  useEffect(() => {
    debouncedFetch(location, zoom, mapType, mapTheme);
  }, [location, zoom, mapType, mapTheme, debouncedFetch]);

  const handleAdd = () => {
    if (!mapUrl) return;
    parent.postMessage(
      {
        pluginMessage: {
          type: "add-map",
          mapUrl,
          width: 800,
          height: 600,
        },
      },
      "*"
    );
  };

  return (
    <main className="c-app">
      <div className="c-app__body">
        <div className="c-control-group">
          <div className="c-control-group__item">
            <div className="c-control">
              <label 
                className="c-control__label"
                htmlFor="location-input">
                Location
              </label>
              <input
                id="location-input"
                className="c-control__input"
                placeholder="Enter address, city, zip..."
                value={location}
                onChange={(e) => setLocation(e.target.value)} />
            </div>
          </div>
          <div className="c-control-group__item">
            <div className="c-control">
              <label 
                className="c-control__label"
                htmlFor="map-type-input">
                Map type
              </label>
              <select
                id="map-type-input"
                className="c-control__input"
                value={mapType}
                onChange={(e) => setMapType(e.target.value)}>
                {
                  MAP_TYPES.map((style) => (
                    <option 
                      key={style}
                      value={style}>
                      { style }
                    </option>
                  ))
                }
              </select>
            </div>
          </div>
        </div>
        <div className="c-control-group">
          <div className="c-control-group__item">
            <div className="c-control">
              <label 
                className="c-control__label"
                htmlFor="location-input">
                Zoom
              </label>
              <input
                id="location-input"
                className="c-control__input"
                type="range" 
                min="1" 
                max="21" 
                value={zoom}
                onChange={(e) => setZoom(e.target.value)} />
            </div>
          </div>
          <div className="c-control-group__item">
            <div className="c-control">
              <label 
                className="c-control__label"
                htmlFor="map-theme-input">
                Map theme
              </label>
              <select
                id="map-theme-input"
                className="c-control__input"
                value={mapTheme}
                onChange={(e) => setMapTheme(e.target.value)}>
                {
                  MAP_THEMES.map((style) => (
                    <option 
                      key={style}
                      value={style}>
                      { style }
                    </option>
                  ))
                }
              </select>
            </div>
          </div>
        </div>
        {mapUrl && (
          <img 
            src={mapUrl} 
            alt="Map preview" 
            className="c-map-img" />
        )}
      </div>
      <div className="c-app__footer">
        <button 
          onClick={handleAdd} 
          disabled={!mapUrl} 
          className="c-generate-button">
          Add to canvas
        </button>
      </div>
    </main>
  );
}

export default App;