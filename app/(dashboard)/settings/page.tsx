import { getAuthUserId } from "@/actions/auth";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { SettingsClient } from "./settings-client";

export const metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const userId = await getAuthUserId();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, createdAt: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>
      <SettingsClient
        user={{
          name: dbUser?.name || user?.user_metadata?.name || "",
          email: dbUser?.email || user?.email || "",
          createdAt: dbUser?.createdAt?.toISOString() || "",
          avatarUrl: user?.user_metadata?.avatar_url || "",
          currency: user?.user_metadata?.currency || "IDR",
        }}
      />
    </div>
  );
}
