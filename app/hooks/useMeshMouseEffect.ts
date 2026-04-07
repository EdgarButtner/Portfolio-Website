import { useEffect, useRef, type RefObject } from 'react';
import type { MeshBackgroundHandle } from '@/app/components/MeshBackground';

interface UseMeshMouseEffectOptions {
  radius?: number;    // px — how far the effect reaches from the cursor
  strength?: number;  // px — max positional displacement at closest point
  sizeBoost?: number; // px added to node diameter at closest point
}

/*
  Pushes nearby nodes away from the cursor and grows them slightly.
  Grid dimensions and base node size are read directly from the handle,
  so they can never fall out of sync with the component.
*/
export function useMeshMouseEffect(
  meshRef: RefObject<MeshBackgroundHandle | null>,
  {
    radius = 150,
    strength = 40,
    sizeBoost = 6,
  }: UseMeshMouseEffectOptions = {}
) {
  const mouse = useRef({ x: -9999, y: -9999 });
  const rafId = useRef<number | null>(null);
  const dirty = useRef(new Set<number>());

  useEffect(() => {
    const tick = () => {
      rafId.current = null;
      const mesh = meshRef.current;
      if (!mesh) return;

      const { numNodesX, numNodesY, nodeSize } = mesh;
      const { x: mx, y: my } = mouse.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const nextDirty = new Set<number>();

      for (let row = 0; row < numNodesY; row++) {
        for (let col = 0; col < numNodesX; col++) {
const nx = numNodesX > 1 ? (col / (numNodesX - 1)) * vw : vw / 2;
          const ny = numNodesY > 1 ? (row / (numNodesY - 1)) * vh : vh / 2;
          const dx = nx - mx;
          const dy = ny - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const index = row * numNodesX + col;

          if (dist < radius && dist > 0) {
            const t = 1 - dist / radius; // 0 at edge → 1 at center
            mesh.updateNode(col, row, (dx / dist) * t * strength, (dy / dist) * t * strength);
            mesh.resizeNode(col, row, nodeSize + t * sizeBoost);
            nextDirty.add(index);
          } else if (dirty.current.has(index)) {
            mesh.resetNode(col, row);
          }
        }
      }

      dirty.current = nextDirty;
    };

    const schedule = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(tick);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      schedule();
    };

    const onMouseLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
      schedule();
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [meshRef, radius, strength, sizeBoost]);
}
