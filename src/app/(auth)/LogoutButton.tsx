import { logout } from "./actions";

export default function LogoutButton({
  className = "text-sm underline",
}: {
  className?: string;
}) {
  return (
    <form action={logout}>
      <button type="submit" className={className}>
        Log out
      </button>
    </form>
  );
}