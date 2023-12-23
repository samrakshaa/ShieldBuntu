import React, { useState } from "react";
import { BiRefresh } from "react-icons/bi";
import { Button } from "./ui/button";

type Props = {
  onClick: () => void;
  loading: boolean;
};

function RefreshButton({ onClick, loading }: Props) {
  return (
    <Button
      className="font-normal text-base max-w-xl bg-secondary bord   er-2 border-white/90 rounded-xl 
              hover:bg-secondary/50 my-2 mx-3"
      onClick={onClick}
    >
      <div className={loading ? "animate-spin" : ""}>
        <BiRefresh size={20} />
      </div>
    </Button>
  );
}

export default RefreshButton;
