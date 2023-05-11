import { useEffect, useState } from 'react';

const usePortal = (selector: string): HTMLElement | null => {
  const [container, setContainer] = useState<HTMLElement>();

  useEffect(() => {
    const root = document.querySelector(selector);
    const el = document.querySelector('div');

    if (!el) {
      console.log(`Element for selector '${el}' no found.`);
      return;
    }

    root?.appendChild(el);
    setContainer(el);

    return () => {
      root?.removeChild(el);
    };
  }, [selector]);

  return container || null;
};

export default usePortal;
