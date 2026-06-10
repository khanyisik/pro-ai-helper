import ReactMarkdown from "react-markdown";

export function Markdown({ children }: { children: string }) {
  return (
    <div className="markdown-body text-sm text-foreground">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
