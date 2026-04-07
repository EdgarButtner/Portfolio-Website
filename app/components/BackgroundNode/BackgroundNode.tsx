/*
Inferface for a background node including location, size, and color
*/
interface BackgroundNodeProps {
    locationX: number;
    locationY: number;
    size: number;
    color: string;
}

/*
Renders a single circular background node.
*/
export default function BackgroundNode({locationX, locationY, size, color}: BackgroundNodeProps) {
    return (
      <div style={{
        position: 'absolute',
        left: locationX,
        top: locationY,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
      }}>
      </div>
    );
}