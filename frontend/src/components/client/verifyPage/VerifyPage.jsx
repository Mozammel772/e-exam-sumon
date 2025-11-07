import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router";

export default function VerifyPage() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    // trigger animation after mount
    setTimeout(() => {
      setShow(true);
    }, 100);
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ps-3 pe-3">
      <div
        className={`bg-white rounded-2xl shadow-xl px-10 py-12 text-center max-w-2xl w-full transform transition-all duration-700 ease-out
          ${show ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}
        `}
      >
        <div className="flex justify-center mb-6">
          <div className="bg-green-400 rounded-full p-4">
            <CheckCircle className="text-white w-12 h-12" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Congratulations!
        </h2>
        <p className="text-gray-600 mb-6 solaimanlipi text-4xl">
          🎉 অভিনন্দন! আপনার একাউন্ট তৈরি হয়েছে, এখন ইমেইল ভেরিফাই করুন।
        </p>

        <Link
          to="/login"
          className="inline-block bg-[#024645] hover:bg-[#5d7a7a] text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
