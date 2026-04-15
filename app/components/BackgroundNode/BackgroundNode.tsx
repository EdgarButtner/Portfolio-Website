import { forwardRef } from 'react';

interface BackgroundNodeProps {
  locationX: number; // percentage 0–100
  locationY: number; // percentage 0–100
  size: number;      // px
  color: string;
}

const BackgroundNode = forwardRef<HTMLDivElement, BackgroundNodeProps>(
  ({ locationX, locationY, size, color }, ref) => {
    const half = size / 2;
    return (
      <div
        ref={ref}
        style={{
          position: 'absolute',
          left: `${locationX}%`,
          top: `${locationY}%`,
          width: `${size}px`,
          height: `${size}px`,
          marginLeft: `-${half}px`,
          marginTop: `-${half}px`,
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
    );
  }
);

BackgroundNode.displayName = 'BackgroundNode';
export default BackgroundNode;
