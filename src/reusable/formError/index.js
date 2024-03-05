export default function FormError({ error, errorId }) {
  return (
    <div className={`d-flex mx-3 align-items-start form-text-${error?.type}`}>
      <p id={errorId}>{error?.message}</p>
    </div>
  );
}
