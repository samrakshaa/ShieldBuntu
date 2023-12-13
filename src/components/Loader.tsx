import { useState, useEffect } from "react";
import loader from "@/assets/loader.png";

const Loader = () => {
  return (
    <div className="px-2 bg-transparent ">
      <img
        src={loader}
        height={20}
        width={20}
        className="animate-spin"
        alt="loading..."
      />
    </div>
  );
};

export default Loader;
