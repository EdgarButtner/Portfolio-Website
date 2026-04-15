'use client';

import { createPortal } from 'react-dom';
import { forwardRef, useEffect, useImperativeHandle, useRef, useSyncExternalStore } from 'react';
import BackgroundNode from '@/app/components/BackgroundNode/BackgroundNode';

export interface MeshBackgroundHandle {
  numNodesX: number;
  numNodesY: number;
  nodeSize: number;
  nodeX: Float64Array; // document-space pixel X per column (live — read each tick)
  nodeY: Float64Array; // document-space pixel Y per row    (live — read each tick)
  resizeNode: (col: number, row: number, size: number) => void;
}

interface MeshBackgroundProps {
  numNodesX: number;
  numNodesY: number;
  nodeSize?: number;
  nodeColor?: string;
  strength?: number; // max positional displacement at closest point
  radius?: number;   // how far the displacement effect reaches
}

export function nodeRatio(index: number, count: number): number {
  return count > 1 ? index / (count - 1) : 0.5;
}

function useIsMounted() {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

const MeshBackground = forwardRef<MeshBackgroundHandle, MeshBackgroundProps>(
  ({ numNodesX, numNodesY, nodeSize = 4, nodeColor = '#0078d3', strength = 8, radius = 500 }, ref) => {
    const nodeRefs     = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const mounted      = useIsMounted();
    const nodeXRef     = useRef(new Float64Array(numNodesX));
    const nodeYRef     = useRef(new Float64Array(numNodesY));

    useImperativeHandle(
      ref,
      () => ({
        numNodesX,
        numNodesY,
        nodeSize,
        get nodeX() { return nodeXRef.current; },
        get nodeY() { return nodeYRef.current; },
        resizeNode: (col, row, size) => {
          const node = nodeRefs.current[row * numNodesX + col] ?? null;
          if (!node) return;
          const half = size / 2;
          node.style.width = `${size}px`;
          node.style.height = `${size}px`;
          node.style.marginLeft = `-${half}px`;
          node.style.marginTop = `-${half}px`;
        },
      }),
      [numNodesX, numNodesY, nodeSize]
    );

    useEffect(() => {
      const radiusSq = radius * radius;
      let rafId: number | null = null;
      const mouse = { x: -9999, y: -9999 };
      const dirty = new Uint8Array(numNodesX * numNodesY);

      // Precomputed baseline percentages — static for the lifetime of this effect
      const colPct = Float64Array.from({ length: numNodesX }, (_, i) => nodeRatio(i, numNodesX) * 100);
      const rowPct = Float64Array.from({ length: numNodesY }, (_, i) => nodeRatio(i, numNodesY) * 100);

      const buildPositions = () => {
        const vw = window.innerWidth;
        const dh = document.documentElement.scrollHeight;
        // Re-allocate if size is stale (e.g. Fast Refresh re-renders without remounting)
        if (nodeXRef.current.length !== numNodesX) nodeXRef.current = new Float64Array(numNodesX);
        if (nodeYRef.current.length !== numNodesY) nodeYRef.current = new Float64Array(numNodesY);
        const xs = nodeXRef.current;
        const ys = nodeYRef.current;
        for (let col = 0; col < numNodesX; col++) xs[col] = colPct[col] / 100 * vw;
        for (let row = 0; row < numNodesY; row++) ys[row] = rowPct[row] / 100 * dh;
        if (containerRef.current) containerRef.current.style.height = `${dh}px`;
      };
      buildPositions();

      const tick = () => {
        rafId = null;
        const { x: mx, y: my } = mouse;
        const xs = nodeXRef.current;
        const ys = nodeYRef.current;
        const scrollY = window.scrollY;
        const viewH   = window.innerHeight;

        for (let row = 0; row < numNodesY; row++) {
          const viewY = ys[row] - scrollY;

          // Reset and skip rows completely outside the visible area + radius buffer
          if (viewY < -radius || viewY > viewH + radius) {
            for (let col = 0; col < numNodesX; col++) {
              const index = row * numNodesX + col;
              if (dirty[index]) {
                dirty[index] = 0;
                const node = nodeRefs.current[index];
                if (node) node.style.transform = '';
              }
            }
            continue;
          }

          const dy = viewY - my;

          // Reset and skip rows outside the mouse radius
          if (dy * dy >= radiusSq) {
            for (let col = 0; col < numNodesX; col++) {
              const index = row * numNodesX + col;
              if (dirty[index]) {
                dirty[index] = 0;
                const node = nodeRefs.current[index];
                if (node) node.style.transform = '';
              }
            }
            continue;
          }

          for (let col = 0; col < numNodesX; col++) {
            const dx = xs[col] - mx;
            const distSq = dx * dx + dy * dy;
            const index = row * numNodesX + col;
            const node = nodeRefs.current[index];
            if (!node) continue;

            if (distSq < radiusSq && distSq > 0) {
              const dist = Math.sqrt(distSq);
              const t = 1 - dist / radius;
              node.style.transform = `translate(${(dx / dist) * t * strength}px,${(dy / dist) * t * strength}px)`;
              dirty[index] = 1;
            } else if (dirty[index]) {
              dirty[index] = 0;
              node.style.transform = '';
            }
          }
        }
      };

      const schedule = () => {
        if (rafId !== null) return;
        rafId = requestAnimationFrame(tick);
      };

      const onMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        schedule();
      };

      const onMouseLeave = () => {
        mouse.x = -9999;
        mouse.y = -9999;
        schedule();
      };

      const onResize = () => {
        buildPositions();
        schedule();
      };

      const ro = new ResizeObserver(() => { buildPositions(); schedule(); });
      ro.observe(document.body);

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', onResize);
      document.addEventListener('mouseleave', onMouseLeave);

      const nodesAtMount = nodeRefs.current;
      return () => {
        ro.disconnect();
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', onResize);
        document.removeEventListener('mouseleave', onMouseLeave);
        if (rafId !== null) cancelAnimationFrame(rafId);
        for (let i = 0; i < dirty.length; i++) {
          if (dirty[i]) {
            const node = nodesAtMount[i];
            if (node) node.style.transform = '';
          }
        }
      };
    }, [numNodesX, numNodesY, strength, radius]);

    if (!mounted) return null;

    return createPortal(
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: -1,
          pointerEvents: 'none',
          contain: 'layout style',
        }}
      >
        {Array.from({ length: numNodesX * numNodesY }, (_, index) => {
          const col = index % numNodesX;
          const row = Math.floor(index / numNodesX);
          return (
            <BackgroundNode
              key={index}
              ref={(el) => { nodeRefs.current[index] = el; }}
              locationX={nodeRatio(col, numNodesX) * 100}
              locationY={nodeRatio(row, numNodesY) * 100}
              size={nodeSize}
              color={nodeColor}
            />
          );
        })}
      </div>,
      document.body
    );
  }
);

MeshBackground.displayName = 'MeshBackground';
export default MeshBackground;
