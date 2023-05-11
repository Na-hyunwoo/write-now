import usePortal from '@/hooks/usePortal';
import { ReactNode } from 'react';
import ReactDOM from 'react-dom';


interface PortalProps {
  children: ReactNode;
  selector: string;
  position: { top: number; left: number };
}

export default function Portal({ children, selector, position }: PortalProps) {
  const container = usePortal(selector);

  return container
    ? ReactDOM.createPortal(
        <div style={{position: "absolute", ...position}} >
          {children}
        </div>,
        container,
      )
    : null;
}
