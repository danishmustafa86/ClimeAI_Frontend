import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Loader2 } from "lucide-react";
import LocationPicker from "@/components/LocationPicker";
import { getEventAdvice } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface EventForm {
  latitude: number;
  longitude: number;
  fromTime: string;
  toTime: string;
  eventType: "indoor" | "outdoor" | "hybrid" | "other";
  eventDetails: string;
}

const EventAdvisor = () => {
  const [formData, setFormData] = useState<EventForm>({
    latitude: 40.7128,
    longitude: -74.0060,
    fromTime: "",
    toTime: "",
    eventType: "outdoor",
    eventDetails: "",
  });
  const [advice, setAdvice] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isEventTypeOpen, setIsEventTypeOpen] = useState(false);

  // Keep page scrollable even when the Event Type dropdown is open
  const handleEventTypeOpenChange = (open: boolean) => {
    const html = document.documentElement;
    const body = document.body;
    if (open) {
      html.style.overflow = "auto";
      body.style.overflow = "auto";
    } else {
      html.style.removeProperty("overflow");
      body.style.removeProperty("overflow");
    }
    setIsEventTypeOpen(open);
  };

  React.useEffect(() => {
    if (!isEventTypeOpen) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      window.scrollBy({ top: e.deltaY, left: 0, behavior: "auto" });
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel as EventListener);
  }, [isEventTypeOpen]);

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fromTime || !formData.toTime) {
      toast({
        title: "Missing Information",
        description: "Please select both start and end times for your event.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await getEventAdvice({
        latitude: formData.latitude,
        longitude: formData.longitude,
        from_time: formData.fromTime,
        to_time: formData.toTime,
        event_type: formData.eventType,
        event_details: formData.eventDetails,
      });
      
      setAdvice(response.advice);
      
      toast({
        title: "Success",
        description: "Event advice generated successfully!",
      });
    } catch (error) {
      console.error("Failed to get event advice:", error);
      toast({
        title: "Error",
        description: "Failed to get event advice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Event Weather Advisor
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Plan your perfect event with weather-aware recommendations. Get detailed advice 
          tailored to your event type, location, and timing.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <Card className="card-gradient border-card-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Event Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location */}
              <LocationPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onLocationChange={handleLocationChange}
                label="Event Location"
              />

              {/* Time Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from-time" className="text-sm font-medium mb-2 block">
                    <Clock className="h-4 w-4 inline mr-2" />
                    Start Time
                  </Label>
                  <Input
                    id="from-time"
                    type="datetime-local"
                    value={formData.fromTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, fromTime: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="to-time" className="text-sm font-medium mb-2 block">
                    <Clock className="h-4 w-4 inline mr-2" />
                    End Time
                  </Label>
                  <Input
                    id="to-time"
                    type="datetime-local"
                    value={formData.toTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, toTime: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Event Type */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Event Type
                </Label>
                <Select 
                  value={formData.eventType} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    eventType: value as EventForm["eventType"] 
                  }))}
                  onOpenChange={handleEventTypeOpenChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outdoor">Outdoor Event</SelectItem>
                    <SelectItem value="indoor">Indoor Event</SelectItem>
                    <SelectItem value="hybrid">Hybrid Event</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Event Details */}
              <div>
                <Label htmlFor="event-details" className="text-sm font-medium mb-2 block">
                  Event Details
                </Label>
                <Textarea
                  id="event-details"
                  placeholder="Describe your event (agenda, audience, special requirements, constraints, etc.)"
                  value={formData.eventDetails}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventDetails: e.target.value }))}
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
                    Getting Weather Advice...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Get Event Advice
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Advice Section */}
        <Card className="card-gradient border-card-border shadow-card">
          <CardHeader>
            <CardTitle>Weather Advice</CardTitle>
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
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Fill out the event details and click "Get Event Advice" to receive 
                  personalized weather recommendations for your event.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventAdvisor;