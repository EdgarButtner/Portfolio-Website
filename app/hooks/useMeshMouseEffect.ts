import { useEffect, useRef, type RefObject } from 'react';
import { type MeshBackgroundHandle } from '@/app/components/MeshBackground';

let lastMouseX = -9999;
let lastMouseY = -9999;

interface UseMeshMouseEffectOptions {
  radius?: number;
  sizeBoost?: number;
}

export function useMeshMouseEffect(
  meshRef: RefObject<MeshBackgroundHandle | null>,
  {
    radius = 150,
    sizeBoost = 6,
  }: UseMeshMouseEffectOptions = {}
) {
  const mouse = useRef({ x: lastMouseX, y: lastMouseY });
  const rafId = useRef<number | null>(null);
  const dirty = useRef(new Uint8Array(0));

  useEffect(() => {
    const radiusSq = radius * radius;

    const ensureDirty = () => {
      const mesh = meshRef.current;
      if (!mesh) return;
      const total = mesh.numNodesX * mesh.numNodesY;
      if (dirty.current.length !== total) dirty.current = new Uint8Array(total);
    };

    const tick = () => {
      rafId.current = null;
      const mesh = meshRef.current;
      if (!mesh) return;

      const { numNodesX, numNodesY, nodeSize, nodeX: xs, nodeY: ys } = mesh;
      const { x: mx, y: my } = mouse.current;
      const scrollY = window.scrollY;
      const d = dirty.current;

      for (let row = 0; row < numNodesY; row++) {
        const dy = ys[row] - scrollY - my;

        if (dy * dy >= radiusSq) {
          for (let col = 0; col < numNodesX; col++) {
            const index = row * numNodesX + col;
            if (d[index]) {
              d[index] = 0;
              mesh.resizeNode(col, row, nodeSize, 0);
            }
          }
          continue;
        }

        for (let col = 0; col < numNodesX; col++) {
          const dx     = xs[col] - mx;
          const distSq = dx * dx + dy * dy;
          const index  = row * numNodesX + col;

          if (distSq < radiusSq && distSq > 0) {
            const t = 1 - Math.sqrt(distSq) / radius;
            mesh.resizeNode(col, row, nodeSize + t * sizeBoost, 1);
            d[index] = 1;
          } else if (d[index]) {
            d[index] = 0;
            mesh.resizeNode(col, row, nodeSize, 0);
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
      mouse.current.x = lastMouseX;
      mouse.current.y = lastMouseY;
      schedule();
    };

    const onMouseLeave = () => {
      mouse.current.x = -9999;
      mouse.current.y = -9999;
      schedule();
    };

    ensureDirty();
    schedule();
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', schedule, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    const meshAtMount = meshRef.current;

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', schedule);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      if (meshAtMount) {
        const { numNodesX, nodeSize } = meshAtMount;
        const d = dirty.current;
        for (let i = 0; i < d.length; i++) {
          if (d[i]) {
            d[i] = 0;
            meshAtMount.resizeNode(i % numNodesX, Math.floor(i / numNodesX), nodeSize, 0);
          }
        }
      }
    };
  }, [meshRef, radius, sizeBoost]);
}
