export default function MeshBackground() {
  const rows = 30;
  const columns = 60;
  const gridItems = Array.from({ length: rows * columns }); 

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`, 
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: '0px', 
        width: '100vw', 
        height: '100vh', 
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -10,
      }}
    >
      {gridItems.map((_, index) => (
        <div
          key={index}
          style={{
            backgroundColor: 'black', 
            width: '100%',
            height: '100%',
            border: '0.25px solid red', 
          }}
        ></div>
      ))}
    </div>
  );
}