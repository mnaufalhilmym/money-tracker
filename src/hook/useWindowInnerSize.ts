import { useEffect, useState } from "react";

export default function useWindowInnerSize() {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  return { width: size.width, height: size.height };
}
