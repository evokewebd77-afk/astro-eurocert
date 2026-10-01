import React, { useState, useEffect, useRef } from 'react';

const COUNTRIES = [
  { name: "Greece", desc: "Global Headquarters - Eurocert SA (est. 1998), Greece", position: [39.0742, 21.8243], isHQ: true },
  { name: "Australia", desc: "Eurocert International Operations", position: [-25.2744, 133.7751] },
  { name: "Bahrain", desc: "Eurocert Regional Operations", position: [26.0667, 50.5577] },
  { name: "Bangladesh", desc: "Eurocert Regional Operations", position: [23.6850, 90.3563] },
  { name: "Bulgaria", desc: "Eurocert European Operations", position: [42.7339, 25.4858] },
  { name: "Canada", desc: "Eurocert Americas Operations", position: [56.1304, -106.3468] },
  { name: "Egypt", desc: "Eurocert MENA Operations", position: [26.8206, 30.8025] },
  { name: "France", desc: "Eurocert European Operations", position: [46.2276, 2.2137] },
  { name: "Gabon", desc: "Eurocert Africa Operations", position: [-0.8037, 11.6094] },
  { name: "Georgia", desc: "Eurocert Regional Operations", position: [42.3154, 43.3569] },
  { name: "India", desc: "Eurocert Asia Headquarters", position: [20.5937, 78.9629] },
  { name: "Iran", desc: "Eurocert Regional Operations", position: [32.4279, 53.6880] },
  { name: "Italy", desc: "Eurocert European Operations", position: [41.8719, 12.5674] },
  { name: "Japan", desc: "Eurocert East Asia Operations", position: [36.2048, 138.2529] },
  { name: "Jordan", desc: "Eurocert MENA Operations", position: [30.5852, 36.2384] },
  { name: "Kingdom of Saudi Arabia", desc: "Eurocert Middle East Operations", position: [23.8859, 45.0792] },
  { name: "Libya", desc: "Eurocert MENA Operations", position: [26.3351, 17.2283] },
  { name: "Malaysia", desc: "Eurocert Southeast Asia Operations", position: [4.2105, 101.9758] },
  { name: "Oman", desc: "Eurocert Regional Operations", position: [21.5126, 55.9233] },
  { name: "Pakistan", desc: "Eurocert South Asia Operations", position: [30.3753, 69.3451] },
  { name: "Poland", desc: "Eurocert European Operations", position: [51.9194, 19.1451] },
  { name: "Qatar", desc: "Eurocert Regional Operations", position: [25.3548, 51.1839] },
  { name: "Romania", desc: "Eurocert European Operations", position: [45.9432, 24.9668] },
  { name: "Serbia", desc: "Eurocert European Operations", position: [44.0165, 21.0059] },
  { name: "Spain", desc: "Eurocert European Operations", position: [40.4637, -3.7492] },
  { name: "Turkey", desc: "Eurocert Regional Operations", position: [38.9637, 35.2433] },
  { name: "UAE", desc: "Eurocert Middle East Operations", position: [23.4241, 53.8478] },
  { name: "United Kingdom", desc: "Eurocert UK & Ireland Operations", position: [55.3781, -3.4360] },
  { name: "Vietnam", desc: "Eurocert Southeast Asia Operations", position: [14.0583, 108.2772] }
];

