import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation, MapPin, Clock, Loader2, Plane } from "lucide-react";
import LocationPicker from "@/components/LocationPicker";
import { getTravelAdvice } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface TravelForm {
  fromLatitude: number;
  fromLongitude: number;
  toLatitude: number;
  toLongitude: number;
  fromTime: string;
  toTime: string;
  vehicleType: "car" | "motorcycle" | "flight" | "train" | "bus" | "bicycle" | "walking" | "other";
  travelDetails: string;
}

const TravelAdvisor = () => {
  const [formData, setFormData] = useState<TravelForm>({
    fromLatitude: 40.7128,
    fromLongitude: -74.0060,
    toLatitude: 34.0522,
    toLongitude: -118.2437,
    fromTime: "",
    toTime: "",
    vehicleType: "car",
    travelDetails: "",
  });
  const [advice, setAdvice] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isTransportOpen, setIsTransportOpen] = useState(false);

  // Ensure page remains scrollable when Radix Select is open
  const handleTransportOpenChange = (open: boolean) => {
    const html = document.documentElement;
    const body = document.body;
    if (open) {
      html.style.overflow = "auto";
      body.style.overflow = "auto";
    } else {
      // Let the global styles decide; remove any inline overrides we set
      html.style.removeProperty("overflow");
      body.style.removeProperty("overflow");
    }
    setIsTransportOpen(open);
  };

  // While the transport dropdown is open, ensure page scroll works even
  // when the cursor is not over the dropdown by forwarding wheel events.
  // This is a non-invasive listener that is attached only during the open state.
  React.useEffect(() => {
    if (!isTransportOpen) return;
    const onWheel = (e: WheelEvent) => {
      // If default scrolling didn't happen (common on some devices/browsers
      // when focus is trapped), manually scroll the window.
      // We use passive: false and preventDefault to avoid bounce-back.
      e.preventDefault();
      window.scrollBy({ top: e.deltaY, left: 0, behavior: "auto" });
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel as EventListener);
  }, [isTransportOpen]);

  const handleFromLocationChange = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, fromLatitude: lat, fromLongitude: lng }));
  };

  const handleToLocationChange = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, toLatitude: lat, toLongitude: lng }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fromTime || !formData.toTime) {
      toast({
        title: "Missing Information",
        description: "Please select both departure and arrival times.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await getTravelAdvice({
        from_latitude: formData.fromLatitude,
        from_longitude: formData.fromLongitude,
        to_latitude: formData.toLatitude,
        to_longitude: formData.toLongitude,
        from_time: formData.fromTime,
        to_time: formData.toTime,
        vehicle_type: formData.vehicleType,
        travel_details: formData.travelDetails,
      });
      
      setAdvice(response.advice);
      
      toast({
        title: "Success",
        description: "Travel advice generated successfully!",
      });
    } catch (error) {
      console.error("Failed to get travel advice:", error);
      toast({
        title: "Error",
        description: "Failed to get travel advice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Travel Weather Advisor
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Plan your journey with weather-aware travel recommendations. Get insights 
          for safe and comfortable travel based on weather conditions.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <Card className="card-gradient border-card-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Navigation className="h-5 w-5 text-primary" />
              <span>Travel Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* From Location */}
              <LocationPicker
                latitude={formData.fromLatitude}
                longitude={formData.fromLongitude}
                onLocationChange={handleFromLocationChange}
                label="Departure Location"
              />

              {/* To Location */}
              <LocationPicker
                latitude={formData.toLatitude}
                longitude={formData.toLongitude}
                onLocationChange={handleToLocationChange}
                label="Destination"
              />

              {/* Time Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departure-time" className="text-sm font-medium mb-2 block">
                    <Clock className="h-4 w-4 inline mr-2" />
                    Departure Time
                  </Label>
                  <Input
                    id="departure-time"
                    type="datetime-local"
                    value={formData.fromTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, fromTime: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="arrival-time" className="text-sm font-medium mb-2 block">
                    <Clock className="h-4 w-4 inline mr-2" />
                    Arrival Time
                  </Label>
                  <Input
                    id="arrival-time"
                    type="datetime-local"
                    value={formData.toTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, toTime: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Vehicle Type */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Transportation Method
                </Label>
                <Select 
                  value={formData.vehicleType} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    vehicleType: value as TravelForm["vehicleType"] 
                  }))}
                  onOpenChange={handleTransportOpenChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transportation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="flight">Flight</SelectItem>
                    <SelectItem value="train">Train</SelectItem>
                    <SelectItem value="bus">Bus</SelectItem>
                    <SelectItem value="bicycle">Bicycle</SelectItem>
                    <SelectItem value="walking">Walking</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Travel Details */}
              <div>
                <Label htmlFor="travel-details" className="text-sm font-medium mb-2 block">
                  Travel Details
                </Label>
                <Textarea
                  id="travel-details"
                  placeholder="Additional details (luggage, number of passengers, route preferences, special constraints, etc.)"
                  value={formData.travelDetails}
                  onChange={(e) => setFormData(prev => ({ ...prev, travelDetails: e.target.value }))}
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Travel Advice...
                  </>
                ) : (
                  <>
                    <Plane className="mr-2 h-4 w-4" />
                    Get Travel Advice
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Advice Section */}
        <Card className="card-gradient border-card-border shadow-card">
          <CardHeader>
            <CardTitle>Weather Travel Advice</CardTitle>
          </CardHeader>
          <CardContent>
            {advice ? (
              <div className="prose prose-invert max-w-none text-card-foreground">
                <ReactMarkdown>
                  {advice}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="text-center py-12">
                <Navigation className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Complete your travel details and click "Get Travel Advice" to receive 
                  weather-informed recommendations for your journey.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TravelAdvisor;