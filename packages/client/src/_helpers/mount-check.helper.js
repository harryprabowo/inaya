import { useRef, useState, useEffect } from "react";

const useIsMountedRef = () => {
  const ref = useRef(null);
  ref.current = true;

  useEffect(() => {
    return () => {
      ref.current = false;
    };
  });

  return ref;
};

const useStateWithMountCheck = (...args) => {
  const isMountedRef = useIsMountedRef();
  const [state, originalSetState] = useState(...args);

  const setState = (...args) => {
    if (isMountedRef.current) {
      originalSetState(...args);
    }
  };

  return [state, setState];
};

export default useStateWithMountCheck;
