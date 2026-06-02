import type { SystemUser } from "@/lib/api/types";

export const getUserAvatarSeed = (
  user?: SystemUser | null,
  fallback = "user",
) => user?.name || user?.email || fallback;

export const getDicebearAvatarUrl = (seed: string) => 
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

export const getUserAvatarUrl = (
  user?: SystemUser | null,
  fallback = "user",
) => {
  const seed = getUserAvatarSeed(user, fallback);

  return (
    user?.profile?.imageUrl ||
    user?.imageUrl ||
    user?.avatarUrl ||
    getDicebearAvatarUrl(seed)
  );
};