export default function GlobalPresenceMap() {
  const [selectedCountry, setSelectedCountry] = useState("Greece");
  const [search, setSearch] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    let isMounted = true;

    const loadLeafletScript = () => {
      return new Promise((resolve, reject) => {
        const ensureCss = () =>
          new Promise((resolveCss) => {
            const existing = document.getElementById('leaflet-css-cdn');
            if (existing) {
              // Already applied -> resolve, otherwise wait for its load event
              if (existing.sheet) return resolveCss();
              existing.addEventListener('load', resolveCss);
              existing.addEventListener('error', resolveCss);
              return;
            }
            const link = document.createElement('link');
            link.id = 'leaflet-css-cdn';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            link.addEventListener('load', resolveCss);
            link.addEventListener('error', resolveCss);
            document.head.appendChild(link);
          });

        const ensureScript = () =>
          new Promise((resolveScript, rejectScript) => {
            if (window.L) {
              resolveScript(window.L);
              return;
            }
            if (document.getElementById('leaflet-js-cdn')) {
              const poll = setInterval(() => {
                if (window.L) {
                  clearInterval(poll);
                  resolveScript(window.L);
                }
              }, 50);
              return;
            }
            const script = document.createElement('script');
            script.id = 'leaflet-js-cdn';
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = () => resolveScript(window.L);
            script.onerror = () => rejectScript(new Error('Leaflet script failed to load'));
            document.head.appendChild(script);
          });

        // Guarantee the Leaflet CSS is applied BEFORE the map initializes.
        // Otherwise the tile panes are not absolutely positioned and the
        // tiles stack up, making the map "keep going" as the page scrolls.
        ensureCss()
          .then(ensureScript)
          .then(resolve)
          .catch(reject);
      });
    };

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      try {
        const L = await loadLeafletScript();
        if (!isMounted || !mapContainerRef.current || !L) return;

        // Cleanup existing Leaflet instance if present
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        if (mapContainerRef.current._leaflet_id) {
          mapContainerRef.current._leaflet_id = null;
        }

        // Initialize Leaflet Map centered over Mediterranean / Middle East
        const map = L.map(mapContainerRef.current, {
          center: [28.0, 35.0],
          zoom: 2.8,
          minZoom: 2,
          maxZoom: 8,
          zoomControl: false,
          attributionControl: false
        });

        mapInstanceRef.current = map;

        // Add Zoom Control at bottom right
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Add Dark Map Tile Layer (CartoDB Dark Matter)
        // Add Free Dark Map Tile Layer (Esri World Dark Gray Base with fallback)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const hqPos = [39.0742, 21.8243]; // Greece HQ

        // Curved Flight Path Helper
        const getCurvedPoints = (pos1, pos2) => {
          const lat1 = pos1[0], lng1 = pos1[1];
          const lat2 = pos2[0], lng2 = pos2[1];
          const midLat = (lat1 + lat2) / 2 + (lng2 - lng1) * 0.12;
          const midLng = (lng1 + lng2) / 2 - (lat2 - lat1) * 0.12;

          const points = [];
          for (let t = 0; t <= 1; t += 0.05) {
            const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * midLat + t * t * lat2;
            const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * midLng + t * t * lng2;
            points.push([lat, lng]);
          }
          return points;
        };

        // Add Markers and Connecting Arcs
        COUNTRIES.forEach((country) => {
          const isHQ = country.isHQ;

          if (!isHQ) {
            const curvedPoints = getCurvedPoints(hqPos, country.position);
            L.polyline(curvedPoints, {
              color: '#d8ad4c',
              weight: 1.5,
              opacity: 0.6,
              smoothFactor: 1,
              lineCap: 'round'
            }).addTo(map);
          }

          const markerHtml = isHQ 
            ? `<div style="display:flex; align-items:center; white-space:nowrap; cursor:pointer;">
                <div style="position:relative; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                  <div style="position:absolute; width:26px; height:26px; border-radius:50%; background:#d8ad4c; opacity:0.4; animation:pulse 2s infinite;"></div>
                  <div style="width:14px; height:14px; border-radius:50%; background:#d8ad4c; border:2px solid #ffffff; box-shadow:0 0 12px #d8ad4c;"></div>
                </div>
                <span style="margin-left:6px; font-size:12px; font-weight:800; color:#030a16; background:#d8ad4c; padding:2px 8px; border-radius:6px; font-family:system-ui,-apple-system,sans-serif; letter-spacing:0.02em; box-shadow:0 2px 8px rgba(0,0,0,0.5);">HQ Greece</span>
               </div>`
            : `<div style="display:flex; align-items:center; white-space:nowrap; cursor:pointer;">
                <div style="width:9px; height:9px; border-radius:50%; background:#ffffff; border:1.5px solid #d8ad4c; box-shadow:0 0 8px rgba(216,173,76,0.8); flex-shrink:0;"></div>
                <span style="margin-left:5px; font-size:11px; font-weight:700; color:#ffffff; text-shadow:0 1px 4px #000, 0 0 6px #000; font-family:system-ui,-apple-system,sans-serif;">${country.name}</span>
               </div>`;

          const customIcon = L.divIcon({
            html: markerHtml,
            className: 'custom-presence-marker',
            iconSize: [120, 24],
            iconAnchor: [6, 12]
          });

          const marker = L.marker(country.position, { icon: customIcon }).addTo(map);

          const popupContent = `
            <div style="background:#061021; color:#fff; padding:10px 14px; border-radius:12px; border:1px solid rgba(216,173,76,0.5); font-family:sans-serif; min-width:180px; box-shadow:0 10px 30px rgba(0,0,0,0.6);">
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                <strong style="font-size:14px; color:#d8ad4c;">${country.name}</strong>
              </div>
              <p style="margin:0; font-size:11px; color:rgba(255,255,255,0.75); line-height:1.4;">${country.desc}</p>
            </div>
          `;

          marker.bindPopup(popupContent, {
            closeButton: false,
            className: 'custom-presence-popup'
          });

          marker.on('click', () => {
            setSelectedCountry(country.name);
            map.setView(country.position, 4.5, { animate: true });
          });

          markersRef.current[country.name] = marker;
        });

        setMapLoaded(true);

        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 200);

      } catch (err) {
        console.error('GlobalPresenceMap init error:', err);
      }
    };

    const onResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    initMap();

    return () => {
      isMounted = false;
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleCountryClick = (c) => {
    setSelectedCountry(c.name);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(c.position, 4.5, { animate: true });
      if (markersRef.current[c.name]) {
        markersRef.current[c.name].openPopup();
      }
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#030a16] py-16 lg:py-24">
      <style dangerouslySetInnerHTML={{ __html: `
        .leaflet-tile-pane {
          filter: invert(100%) hue-rotate(180deg) brightness(80%) contrast(145%) sepia(90%) saturate(250%);
        }
        .leaflet-container {
          background: #030a16 !important;
        }
        .leaflet-tile-pane, .leaflet-overlay-pane, .leaflet-shadow-pane, .leaflet-marker-pane, .leaflet-tooltip-pane, .leaflet-popup-pane {
          position: absolute;
          left: 0;
          top: 0;
        }
        .leaflet-tile-container, .leaflet-tile, .leaflet-marker-icon, .leaflet-marker-shadow, .leaflet-image-layer {
          position: absolute !important;
          left: 0;
          top: 0;
        }
        .leaflet-container {
          overflow: hidden;
        }
        .leaflet-control-zoom a {
          background-color: #04122a !important;
          color: #d4a843 !important;
          border-color: rgba(212,168,67,0.3) !important;
        }
      ` }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(216,173,76,0.06)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d8ad4c]/10 border border-[#d8ad4c]/30 mb-4 shadow-[0_0_20px_rgba(216,173,76,0.15)]">
            <span className="w-2 h-2 rounded-full bg-[#d8ad4c] animate-pulse"></span>
            <span className="text-xs font-bold text-[#d8ad4c] uppercase tracking-widest">
              49 countries <span className="text-white/40 font-normal">and growing</span>
            </span>
          </div>

          <h2 className="heading-font text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4">
            Global <span className="text-[#d8ad4c] drop-shadow-[0_0_25px_rgba(216,173,76,0.6)]">Presence</span>
          </h2>

          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            With headquarters in Greece, Eurocert operates internationally through the Eurocert Group, supporting clients across industries worldwide.
          </p>
        </div>

        {/* Map Container Box */}
        <div className="relative rounded-3xl border border-white/15 bg-[#040d1a] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] mb-8">

          {/* Search Bar Overlay */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-md">
            <div className="relative shadow-2xl">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm"></i>
              <input
                type="text"
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#030a16]/95 backdrop-blur-md border border-white/20 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#d8ad4c] shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all"
              />
            </div>
          </div>

          {/* Leaflet Canvas Container */}
          <div 
            ref={mapContainerRef} 
            className="w-full h-[480px] sm:h-[560px] bg-[#030a16] relative z-10"
          >
            {!mapLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#030a16] text-white/60 text-sm">
                <div className="w-10 h-10 border-2 border-[#d8ad4c] border-t-transparent rounded-full animate-spin mb-4"></div>
                <span>Loading Interactive Map...</span>
              </div>
            )}
          </div>
        </div>

        {/* 49 Country Chips Grid */}
        <div className="rounded-3xl border border-white/10 bg-[#061021]/90 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-wrap gap-2 sm:gap-2.5 justify-center">
            {filteredCountries.map((c) => {
              const isSelected = selectedCountry === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => handleCountryClick(c)}
                  style={
                    isSelected 
                      ? { backgroundColor: '#d8ad4c', color: '#030a16', fontWeight: '800', border: '1.5px solid #d8ad4c', boxShadow: '0 0 20px rgba(216,173,76,0.6)', transform: 'scale(1.06)' } 
                      : {}
                  }
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                    isSelected
                      ? ''
                      : 'bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 hover:border-[#d8ad4c]/50'
                  }`}
                >
                  {c.isHQ && <span style={{ color: isSelected ? '#030a16' : '#d8ad4c', fontWeight: 'bold' }}>HQ</span>}
                  <span style={{ color: isSelected ? '#030a16' : '#ffffff', fontWeight: isSelected ? '800' : '600' }}>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  ); 
}
