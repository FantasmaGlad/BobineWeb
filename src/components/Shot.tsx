export default function Shot({ caption }: { caption: string }) {
  return (
    <div className="shot-placeholder">
      <span className="shot-placeholder__tag">Capture à venir</span>
      <span>{caption}</span>
    </div>
  );
}
