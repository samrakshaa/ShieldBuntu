import React, { useEffect } from "react";

function StorageProvider(props: { children: React.ReactNode }) {
    
  const { children } = props;
  useEffect(() => {
    console.log("hello world");
  }, []);

  return <>{ children }</>;
}

export default StorageProvider;
