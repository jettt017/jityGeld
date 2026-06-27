"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  Monitor,
  User,
  Calendar,
  Mail,
  LogOut,
  ShieldAlert,
  Camera,
  Loader2,
  Check,
  Coins,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { signOut } from "@/actions/auth";
import { formatDate } from "@/utils";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/actions/profile";
import imageCompression from "browser-image-compression";
import { useRouter } from "next/navigation";

interface SettingsClientProps {
  user: {
    name: string;
    email: string;
    createdAt: string;
    avatarUrl?: string;
    currency?: string;
  };
}

const currencies = [
  { code: "IDR", name: "Rupiah (Rp)", symbol: "Rp" },
  { code: "USD", name: "US Dollar ($)", symbol: "$" },
  { code: "EUR", name: "Euro (€)", symbol: "€" },
  { code: "SGD", name: "Singapore Dollar (S$)", symbol: "S$" },
  { code: "GBP", name: "Pound Sterling (£)", symbol: "£" },
];

export function SettingsClient({ user }: SettingsClientProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Profile Form States
  const [name, setName] = useState(user.name);
  const [currency, setCurrency] = useState(user.currency || "IDR");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  // Image upload and compression
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      const options = {
        maxSizeMB: 0.048,
        maxWidthOrHeight: 128,
        useWebWorker: true,
        fileType: "image/webp",
      };

      console.log("Compressing image...");
      const compressedFile = await imageCompression(file, options);
      console.log("Compressed file size:", (compressedFile.size / 1024).toFixed(2), "KB");

      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error("Authentication user session not found");

      const filePath = `${authUser.id}/avatar-${Date.now()}.webp`;

      console.log("Uploading to Supabase storage...");
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, compressedFile, {
          upsert: true,
          contentType: "image/webp",
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      console.log("Public URL:", publicUrl);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setMessage({ type: "success", text: "Profile picture updated successfully!" });
      router.refresh();
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "Failed to upload avatar";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setUploading(false);
    }
  }

  // Save Name and Currency Changes
  async function handleSaveChanges() {
    setSaving(true);
    setMessage(null);

    try {
      const result = await updateProfile(name);
      if (!result.success) throw new Error(result.error);

      const supabase = createClient();
      const { error: authError } = await supabase.auth.updateUser({
        data: { name, currency },
      });

      if (authError) throw authError;

      setMessage({ type: "success", text: "Settings saved successfully!" });
      router.refresh();
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "Failed to save settings";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Profile & Preferences Settings Card */}
      <Card className="rounded-2xl border-none shadow-sm bg-card p-6 flex flex-col justify-between">
        <div>
          <CardHeader className="px-0 pt-0 pb-6">
            <CardTitle className="text-base font-extrabold text-foreground">Profile Settings</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Manage your identity and app preferences</CardDescription>
          </CardHeader>
          
          <CardContent className="p-0 space-y-5">
            {/* Avatar Edit Area */}
            <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-2xl border border-border/40">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <Avatar className="h-16 w-16 border-2 border-primary/20 transition-all group-hover:opacity-85">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-extrabold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  {uploading ? (
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  ) : (
                    <Camera className="h-5 w-5 text-white" />
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-foreground">Profile Photo</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5 mb-2 leading-relaxed">
                  Compressed automatically (WebP format, max 50KB)
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="h-7 text-[10px] font-bold rounded-lg uppercase px-3 tracking-wider bg-transparent border-primary/30 hover:bg-primary/5 text-foreground"
                >
                  {uploading ? "Uploading..." : "Upload Photo"}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> Full Name
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              {/* Email Address (Read-only) */}
              <div className="space-y-1.5 opacity-80">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Email Address
                </label>
                <Input
                  type="email"
                  value={user.email}
                  disabled
                />
              </div>

              {/* Preferred Currency */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Coins className="h-3.5 w-3.5" /> Currency Preference
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="flex h-12 w-full rounded-xl border border-border/40 bg-slate-50 dark:bg-zinc-900/50 px-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notification messages */}
            {message && (
              <div
                className={`text-[11px] font-semibold px-3 py-2 rounded-xl border flex items-center gap-2 ${
                  message.type === "success"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                }`}
              >
                {message.type === "success" && <Check className="h-3.5 w-3.5" />}
                {message.text}
              </div>
            )}
          </CardContent>
        </div>

        <div className="pt-5 border-t border-border/40 mt-5">
          <Button
            onClick={handleSaveChanges}
            disabled={saving || uploading}
            className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5"
          >
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </Card>

      {/* Appearance Settings Card */}
      <div className="space-y-6">
        <Card className="rounded-2xl border-none shadow-sm bg-card p-6">
          <CardHeader className="px-0 pt-0 pb-6">
            <CardTitle className="text-base font-extrabold text-foreground">Appearance</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Customize the look and feel of the app</CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-bold text-foreground">Theme Mode</p>
              <div className="grid grid-cols-3 gap-3">
                {themes.map(({ value, label, icon: Icon }) => {
                  const isActive = mounted && theme === value;
                  return (
                    <button
                      key={value}
                      onClick={() => setTheme(value)}
                      className={`flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-muted/30 hover:bg-muted/50 border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-bold">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone / Session Settings */}
        <Card className="rounded-2xl border-none shadow-sm bg-card p-6">
          <CardHeader className="px-0 pt-0 pb-6">
            <CardTitle className="text-base font-extrabold text-destructive flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              Account Actions
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Manage your session settings</CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            {user.createdAt && (
              <div className="flex items-center gap-3 text-xs bg-muted/20 p-3 rounded-xl border border-border/40">
                <Calendar className="h-4 w-4 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Joined Date</p>
                  <p className="font-semibold text-foreground truncate">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            )}
            
            <Button
              variant="destructive"
              onClick={() => signOut()}
              className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
