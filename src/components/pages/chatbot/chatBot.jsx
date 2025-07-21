"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { MessageCircle, X, Send } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isInitialResponse, setIsInitialResponse] = useState(true);

  const handleSendMessage = async () => {
    if (!input.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    setIsLoading(true);

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    const updatedHistory = [
      ...conversationHistory,
      {
        role: "user",
        content: input,
        timestamp: new Date().toISOString(),
      },
    ];

    try {
      const { data } = await axios.post('/api/chatbot', {
        message: input,
        conversationHistory: updatedHistory
      });

      const botResponse = data.response;
      
      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);

      setConversationHistory([
        ...updatedHistory,
        {
          role: "assistant",
          content: botResponse,
          timestamp: new Date().toISOString(),
        },
      ]);

      if (isInitialResponse) {
        setIsInitialResponse(false);
        setCurrentQuestionIndex(1);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      toast.error("Failed to fetch response. Please try again.");
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-20  right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="w-16 h-16 rounded-full shadow-lg">
          <MessageCircle size={34} />
        </Button>
      ) : (
        <Card className="w-[400px] portrait:w-[350px] h-[500px] shadow-lg  animate-in slide-in-from-bottom-2">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="flex justify-between items-center">
              Legal Advice Chatbot
              <Button
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:text-primary-foreground/90">
                <X size={20} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-8rem)]">
            <ScrollArea className="h-full p-4">
              {messages.length === 0 && (
                <p className="text-center text-muted-foreground mt-4">
                  Hello! I&apos;m your legal advice chatbot. How can I assist you
                  today?
                </p>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "mb-4",
                    message.sender === "user" ? "text-right" : "text-left"
                  )}>
                  <div
                    className={cn(
                      "inline-block p-3 rounded-lg max-w-[80%]",
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    )}>
                    {message.sender === "user" ? (
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    ) : (
                      <div className="markdown-content">
                        <ReactMarkdown
                          components={{
                            h1: ({ node, ...props }) => (
                              <h1
                                className="text-xl font-bold my-2"
                                {...props}
                              />
                            ),
                            h2: ({ node, ...props }) => (
                              <h2
                                className="text-lg font-bold my-2"
                                {...props}
                              />
                            ),
                            h3: ({ node, ...props }) => (
                              <h3
                                className="text-md font-bold my-2"
                                {...props}
                              />
                            ),
                            p: ({ node, ...props }) => (
                              <p className="my-2" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul className="list-disc ml-4 my-2" {...props} />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol
                                className="list-decimal ml-4 my-2"
                                {...props}
                              />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="my-1" {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong className="font-bold" {...props} />
                            ),
                            em: ({ node, ...props }) => (
                              <em className="italic" {...props} />
                            ),
                          }}>
                          {message.text}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="text-left">
                  <div className="inline-block p-3 rounded-lg bg-secondary text-secondary-foreground">
                    Typing...
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="bg-background">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex w-full gap-2">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                <Send size={18} />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

export default ChatBot;
