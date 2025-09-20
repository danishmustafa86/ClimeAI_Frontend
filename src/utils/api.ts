const API_BASE_URL = "https://zainattiq-climeai.hf.space/api";

export interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

export interface ChatResponse {
  response: string;
  audio_url?: string;
}

export interface ChatHistoryResponse {
  history: ChatMessage[];
}

export interface EventAdvisorRequest {
  longitude: number;
  latitude: number;
  from_time: string;
  to_time: string;
  event_type: "indoor" | "outdoor" | "hybrid" | "other";
  event_details: string;
}

export interface TravelAdvisorRequest {
  from_longitude: number;
  from_latitude: number;
  to_longitude: number;
  to_latitude: number;
  from_time: string;
  to_time: string;
  vehicle_type: "car" | "motorcycle" | "flight" | "train" | "bus" | "bicycle" | "walking" | "other";
  travel_details: string;
}

export interface AdvisorResponse {
  advice: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

// Chat API functions
export const sendChatMessage = async (userId: string, message: string): Promise<ChatResponse> => {
  const formData = new FormData();
  formData.append("input_type", "text");
  formData.append("user_id", userId);
  formData.append("message", message);

  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
};

export const sendVoiceMessage = async (userId: string, audioFile: File): Promise<ChatResponse> => {
  const formData = new FormData();
  formData.append("input_type", "voice");
  formData.append("user_id", userId);
  formData.append("audio", audioFile);

  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to send voice message");
  }

  return response.json();
};

export const getAudioUrl = (userId: string): string => {
  return `${API_BASE_URL}/chat/audio/${userId}`;
};

export const getChatHistory = async (userId: string): Promise<ChatHistoryResponse> => {
  const response = await fetch(`${API_BASE_URL}/chatHistory/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch chat history");
  }

  return response.json();
};

// Event Advisor API
export const getEventAdvice = async (request: EventAdvisorRequest): Promise<AdvisorResponse> => {
  const response = await fetch(`${API_BASE_URL}/event-advisor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to get event advice");
  }

  return response.json();
};

// Travel Advisor API
export const getTravelAdvice = async (request: TravelAdvisorRequest): Promise<AdvisorResponse> => {
  const response = await fetch(`${API_BASE_URL}/travel-advisor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to get travel advice");
  }

  return response.json();
};