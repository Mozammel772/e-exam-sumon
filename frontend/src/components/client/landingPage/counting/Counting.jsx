import CountUp from "../../../../components/countUp/CountUp";

export default function Counting() {
  return (
    <div>
      <p
        style={{ paddingTop: "30px" }}
        className="text-center font-bold text-4xl solaimanlipi"
      >
        <span className="italic inter">E-Exam App</span> - এ{" "}
      </p>

      <div
        className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-5"
        style={{ marginTop: "30px", marginBottom: "30px" }}
      >
        <div
          style={{ padding: "15px", backgroundColor: "#024645" }}
          className="block max-w-full p-6 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
        >
          <p
            style={{ marginTop: "5px" }}
            className="solaimanlipi text-5xl font-bold text-center text-white"
          >
            <CountUp
              from={0}
              to={6000}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text"
            />
            +
          </p>
          <p
            style={{ marginTop: "5px" }}
            className="solaimanlipi text-xl font-bold text-center text-white"
          >
            শিক্ষা প্রতিষ্ঠান যুক্ত
          </p>
        </div>
        <div
          style={{ padding: "15px", backgroundColor: "#024645" }}
          className="block max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
        >
          <p
            style={{ marginTop: "5px" }}
            className="solaimanlipi text-5xl font-bold text-center text-white"
          >
            <CountUp
              from={0}
              to={150}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text"
            />
            K
          </p>
          <p
            style={{ marginTop: "5px" }}
            className="solaimanlipi text-xl font-bold text-center text-white"
          >
            মোট প্রশ্ন তৈরী করা হয়েছে
          </p>
        </div>
        <div
          style={{ padding: "15px", backgroundColor: "#024645" }}
          className="block max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
        >
          <p
            style={{ marginTop: "5px" }}
            className="solaimanlipi text-5xl font-bold text-center text-white"
          >
            <CountUp
              from={0}
              to={700}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text"
            />
            +
          </p>
          <p
            style={{ marginTop: "5px" }}
            className="solaimanlipi text-xl font-bold text-center text-white"
          >
            প্রশ্ন তৈরী করছে প্রতিদিন
          </p>
        </div>
      </div>
    </div>
  );
}
