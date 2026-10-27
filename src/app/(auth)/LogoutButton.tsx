import { logout } from "./actions";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button type="submit" className="text-sm underline cursor-pointer">
        Log out
      </button>
    </form>
  );
}