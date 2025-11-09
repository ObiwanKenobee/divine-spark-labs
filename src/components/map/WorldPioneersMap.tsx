import React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { pioneers, type Pioneer } from "@/data/pioneers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => setIsClient(true), []);

  const allFocusAreas = useMemo(
    () => uniqueSorted(pioneers.flatMap((p) => p.focusAreas)),
    [],
  );

  const filtered = useMemo(() => {
    if (selectedAreas.length === 0) return pioneers;
    return pioneers.filter((p) => p.focusAreas.some((a) => selectedAreas.includes(a)));
  }, [selectedAreas]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (filtered.length === 0) {
      map.setView(DEFAULT_CENTER, 2);
      return;
    }

    const bounds = L.latLngBounds(filtered.map((p) => [p.location.lat, p.location.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [filtered]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Filter by focus area:</span>
        <ToggleGroup type="multiple" value={selectedAreas} onValueChange={(v) => setSelectedAreas(v)}>
          {allFocusAreas.map((area) => (
            <ToggleGroupItem key={area} value={area} aria-label={area}>
              {area}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
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
          className="h-[520px] w-full rounded-lg overflow-hidden"
          whenCreated={(map) => (mapRef.current = map)}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filtered.map((p) => (
            <Marker key={p.id} position={[p.location.lat, p.location.lng] as [number, number]}>
              <Popup>
                <div className="space-y-1">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-muted-foreground">{p.title}</div>
                  <div className="text-sm">{p.location.city}, {p.location.country}</div>
                  <div className="text-sm">Project: {p.project}</div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {p.focusAreas.map((fa) => (
                      <Badge key={fa} variant="secondary" className="text-[10px]">
                        {fa}
                      </Badge>
                    ))}
                  </div>
                  {p.website && (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary underline"
                    >
                      Learn more
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}
