import axios from "axios";

const GEMINI_API = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const fetchGeminiResponse = async (prompt, apikey) => {
  if (!apikey) {
    console.error("API key is not configured");
    throw new Error("API key is not configured");
  }
  if (!prompt.trim()) {
    console.error("Prompt cannot be empty");
    throw new Error("Prompt cannot be empty");
  }

  console.log("Making request to Gemini API...");
  console.log("API Key present:", !!apikey);
  console.log("API Key starts with:", apikey?.substring(0, 10) + "...");

  try {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    const requestData = {
      contents: [{ parts: [{ text: prompt }] }],
    };
    const config = {
      params: { key: apikey },
      headers: { "Content-Type": "application/json" },
    };

    console.log("Request URL:", url);
    console.log("Request config:", { ...config, params: { key: "***" } });
    
    const response = await axios.post(url, requestData, config);
    
    console.log("Gemini API Response Status:", response.status);
    console.log("Gemini API Response Data:", JSON.stringify(response.data, null, 2));
    
    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("Invalid Gemini API response structure:", response.data);
      throw new Error("Invalid response from AI service - no text content found");
    }
    
    return response.data.candidates[0].content.parts[0].text;
  } catch (e) {
    console.error("Gemini API error details:");
    console.error("Error message:", e.message);
    console.error("Error status:", e.response?.status);
    console.error("Error data:", e.response?.data);
    console.error("Full error:", e);
    
    const errorMessage = e.response?.data?.error?.message || 
                        e.response?.statusText || 
                        e.message || 
                        "Error connecting to AI service";
    throw new Error(errorMessage);
  }
};

const chatbot = async (question, conversationHistory = []) => {
  try {
    // Create a formatted conversation history string
    const historyText = conversationHistory
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const prompt = `You are a legal advice chatbot designed to provide helpful, accurate, and empathetic legal guidance to women in India. Your goal is to assist Indian women in understanding their legal rights, options, and resources in a clear and supportive manner. 
    You will have to talk to the user about their problems and ask questions accordingly. Dont blast them with questions in a single response. ask your questions one by one and gain information and context from them.

Key Instructions:
1. Keep responses concise and focused
2. Ask specific follow-up questions when more context is needed
3. Always base advice on Indian legal principles
4. Be empathetic and non-judgmental
5. Prioritize user safety and well-being
6. Provide relevant Indian helpline numbers and resources when appropriate
7. Maintain conversation context and refer back to previous messages when relevant

Previous Conversation:
${historyText}

User's latest message: ${question}

Provide a response that:
- Acknowledges the user's message
- Asks relevant follow-up questions if needed
- Gives clear, actionable advice based on available information
- Includes specific Indian resources/helplines if relevant`;

    return await fetchGeminiResponse(prompt, GEMINI_API);
  } catch (error) {
    console.error("Chatbot error:", error);
    return "I'm sorry, there was an error processing your request. Please try again later.";
  }
};

export default chatbot;
