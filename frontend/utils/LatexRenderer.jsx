import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

const LatexRenderer = ({ content, className = "" }) => {
  if (!content) return null;

  // Function to extract and process LaTeX content from HTML
  const processContent = (text) => {
    if (!text) return text;

    // Replace specific LaTeX patterns
    let processedText = text
      // Fix common LaTeX issues
      .replace(/\\text{(.*?)}/g, "\\text{$1}")
      .replace(/\\rightarrow/g, "\\to")
      .replace(/\\vightarrow/g, "\\rightarrow") // Fix typo
      .replace(/\\\(/g, "$")
      .replace(/\\\)/g, "$")
      .replace(/\\\[/g, "$$")
      .replace(/\\\]/g, "$$");

    return processedText;
  };

  // Function to split content into text and LaTeX parts
  const renderMixedContent = (content) => {
    if (!content) return null;

    const processedContent = processContent(content);

    // Split by LaTeX delimiters
    const parts = processedContent.split(/(\$\$.*?\$\$|\$.*?\$)/s);

    return parts.map((part, index) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        // Display math
        const mathContent = part.slice(2, -2).trim();
        return (
          <div key={index} className="math-display">
            <Latex>{`$$${mathContent}$$`}</Latex>
          </div>
        );
      } else if (part.startsWith("$") && part.endsWith("$")) {
        // Inline math
        const mathContent = part.slice(1, -1).trim();
        return (
          <span key={index} className="math-inline">
            <Latex>{`$${mathContent}$`}</Latex>
          </span>
        );
      } else {
        // Regular text
        return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
      }
    });
  };

  return (
    <div className={`latex-content ${className}`}>
      {renderMixedContent(content)}
    </div>
  );
};

export default LatexRenderer;

