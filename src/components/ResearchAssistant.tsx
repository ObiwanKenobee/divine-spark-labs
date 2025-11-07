import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, X, Send, Loader2, Sparkles, FileText, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestedTopics = [
  { icon: Lightbulb, label: "Divine Innovation", query: "Tell me about divine innovation and how faith intersects with technology" },
  { icon: FileText, label: "Ethical AI", query: "What research does JMF have on ethical AI development?" },
  { icon: BookOpen, label: "Fellowship Programs", query: "What fellowship opportunities are available at JMF?" },
  { icon: Sparkles, label: "Consciousness Studies", query: "Explore JMF's research on consciousness and technology" },
];

const ResearchAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamResearch = async (userMessage: string) => {
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/research-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: newMessages }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Failed to start stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages([...newMessages, { role: "assistant", content: assistantMessage }]);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Research assistant error:", error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "I apologize, but I encountered an error. Please try again." },
      ]);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    await streamResearch(userMessage);
  };

  const handleSuggestedTopic = (query: string) => {
    setInput(query);
  };

  return (
    <>
      {/* Research Assistant Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg z-50",
          "bg-primary text-primary-foreground hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] hover:scale-105 transition-all"
        )}
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
      </Button>

      {/* Research Assistant Window */}
      {isOpen && (
        <div className="fixed bottom-44 right-6 w-full max-w-md h-[600px] bg-card border border-border rounded-lg shadow-2xl z-40 flex flex-col sm:w-96">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-5 w-5" />
              <h3 className="font-semibold text-lg">Research Assistant</h3>
            </div>
            <p className="text-sm text-primary-foreground/80">Explore JMF's resources & research</p>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="text-center text-muted-foreground py-4">
                  <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-medium mb-2">AI-Powered Research Discovery</p>
                  <p className="text-xs">Ask me about JMF's research, projects, or explore topics</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground px-2">Suggested Topics:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {suggestedTopics.map((topic, idx) => {
                      const Icon = topic.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSuggestedTopic(topic.query)}
                          className="flex items-center gap-2 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-left group"
                        >
                          <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-xs text-foreground group-hover:text-primary transition-colors">
                            {topic.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-lg px-4 py-2",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground rounded-lg px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about research, projects, or topics..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ResearchAssistant;
