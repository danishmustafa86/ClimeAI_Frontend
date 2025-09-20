import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEwQzIxIDcgMTYuNTI1IDIgMTIgMkM3LjQ3NSAyIDMgNyAzIDEwQzMgMTMuNTkgNi45MSAxOS4xNyAxMi4yIDIzLjQyQzEyLjM3IDIzLjU3IDEyLjY4IDIzLjU3IDEyLjg0IDIzLjQyQzE4LjA5IDE5LjE3IDIxIDEzLjU5IDIxIDEwWiIgc3Ryb2tlPSIjMDA5REZGIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IiMwMDlERkYiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iMyIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEwQzIxIDcgMTYuNTI1IDIgMTIgMkM3LjQ3NSAyIDMgNyAzIDEwQzMgMTMuNTkgNi45MSAxOS4xNyAxMi4yIDIzLjQyQzEyLjM3IDIzLjU3IDEyLjY4IDIzLjU3IDEyLjg0IDIzLjQyQzE4LjA5IDE5LjE3IDIxIDEzLjU5IDIxIDEwWiIgc3Ryb2tlPSIjMDA5REZGIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IiMwMDlERkYiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iMyIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
  shadowUrl: '',
  shadowSize: [0, 0],
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  label?: string;
}

const LocationPicker = ({ 
  latitude, 
  longitude, 
  onLocationChange, 
  label = "Location" 
}: LocationPickerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Initialize map using vanilla Leaflet
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map
    const map = L.map(mapRef.current).setView([latitude, longitude], 10);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add marker
    const marker = L.marker([latitude, longitude]).addTo(map);

    // Handle map clicks
    map.on('click', (e) => {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Update marker position when coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && latitude && longitude) {
      const newLatLng = L.latLng(latitude, longitude);
      markerRef.current.setLatLng(newLatLng);
      mapInstanceRef.current.setView(newLatLng, mapInstanceRef.current.getZoom());
    }
  }, [latitude, longitude]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Using a simple geocoding approach with Nominatim (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        onLocationChange(lat, lng);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="location-search" className="text-sm font-medium mb-2 block">
          {label}
        </Label>
        
        {/* Search */}
        <div className="flex space-x-2 mb-4">
          <Input
            id="location-search"
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch} 
            disabled={isSearching || !searchQuery.trim()}
            variant="outline"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Map */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="h-64 w-full">
              <div ref={mapRef} className="h-full w-full rounded-lg" />
            </div>
          </CardContent>
        </Card>

        {/* Coordinate Inputs */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="latitude" className="text-sm font-medium mb-1 block">
              Latitude
            </Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => onLocationChange(parseFloat(e.target.value) || 0, longitude)}
              placeholder="0.0000"
            />
          </div>
          <div>
            <Label htmlFor="longitude" className="text-sm font-medium mb-1 block">
              Longitude
            </Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => onLocationChange(latitude, parseFloat(e.target.value) || 0)}
              placeholder="0.0000"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;