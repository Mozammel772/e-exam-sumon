import Lottie from "lottie-react";
import LoaderIcon from "../../lottifiles/e-qus-loader-icon.json";

export default function ClientLoader() {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Lottie
        style={{ width: 200, height: 200 }}
        animationData={LoaderIcon}
        loop={true}
      />
    </div>
  );
}
