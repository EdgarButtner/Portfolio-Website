'use client';
import { forwardRef, useImperativeHandle, useRef } from 'react';

export interface MeshBackgroundHandle {
  numNodesX: number;
  numNodesY: number;
  nodeSize: number;
  updateNode: (col: number, row: number, deltaX: number, deltaY: number) => void;
  resizeNode: (col: number, row: number, size: number) => void;
  resetNode: (col: number, row: number) => void;
}

interface MeshBackgroundProps {
  numNodesX: number;
  numNodesY: number;
  nodeSize?: number;
  nodeColor?: string;
}

// Normalises a grid index to a 0–1 ratio. Exported so the mouse hook can
// compute pixel positions using the same formula without duplicating it.
export function nodeRatio(index: number, count: number): number {
  return count > 1 ? index / (count - 1) : 0.5;
}

const MeshBackground = forwardRef<MeshBackgroundHandle, MeshBackgroundProps>(
  ({ numNodesX, numNodesY, nodeSize = 4, nodeColor = 'rgba(255, 255, 255, 0.3)' }, ref) => {
    const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

    useImperativeHandle(
      ref,
      () => {
        const getNode = (col: number, row: number) =>
          nodeRefs.current[row * numNodesX + col] ?? null;

        return {
          numNodesX,
          numNodesY,
          nodeSize,
          updateNode: (col, row, deltaX, deltaY) => {
            const node = getNode(col, row);
            if (!node) return;
            node.style.left = `calc(${nodeRatio(col, numNodesX) * 100}% + ${deltaX}px)`;
            node.style.top = `calc(${nodeRatio(row, numNodesY) * 100}% + ${deltaY}px)`;
          },
          resizeNode: (col, row, size) => {
            const node = getNode(col, row);
            if (!node) return;
            const half = size / 2;
            node.style.width = `${size}px`;
            node.style.height = `${size}px`;
            node.style.marginLeft = `-${half}px`;
            node.style.marginTop = `-${half}px`;
          },
          resetNode: (col, row) => {
            const node = getNode(col, row);
            if (!node) return;
            const half = nodeSize / 2;
            node.style.left = `${nodeRatio(col, numNodesX) * 100}%`;
            node.style.top = `${nodeRatio(row, numNodesY) * 100}%`;
            node.style.width = `${nodeSize}px`;
            node.style.height = `${nodeSize}px`;
            node.style.marginLeft = `-${half}px`;
            node.style.marginTop = `-${half}px`;
          },
        };
      },
      [numNodesX, numNodesY, nodeSize]
    );

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -10,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {Array.from({ length: numNodesX * numNodesY }, (_, index) => {
          const col = index % numNodesX;
          const row = Math.floor(index / numNodesX);
          const half = nodeSize / 2;
          return (
            <div
              key={index}
              ref={(el) => { nodeRefs.current[index] = el; }}
              style={{
                position: 'absolute',
                left: `${nodeRatio(col, numNodesX) * 100}%`,
                top: `${nodeRatio(row, numNodesY) * 100}%`,
                width: `${nodeSize}px`,
                height: `${nodeSize}px`,
                marginLeft: `-${half}px`,
                marginTop: `-${half}px`,
                borderRadius: '50%',
                backgroundColor: nodeColor,
              }}
            />
          );
        })}
      </div>
    );
  }
);

MeshBackground.displayName = 'MeshBackground';

export default MeshBackground;
