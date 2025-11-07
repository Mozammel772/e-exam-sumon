import sanitizeHtml from "sanitize-html";
import LatexRenderer from "../../../../../../utils/LatexRenderer";

export default function QuestionItem({
  question,
  index,
  editingMode,
  optionsStyle,
  isAnserShow,
  isDetailsShow,
}) {
  const renderOptionLabel = (label) => {
    switch (optionsStyle) {
      case "○":
        return (
          <span className="text-lg border border-gray-500 rounded-full w-4 h-4 flex items-center justify-center">
            {label}
          </span>
        );
      case ".":
        return `${label}.`;
      case "( )":
        return `(${label})`;
      case ")":
        return `${label})`;
      default:
        return label;
    }
  };

  const toBanglaNumber = (number) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return number?.toString().replace(/\d/g, (digit) => banglaDigits[digit]);
  };

  const renderContent = (content) => (
    <LatexRenderer
      content={sanitizeHtml(content || "", {
        allowedTags: ["p", "img", "span", "b", "i", "u", "strong", "em"],
        allowedAttributes: {
          img: ["src", "alt", "width", "height", "loading"],
          "*": ["style"],
        },
      })}
    />
  );
  return (
    <div
      contentEditable={editingMode}
      className="relative z-10 w-full h-full ps-2 mb-6"
    >
      {/* Question Text */}
      <p className="text-xl font-light flex items-baseline gap-0">
        <span className="shrink-0">{toBanglaNumber(index + 1)}.</span>
        {renderContent(question.questionName)}
      </p>

      {/* Options */}
      <div className="flex flex-wrap gap-0">
        {[
          { label: "ক", text: question.option1 },
          { label: "খ", text: question.option2 },
          { label: "গ", text: question.option3 },
          { label: "ঘ", text: question.option4 },
        ].map((option, idx) => (
          <div key={idx} className="w-1/2 mb-2">
            <p className="flex items-center gap-0">
              <span className="text-lg pe-1 shrink-0">
                {renderOptionLabel(option.label)}
              </span>
              {renderContent(option.text)}
            </p>
          </div>
        ))}
      </div>

      {/* Answer and Explanation */}
      {(isAnserShow || isDetailsShow) && (
        <div className="space-y-1 mt-1">
          {isAnserShow && (
            <div className="flex items-baseline gap-0">
              <span className="solaimanlipi text-xl font-semibold shrink-0 me-1.5">
                উত্তরঃ
              </span>
              {renderContent(question.correctAnswer)}
            </div>
          )}

          {isDetailsShow && (
            <div className="flex items-baseline gap-0">
              <span className="solaimanlipi text-xl font-semibold shrink-0">
                ব্যাখ্যা:
              </span>
              <div className="ms-2">{renderContent(question.explanation)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
