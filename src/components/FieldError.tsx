export default function FieldError({ message }: { message?: string }) {
  return (
    <p
      role="alert"
      className={`mt-1 min-h-4 text-xs text-red-600 transition-opacity duration-300 ${
        message ? "opacity-100" : "opacity-0"
      }`}
    >
      {message}
    </p>
  );
}