'use client';
import { forwardRef, useImperativeHandle, useRef } from 'react';

/*
An interface for manipulating nodes.
*/
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

/*
Maps a column index to a percentage across the viewport.
*/ 
function baseLeft(col: number, numNodesX: number): number {
  return numNodesX > 1 ? (col / (numNodesX - 1)) * 100 : 50;
}

/*
Maps a row index to a percentage across the viewport.
*/ 
function baseTop(row: number, numNodesY: number): number {
  return numNodesY > 1 ? (row / (numNodesY - 1)) * 100 : 50;
}

const MeshBackground = forwardRef<MeshBackgroundHandle, MeshBackgroundProps>(
  ({ numNodesX, numNodesY, nodeSize = 4, nodeColor = 'rgba(255, 255, 255, 0.3)' }, ref) => {
    const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

    useImperativeHandle(
      ref,
      () => ({
        numNodesX,
        numNodesY,
        nodeSize,
        updateNode: (col, row, deltaX, deltaY) => {
          const node = nodeRefs.current[row * numNodesX + col];
          if (!node) return;
          node.style.left = `calc(${baseLeft(col, numNodesX)}% + ${deltaX}px)`;
          node.style.top = `calc(${baseTop(row, numNodesY)}% + ${deltaY}px)`;
        },
        resizeNode: (col, row, size) => {
          const node = nodeRefs.current[row * numNodesX + col];
          if (!node) return;
          const half = size / 2;
          node.style.width = `${size}px`;
          node.style.height = `${size}px`;
          node.style.marginLeft = `-${half}px`;
          node.style.marginTop = `-${half}px`;
        },
        resetNode: (col, row) => {
          const node = nodeRefs.current[row * numNodesX + col];
          if (!node) return;
          const half = nodeSize / 2;
          node.style.left = `${baseLeft(col, numNodesX)}%`;
          node.style.top = `${baseTop(row, numNodesY)}%`;
          node.style.width = `${nodeSize}px`;
          node.style.height = `${nodeSize}px`;
          node.style.marginLeft = `-${half}px`;
          node.style.marginTop = `-${half}px`;
        },
      }),
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
                left: `${baseLeft(col, numNodesX)}%`,
                top: `${baseTop(row, numNodesY)}%`,
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
