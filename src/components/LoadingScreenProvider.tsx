import React, { useEffect } from "react";
import { CSSTransition } from "react-transition-group";

type Props = {
  duration?: number;
  children: React.ReactNode;
};

function LoadingScreenProvider({ duration = 500, children }: Props) {
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <>
      <CSSTransition
        in={isLoading}
        timeout={200}
        classNames="fade"
        unmountOnExit
      >
        <div className="h-screen w-screen transition-all duration-75 ease-in-out flex justify-center items-center font-black ">
          SheildBuntu
        </div>
      </CSSTransition>

      {!isLoading && children}
    </>
  );
}

export default LoadingScreenProvider;
