const OptionStyleButtons = ({ options, currentStyle, onChange }) => (
  <div className="flex gap-2">
    {options?.map((option, index) => (
      <button
        key={index}
        className={`w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg text-xl font-bold transition-all ${
          currentStyle === option
            ? "bg-green-700 text-white border-green-700"
            : "bg-white hover:bg-gray-200"
        }`}
        onClick={() => onChange(option)}
      >
        {option}
      </button>
    ))}
  </div>
);

export default OptionStyleButtons;
