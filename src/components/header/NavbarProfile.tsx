import Link from "next/link";
import { getCurrentUser } from "@/lib/dal";
import LogoutButton from "@/app/(auth)/LogoutButton";
import ProfileMenu from "./ProfileMenu";

const itemClass = "block rounded px-3 py-2 text-sm hover:bg-gray-100";

export default async function NavbarProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <ProfileMenu name={user.name}>
      <div className="mb-1 border-b px-3 pb-2">
        <p className="truncate text-sm font-medium">{user.name}</p>
        <p className="text-xs capitalize text-gray-500">{user.role}</p>
      </div>

      {/* Add future links here, one line each */}
      <Link href="/profile" className={itemClass}>
        Profile
      </Link>
      <Link href="/settings" className={itemClass}>
        Settings
      </Link>

      <div className="mt-1 border-t pt-1">
        <LogoutButton className="w-full rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100" />
      </div>
    </ProfileMenu>
  );
}
