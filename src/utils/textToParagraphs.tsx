// take a string and parse any "\n" into a seperate paragraph and return html
export function parseTextToHtml(text: string) {
  const paragraphs = text
    .split("\n")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  return paragraphs.map((p) => <p>{p}</p>);
}
