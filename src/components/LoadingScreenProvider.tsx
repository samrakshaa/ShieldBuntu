import React, { useEffect } from "react";
import { CSSTransition } from "react-transition-group";

type Props = {
  duration?: number;
  children: React.ReactNode;
};

function LoadingScreenProvider({ duration = 1000, children }: Props) {
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <>
      {isLoading ? (
        <>

          <div className="h-screen w-screen transition-all duration-75 ease-in-out font-normal flex justify-center items-center  flex-col text-4xl gap-4 ">
          <img src="shield.svg" alt="logo" className=" bg-blend-soft-light " width={"10%"}  />
          <div>

            Shield<span className="font-black text-primary">Buntu</span>
          </div>
          </div>
        </>
      ) : (
        children
      )}
    </>
  );
}

export default LoadingScreenProvider;
