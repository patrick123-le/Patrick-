import type { ReactNode } from "react";

const transitionToken = /^(?:(?:第[一二三四五六七八九十百0-9]+(?:步|点|层|阶段|部分)?)(?:是|[，、：:])|(?:其[一二三四五六七八九十]|首先|其次|再次|最后|一方面|另一方面)[，、：:]?|(?:一是|二是|三是|四是|五是))$/;

function inline(text: string, highlightPlaceholders = false, highlightTransitions = false): ReactNode[] {
  let normalized = text
    .replace(/\\([.\-+_()])/g, "$1")
    .replace(/\*{1,3}/g, "");
  if (highlightPlaceholders) normalized = normalized.replaceAll("\\[", "[").replaceAll("\\]", "]");
  const transition = "(?:(?:第[一二三四五六七八九十百0-9]+(?:步|点|层|阶段|部分)?)(?:是|[，、：:])|(?:其[一二三四五六七八九十]|首先|其次|再次|最后|一方面|另一方面)[，、：:]?|(?:一是|二是|三是|四是|五是))";
  const alternatives = ["https?:\\/\\/[^\\s）)】]+"];
  if (highlightPlaceholders) alternatives.push("\\[[^\\]]*\\]", "【[^】]*】");
  if (highlightTransitions) alternatives.push(transition);
  const pattern = new RegExp(`(${alternatives.join("|")})`, "g");
  const parts = normalized.split(pattern);
  return parts.map((part, index) => {
    if (highlightPlaceholders && (/^\[[^\]]*\]$/.test(part) || /^【[^】]*】$/.test(part))) {
      return <span className="letter-placeholder" key={index}>{part}</span>;
    }
    if (highlightTransitions && transitionToken.test(part)) {
      return <strong className="transition-word" key={index}>{part}</strong>;
    }
    return /^https?:\/\//.test(part) ? (
      <a key={index} href={part} target="_blank" rel="noreferrer">延伸链接 ↗</a>
    ) : part
  });
}

export function RichText({ content, highlightTransitions = false }: { content: string; highlightTransitions?: boolean }) {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && line !== ">" && !/^!\[/.test(line));

  const blocks: Array<{ type: "line"; content: string } | { type: "quote" | "letter"; content: string[] }> = [];
  let inLetter = false;
  for (const line of lines) {
    if (line === "[[LETTER_START]]") {
      blocks.push({ type: "letter", content: [] });
      inLetter = true;
      continue;
    }
    if (line === "[[LETTER_END]]") {
      inLetter = false;
      continue;
    }
    if (inLetter) {
      const last = blocks.at(-1);
      if (last?.type === "letter") last.content.push(line);
      continue;
    }
    if (line.startsWith(">")) {
      const quoteLine = line.replace(/^>\s*/, "");
      const last = blocks.at(-1);
      if (last?.type === "quote") last.content.push(quoteLine);
      else blocks.push({ type: "quote", content: [quoteLine] });
    } else {
      blocks.push({ type: "line", content: line });
    }
  }

  function renderLine(line: string, key: string, mode: "normal" | "quote" | "letter" = "normal") {
    if (/^【一句话总结】[：:]/.test(line)) {
      return <aside className="summary-highlight" key={key}><strong>{inline(line.replace(/^【一句话总结】[：:]\s*/, ""), false, highlightTransitions)}</strong></aside>;
    }
    if (mode === "letter" && line === "律师函（草稿）") return <h3 className="letter-title" key={key}>律师函（草稿）</h3>;
    if (/^#{2,4}\s/.test(line)) return <h3 key={key}>{inline(line.replace(/^#{2,4}\s*/, ""), false, highlightTransitions)}</h3>;
    if (/^[-•]\s+/.test(line)) return <p className="list-line" key={key}><span aria-hidden="true">•</span>{inline(line.replace(/^[-•]\s+/, ""), mode === "letter", highlightTransitions)}</p>;
    if (/^\d+[）).、]\s*/.test(line)) return <p className="list-line" key={key}><span>{line.match(/^\d+/)?.[0]}.</span>{inline(line.replace(/^\d+[）).、]\s*/, ""), mode === "letter", highlightTransitions)}</p>;
    if (line === "---") return null;
    return <p key={key} className={mode === "quote" ? "quote-line" : undefined}>{inline(line, mode === "letter", highlightTransitions)}</p>;
  }

  return (
    <div className="rich-text">
      {blocks.map((block, index) => block.type === "quote" ? (
        <blockquote key={`quote-${index}`}>
          {block.content.map((line, lineIndex) => renderLine(line, `${index}-${lineIndex}`, "quote"))}
        </blockquote>
      ) : block.type === "letter" ? (
        <section className="letter-draft" key={`letter-${index}`} aria-label="律师函草稿">
          {block.content.map((line, lineIndex) => renderLine(line, `${index}-${lineIndex}`, "letter"))}
        </section>
      ) : renderLine(block.content, `line-${index}`))}
    </div>
  );
}
