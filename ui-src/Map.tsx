import "./Map.css";

const Map = ({
  mapUrl,
  mapType,
  zoom,
  mapStyle,
  loading,
  mapLabels,
  unknownLocation,
  setMapStyle,
  setMapLabels,
  setZoom,
  setMapType
}: {
  mapUrl: string;
  mapType: string;
  zoom: number;
  mapStyle: string;
  mapLabels: boolean;
  loading: boolean;
  unknownLocation: boolean;
  setMapLabels: (mapLabels: boolean) => void;
  setMapStyle: (mapStyle: string) => void;
  setZoom: (zoom: number) => void;
  setMapType: (mapType: string) => void;
}) => {

  const mapStyles = {
    standard: ["#C3F1D5", "#9BB0CC"],
    light: ["#F5F5F5", "#DADADA"],
    dark: ["#000000", "#777777"],
    night: ["#263C3F", "#D09262"],
    retro: ["#ECE3CD", "#E58A58"],
    aubergine: ["#0E1626", "#3E8CA0"]
  }

  const handleZoomIn = () => {
    if (zoom !== 20) {
      setZoom(zoom + 1);
    }
  }

  const handleZoomOut = () => {
    if (zoom !== 0) {
      setZoom(zoom - 1);
    }
  }
  
  return (
    <div className="c-map">
      {mapUrl && (
        <div 
          style={{
            backgroundImage: unknownLocation ? "" : `url(${mapUrl})`
          }}
          className="c-map__img" />
      )}
      {
        loading
        ? <div className="c-map__loader"><div className="loader" /></div>
        : null
      }
      {
        unknownLocation && !loading
        ? <div className="c-map__unknown">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M480-320q17 0 29.5-12.5T522-362q0-17-12.5-29.5T480-404q-17 0-29.5 12.5T438-362q0 17 12.5 29.5T480-320Zm-30-124h60q0-19 1.5-30t4.5-18q4-8 11.5-16.5T552-534q21-21 31.5-42t10.5-42q0-47-31-74.5T480-720q-41 0-72 23t-42 61l54 22q7-23 23-35.5t37-12.5q24 0 39 13t15 33q0 17-7.5 29.5T500-558q-17 14-27 25.5T458-510q-5 10-6.5 24.5T450-444Zm30 258q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>
          </div>
        : null
      }
      <div className="c-map__control-overlay">
        <div className="c-map__controls">
          <div className="c-map__control-group">
            <div 
              className={`c-map__control ${mapType === "satellite" ? "c-map__control--active" : ""}`}
              onClick={() => setMapType(mapType === "satellite" ? "roadmap" : "satellite")}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-82v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm276-102q41-45 62.5-100.5T800-480q0-98-54.5-179T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h240q17 0 28.5 11.5T600-440v120h40q26 0 47 15.5t29 40.5Z"/></svg>
            </div>
            {
              mapType === "roadmap"
              ? <>
                  <div 
                    className={`c-map__control ${mapLabels ? "c-map__control--active" : ""}`}
                    onClick={() => setMapLabels(!mapLabels)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="m131-252 165-440h79l165 440h-76l-39-112H247l-40 112h-76Zm139-176h131l-64-182h-4l-63 182Zm395 186q-51 0-81-27.5T554-342q0-44 34.5-72.5T677-443q23 0 45 4t38 11v-12q0-29-20.5-47T685-505q-23 0-42 9.5T610-468l-47-35q24-29 54.5-43t68.5-14q69 0 103 32.5t34 97.5v178h-63v-37h-4q-14 23-38 35t-53 12Zm12-54q35 0 59.5-24t24.5-56q-14-8-33.5-12.5T689-393q-32 0-50 14t-18 37q0 20 16 33t40 13Z"/></svg>
                  </div>
                  <div className="c-map__control-column">
                    {
                      Object.keys(mapStyles).map((key) => (
                        <div 
                          className={`c-map__control ${key === mapStyle ? "c-map__control--active" : ""}`}
                          onClick={() => setMapStyle(key)}>
                          <div 
                            className="c-map__style"
                            style={{
                              background: `linear-gradient(to bottom, ${mapStyles[key][0]} 0%, ${mapStyles[key][0]} 50%, ${mapStyles[key][1]} 50%, ${mapStyles[key][1]} 100%)`
                            }} />
                        </div>
                      ))
                    }
                  </div>
                </>
              : null
            }
          </div>
          <div className="c-map__control-group">
            <div 
              className="c-map__control"
              onClick={handleZoomIn}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
            </div>
            <div 
              className="c-map__control"
              onClick={handleZoomOut}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M200-440v-80h560v80H200Z"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Map;