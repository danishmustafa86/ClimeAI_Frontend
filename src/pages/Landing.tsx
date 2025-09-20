import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Bell,
  ArrowRight,
  Cloud,
  Sparkles,
  Zap
} from "lucide-react";

const Landing = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Conversational Weather Agent",
      description: "Get instant weather insights through natural conversation. Ask questions, get personalized forecasts, and understand weather patterns like never before.",
      color: "text-blue-400"
    },
    {
      icon: Calendar,
      title: "Event Weather Advisor",
      description: "Plan perfect events with weather-aware recommendations. Get detailed advice for outdoor gatherings, indoor events, and everything in between.",
      color: "text-green-400"
    },
    {
      icon: MapPin,
      title: "Travel Planner Agent",
      description: "Smart travel planning that considers weather conditions. Get route suggestions, packing advice, and weather-optimized travel recommendations.",
      color: "text-purple-400"
    },
    {
      icon: Bell,
      title: "Personalized Notifications",
      description: "Receive intelligent weather alerts tailored to your daily routines. Never be caught off guard by weather changes again.",
      color: "text-orange-400"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20">
                <Cloud className="h-16 w-16 text-primary" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-primary-glow bg-clip-text text-transparent">
              ClimeAI
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Your Intelligent Weather Companion
            </p>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience weather like never before with our AI-powered platform. Get personalized insights, 
              smart planning tools, and proactive notifications tailored to your lifestyle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chat">
                <Button variant="hero" size="lg" className="group">
                  Start Weather Chat
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="glass" size="lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powered by Advanced AI
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive weather intelligence platform combines cutting-edge AI with 
              real-time data to deliver unprecedented weather insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-gradient border-card-border shadow-card hover:shadow-elegant transition-smooth group">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-3 rounded-xl bg-accent/20 mb-4 ${feature.color} group-hover:scale-110 transition-spring`}>
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="card-gradient border-card-border shadow-elegant max-w-4xl mx-auto">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-3 rounded-xl bg-primary/20">
                  <Zap className="h-10 w-10 text-primary" />
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Experience the Future of Weather?
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of users who rely on ClimeAI for intelligent weather insights. 
                Start your journey with our conversational weather agent today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/chat">
                  <Button variant="hero" size="lg" className="group">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Start Chatting Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/events">
                  <Button variant="outline" size="lg">
                    <Calendar className="mr-2 h-5 w-5" />
                    Plan an Event
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Landing;