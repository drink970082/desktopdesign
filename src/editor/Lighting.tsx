/**
 * Scene lighting: a soft fill from a hemisphere light plus a shadow-casting key
 * (directional) light. The shadow camera frustum is tuned to roughly the desk
 * footprint (~4 m) so shadows stay crisp without an oversized map.
 */
export default function Lighting() {
  return (
    <>
      <hemisphereLight args={['#ffffff', '#444444', 0.6]} position={[0, 5, 0]} />
      <ambientLight intensity={0.12} />
      <directionalLight
        castShadow
        position={[3, 5, 2]}
        intensity={2.4}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
      >
        <orthographicCamera attach="shadow-camera" args={[-4, 4, 4, -4, 0.1, 20]} />
      </directionalLight>
    </>
  )
}
