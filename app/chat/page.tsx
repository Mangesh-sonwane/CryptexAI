"use client";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@mui/material";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { formatMarkdown } from "@/constants/format";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom when messages change
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const response = await axios.post("/api/chat", { message: input });

      if (response.data && response.data.reply) {
        const botMessage: Message = {
          id: messages.length + 2,
          text: response.data.reply,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        console.error("No reply from server:", response.data);
      }
    } catch (error) {
      console.error("Error fetching bot reply:", error);
      const botMessage: Message = {
        id: messages.length + 2,
        text: "Sorry, I couldn't get a response.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Chat Messages */}
      <div
        className="background-light800_darkgradient h-[600px] grow overflow-y-auto p-4"
        ref={chatRef}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 gap-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}
          >
            <p
              className={`inline-block rounded-lg px-4 py-2 ${
                msg.sender === "user"
                  ? "primary-gradient text-white"
                  : "text-dark400_light500 background-light700_dark300 text-sm font-normal"
              } max-w-[70%]`}
              dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }}
            />
            <p className="mt-2 text-sm font-normal leading-5 text-gray-500">
              {msg.timestamp}
            </p>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="background-light900_dark200 flex gap-4 p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          placeholder="Type your message..."
          className="paragraph-regular no-focus placeholder text-dark400_light700 w-full border-none p-2 shadow-none outline-none"
        />

        <Button
          className="primary-gradient mt-2 w-[150px] !rounded-xl !font-semibold text-light-900"
          startIcon={<PaperPlaneTilt size={24} />}
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;
