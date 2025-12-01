import React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePioneers, type Pioneer } from "@/hooks/usePioneers";
import { Loader2, ExternalLink } from "lucide-react";

// Fix default icon paths so markers render correctly in Vite
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function uniqueSorted<T>(arr: T[]): T[] {
  return Array.from(new Set(arr)).sort((a, b) => `${a}`.localeCompare(`${b}`));
}

const DEFAULT_CENTER: [number, number] = [20, 0];

export default function WorldPioneersMap() {
  const { pioneers, loading, error } = usePioneers();
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  
  const setMapRef = (map: L.Map | null) => {
    mapRef.current = map;
  };

  useEffect(() => setIsClient(true), []);

  const allFocusAreas = useMemo(
    () => uniqueSorted(pioneers.flatMap((p) => p.focusAreas || [])),
    [pioneers],
  );

  const filtered = useMemo(() => {
    if (selectedAreas.length === 0) return pioneers;
    return pioneers.filter((p) => 
      p.focusAreas && p.focusAreas.some((a) => selectedAreas.includes(a))
    );
  }, [selectedAreas, pioneers]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !filtered.length) return;

    const validPoints = filtered.filter((p) => p.location.lat && p.location.lng);
    if (validPoints.length === 0) {
      map.setView(DEFAULT_CENTER, 2);
      return;
    }

    if (validPoints.length === 1) {
      map.setView([validPoints[0].location.lat!, validPoints[0].location.lng!], 6);
      return;
    }

    const bounds = L.latLngBounds(
      validPoints.map((p) => [p.location.lat!, p.location.lng!] as [number, number])
    );
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
  }, [filtered]);

  if (error) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <p>Failed to load pioneers data. Please try again later.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Filter by focus area:</span>
        <div className="flex-1">
          <ToggleGroup
            type="multiple"
            value={selectedAreas}
            onValueChange={(v) => setSelectedAreas(v)}
            className="flex gap-2 overflow-x-auto pb-1"
          >
            {allFocusAreas.map((area) => (
              <ToggleGroupItem key={area} value={area} aria-label={area} className="whitespace-nowrap px-3">
                {area}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {selectedAreas.length > 0 && (
          <Button size="sm" variant="ghost" onClick={() => setSelectedAreas([])}>
            Clear filters
          </Button>
        )}
      </div>

      {isClient && (
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={2}
          minZoom={2}
          maxZoom={18}
          className="h-72 sm:h-[520px] w-full rounded-lg overflow-hidden"
          ref={setMapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filtered
            .filter((p) => p.location.lat && p.location.lng)
            .map((p) => (
              <Marker key={p.id} position={[p.location.lat!, p.location.lng!] as [number, number]}>
                <Popup>
                  <div className="space-y-2 min-w-[200px]">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-semibold text-base">{p.name}</div>
                        {p.title && <div className="text-sm text-muted-foreground">{p.title}</div>}
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-medium">{p.location.city ? `${p.location.city}, ` : ''}{p.location.country}</span>
                    </div>

                    {p.bio && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{p.bio}</p>
                    )}

                    {p.projects && p.projects.length > 0 && (
                      <div className="text-xs">
                        <span className="font-medium">Projects:</span> {p.projects.join(', ')}
                      </div>
                    )}

                    {p.focusAreas && p.focusAreas.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {p.focusAreas.map((fa) => (
                          <Badge key={fa} variant="secondary" className="text-[10px]">
                            {fa}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-1">
                      {p.website && (
                        <a
                          href={p.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          Website <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {p.linkedin && (
                        <a
                          href={p.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          LinkedIn <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      )}
    </div>
  );
}
