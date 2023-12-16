import { useState, useEffect } from "react";
import loader from "@/assets/loader.png";

const Loader = () => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(false);
    }, 5000); // Set a timeout for demonstration purposes (5 seconds)

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="px-2 bg-transparent flex flex-row gap-2">
      <img
        src={loader}
        height={20}
        width={20}
        className="animate-spin"
        alt="loading..."
      />
      {!showLoader && (
        <span className="text-[yellow] text-sm">This may take some time.</span>
      )}
    </div>
  );
};

export default Loader;
