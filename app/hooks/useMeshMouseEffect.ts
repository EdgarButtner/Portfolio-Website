import { useEffect, useRef, type RefObject } from 'react';
import { nodeRatio, type MeshBackgroundHandle } from '@/app/components/MeshBackground';

// Module-level: survives page navigation so the next mount starts with the real cursor position
let lastMouseX = -9999;
let lastMouseY = -9999;

interface UseMeshMouseEffectOptions {
  radius?: number;    // px — how far the effect reaches from the cursor
  strength?: number;  // px — max positional displacement at closest point
  sizeBoost?: number; // px added to node diameter at closest point
}

export function useMeshMouseEffect(
  meshRef: RefObject<MeshBackgroundHandle | null>,
  {
    radius = 150,
    strength = 40,
    sizeBoost = 6,
  }: UseMeshMouseEffectOptions = {}
) {
  const mouse   = useRef({ x: lastMouseX, y: lastMouseY });
  const rafId   = useRef<number | null>(null);
  // Uint8Array: 1 byte per node, zero allocation per frame
  const dirty   = useRef(new Uint8Array(0));
  // Pre-computed pixel positions per column / row, rebuilt on resize
  const nodeX   = useRef(new Float64Array(0));
  const nodeY   = useRef(new Float64Array(0));

  useEffect(() => {
    const radiusSq = radius * radius;

    const buildPositions = () => {
      const mesh = meshRef.current;
      if (!mesh) return;
      const { numNodesX, numNodesY } = mesh;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const xs = new Float64Array(numNodesX);
      const ys = new Float64Array(numNodesY);
      for (let col = 0; col < numNodesX; col++) xs[col] = nodeRatio(col, numNodesX) * vw;
      for (let row = 0; row < numNodesY; row++) ys[row] = nodeRatio(row, numNodesY) * vh;
      nodeX.current = xs;
      nodeY.current = ys;
      const total = numNodesX * numNodesY;
      if (dirty.current.length !== total) dirty.current = new Uint8Array(total);
    };

    const tick = () => {
      rafId.current = null;
      const mesh = meshRef.current;
      if (!mesh) return;

      const { numNodesX, numNodesY, nodeSize } = mesh;
      const { x: mx, y: my } = mouse.current;
      const xs = nodeX.current;
      const ys = nodeY.current;
      const d  = dirty.current;

      for (let row = 0; row < numNodesY; row++) {
        for (let col = 0; col < numNodesX; col++) {
          const dx     = xs[col] - mx;
          const dy     = ys[row] - my;
          const distSq = dx * dx + dy * dy;
          const index  = row * numNodesX + col;

          if (distSq < radiusSq && distSq > 0) {
            // Math.sqrt only for nodes that pass the cheaper squared check
            const dist = Math.sqrt(distSq);
            const t    = 1 - dist / radius; // 0 at edge → 1 at center
            mesh.updateNode(col, row, (dx / dist) * t * strength, (dy / dist) * t * strength);
            mesh.resizeNode(col, row, nodeSize + t * sizeBoost);
            d[index] = 1;
          } else if (d[index]) {
            d[index] = 0;
            mesh.resetNode(col, row);
          }
        }
      }
    };

    const schedule = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(tick);
    };

    const onMouseMove = (e: MouseEvent) => {
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      mouse.current = { x: lastMouseX, y: lastMouseY };
      schedule();
    };

    const onMouseLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
      schedule();
    };

    const onResize = () => {
      buildPositions();
      schedule();
    };

    buildPositions();
    schedule();
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
    document.addEventListener('mouseleave', onMouseLeave);

    // Captured so the cleanup closure sees the mesh that was active during this effect
    const meshAtMount = meshRef.current;

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      // Reset any nodes that were displaced when this hook unmounts
      const mesh = meshAtMount;
      if (mesh) {
        const { numNodesX } = mesh;
        const d = dirty.current;
        for (let i = 0; i < d.length; i++) {
          if (d[i]) {
            d[i] = 0;
            mesh.resetNode(i % numNodesX, Math.floor(i / numNodesX));
          }
        }
      }
    };
  }, [meshRef, radius, strength, sizeBoost]);
}
