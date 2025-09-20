import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { sendChatMessage, sendVoiceMessage, getChatHistory, type ChatMessage } from "@/utils/api";
import { getUserId } from "@/utils/user";
import { useToast } from "@/hooks/use-toast";

const ChatAgent = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const { toast } = useToast();

  const userId = getUserId();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadChatHistory();
  }, []);

  // Auto-focus input after bot responds
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const loadChatHistory = async () => {
    try {
      const response = await getChatHistory(userId);
      setMessages(response.history);
    } catch (error) {
      console.error("Failed to load chat history:", error);
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
        
        // Send voice message
        await handleVoiceMessage(audioFile);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Error",
        description: "Failed to start recording. Please check microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceMessage = async (audioFile: File) => {
    setIsLoading(true);
    
    try {
      const response = await sendVoiceMessage(userId, audioFile);
      
      // Add bot response to UI with audio URL
      const botMessage: ChatMessage = { 
        role: "bot", 
        content: response.response,
        audio_url: response.audio_url
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to send voice message:", error);
      toast({
        title: "Error",
        description: "Failed to send voice message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (messageIndex: number) => {
    const message = messages[messageIndex];
    if (!message.audio_url) return;

    // Stop any currently playing audio
    stopAllAudio();

    // Get or create audio element for this message
    let audioElement = audioRefs.current.get(messageIndex.toString());
    if (!audioElement) {
      audioElement = new Audio(message.audio_url);
      audioElement.addEventListener('ended', () => setPlayingAudioId(null));
      audioElement.addEventListener('error', (e) => {
        console.error("Audio loading error:", e);
        toast({
          title: "Audio Error",
          description: "Failed to load audio. Please try again.",
          variant: "destructive",
        });
        setPlayingAudioId(null);
      });
      audioRefs.current.set(messageIndex.toString(), audioElement);
    }

    audioElement.play().catch((error) => {
      console.error("Error playing audio:", error);
      toast({
        title: "Audio Error",
        description: "Failed to play audio. Please try again.",
        variant: "destructive",
      });
      setPlayingAudioId(null);
    });
    setPlayingAudioId(messageIndex.toString());
  };

  const stopAudio = (messageIndex: number) => {
    const audioElement = audioRefs.current.get(messageIndex.toString());
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    if (playingAudioId === messageIndex.toString()) {
      setPlayingAudioId(null);
    }
  };

  const stopAllAudio = () => {
    audioRefs.current.forEach((audioElement) => {
      audioElement.pause();
      audioElement.currentTime = 0;
    });
    setPlayingAudioId(null);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    // Add user message to UI immediately
    const newUserMessage: ChatMessage = { role: "user", content: userMessage };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await sendChatMessage(userId, userMessage);
      
      // Add bot response to UI with audio URL
      const botMessage: ChatMessage = { 
        role: "bot", 
        content: response.response,
        audio_url: response.audio_url
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      
      // Remove the user message if the request failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingHistory) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading chat history...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      className="relative bg-cover bg-center"
      style={{ backgroundImage: "url('/pexels-hikaique-125510.jpg')" }}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl relative">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
          Conversational Weather Agent
        </h1>
        <p className="text-2xl text-black">
          Ask me anything about weather! I'm here to provide personalized insights and forecasts.
        </p>
      </div>

      <Card className="card-gradient border-card-border shadow-elegant h-[600px] flex flex-col">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Start a conversation! Ask me about weather conditions, forecasts, or any weather-related questions.
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start space-x-3 max-w-[80%] ${
                        message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        message.role === "user" 
                          ? "bg-primary/20 text-primary" 
                          : "bg-accent text-accent-foreground"
                      }`}>
                        {message.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {message.role === "bot" && message.audio_url && (
                          <div className="mt-2 flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={playingAudioId === index.toString() ? () => stopAudio(index) : () => playAudio(index)}
                              className="h-6 px-2 text-xs"
                            >
                              {playingAudioId === index.toString() ? (
                                <VolumeX className="h-3 w-3" />
                              ) : (
                                <Volume2 className="h-3 w-3" />
                              )}
                              <span className="ml-1">
                                {playingAudioId === index.toString() ? "Stop" : "Listen"}
                              </span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    <div className="p-2 rounded-full bg-accent text-accent-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-card-border p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me about the weather..."
                disabled={isLoading || isRecording}
                className="flex-1 bg-input border-input-border focus:border-primary"
              />
              
              {/* Voice Recording Button */}
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
                className="px-3"
              >
                {isRecording ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              
              
              {/* Send Button */}
              <Button 
                type="submit" 
                disabled={!inputMessage.trim() || isLoading || isRecording}
                className="px-6"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
            
            {/* Recording Status */}
            {isRecording && (
              <div className="mt-2 flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                <span>Recording... Click the microphone to stop</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    </section>
  );
};

export default ChatAgent;