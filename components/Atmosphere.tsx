/** Grano de film animado, viñeta y reflectores celestes que se mueven lento. */
export function Atmosphere() {
  return (
    <>
      <div className="spotlights" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
