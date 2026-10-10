import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { Send, Square, Wrench, RotateCcw, Loader2 } from "lucide-react";
import { CadAssistant } from "@/components/CadAssistant";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cad")({
  head: () => ({
    meta: [
      { title: "CAD Assistant — MechMind Lab" },
      { name: "description", content: "Step-by-step modeling plans, drawing checklists and an AI SolidWorks troubleshooter." },
      { property: "og:title", content: "CAD Assistant — MechMind Lab" },
      { property: "og:description", content: "Step-by-step modeling plans, drawing checklists and an AI SolidWorks troubleshooter." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <CadAssistant extra={<SolidWorksChat />} />,
});

const QUICK = [
  "My sketch is over-defined (red/yellow). How do I fix it?",
  "My assembly mates are broken after editing a part",
  "Rebuild error: 'Unable to create this fillet'",
  "Dangling reference after deleting a feature",
  "Extrude fails: zero-thickness geometry",
  "Sketch is under-defined (blue) — how to fully define?",
];

function SolidWorksChat() {
  const { messages, sendMessage, status, stop, error, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/cad-chat" }),
  });
  const [input, setInput] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const ta = useRef<HTMLTextAreaElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight }); }, [messages, status]);
  useEffect(() => { if (!busy) ta.current?.focus({ preventScroll: true }); }, [busy]);

  const send = (text: string) => {
    if (!text.trim() || busy) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <section className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-border p-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-primary"><Wrench className="h-5 w-5" /></span>
          <div>
            <h2 className="font-semibold">SolidWorks Troubleshooter</h2>
            <p className="text-xs text-muted-foreground">AI-powered help for sketch, mate and rebuild errors</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button size="sm" variant="ghost" onClick={() => setMessages([])} disabled={busy}><RotateCcw /> New chat</Button>
        )}
      </div>

      <div ref={box} className="max-h-[480px] min-h-[240px] space-y-4 overflow-y-auto p-4 sm:p-6">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">Describe your SolidWorks error, or pick a common one below.</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : ""}>
            {m.parts.map((part, i) =>
              part.type === "text" ? (
                m.role === "user" ? (
                  <p key={i} className="max-w-[85%] rounded-2xl bg-primary px-4 py-2 text-sm text-primary-foreground">{part.text}</p>
                ) : (
                  <div key={i} className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 [&_p]:my-2 [&_strong]:text-accent-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1">
                    <ReactMarkdown>{part.text}</ReactMarkdown>
                  </div>
                )
              ) : null,
            )}
          </div>
        ))}
        {status === "submitted" && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Diagnosing…</p>
        )}
        {error && <p className="text-sm text-destructive">{error.message || "Something went wrong. Please try again."}</p>}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-border px-4 pt-4 sm:px-6">
        {QUICK.map((q) => (
          <button key={q} onClick={() => send(q)} disabled={busy}
            className="rounded-full border border-primary/30 bg-accent/50 px-3 py-1.5 text-xs text-accent-foreground transition hover:border-primary hover:bg-accent disabled:opacity-50">
            {q}
          </button>
        ))}
      </div>

      <form className="flex items-end gap-2 p-4 sm:px-6" onSubmit={(e) => { e.preventDefault(); send(input); }}>
        <textarea ref={ta} value={input} onChange={(e) => setInput(e.target.value)} rows={2}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
          placeholder="e.g. 'Mate error: concentric mate not satisfied'"
          className="flex-1 resize-none rounded-lg border border-input bg-background/80 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
        {busy ? (
          <Button type="button" size="icon" variant="outline" onClick={() => stop()} aria-label="Stop"><Square /></Button>
        ) : (
          <Button type="submit" size="icon" disabled={!input.trim()} aria-label="Send"><Send /></Button>
        )}
      </form>
    </section>
  );
}
