"use client";

import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Roboto_Mono } from "next/font/google";
import { supabase } from "@/lib/supabase/client";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
});

export default function AccountPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  const [nickname, setNickname] = useState("");
  const [savingNickname, setSavingNickname] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [profileMessage, setProfileMessage] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/login");
        return;
      }

      setEmail(user.email || "");
      setUserId(user.id);

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("nickname, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error(
          "Profile load error:",
          profileError
        );
      }

      if (profile?.nickname) {
        setNickname(profile.nickname);
      }

      if (profile?.avatar_url) {
        setAvatarUrl(profile.avatar_url);
      }

      setLoading(false);
    }

    loadUser();
  }, [router]);

  async function saveNickname() {
    if (!userId) {
      return;
    }

    setSavingNickname(true);
    setProfileMessage("");

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        nickname: nickname.trim(),
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error(
        "Nickname save error:",
        error
      );

      setProfileMessage(
        "Failed to save nickname."
      );
    } else {
      setProfileMessage(
        "Nickname saved."
      );
    }

    setSavingNickname(false);
  }

  async function uploadAvatar(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file || !userId) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setProfileMessage(
        "Only JPG, PNG and WebP images are allowed."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileMessage(
        "Image must be smaller than 5 MB."
      );

      event.target.value = "";
      return;
    }

    setUploadingAvatar(true);
    setProfileMessage("");

    try {
      const extension =
        file.name.split(".").pop() || "jpg";

      const filePath =
        `${userId}/${Date.now()}.${extension}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const newAvatarUrl =
        data.publicUrl;

      const {
        error: profileError,
      } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          nickname: nickname.trim() || null,
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        throw profileError;
      }

      setAvatarUrl(newAvatarUrl);

      setProfileMessage(
        "Profile photo updated."
      );
    } catch (error) {
      console.error(
        "Avatar upload error:",
        error
      );

      setProfileMessage(
        "Failed to upload profile photo."
      );
    } finally {
      setUploadingAvatar(false);
      event.target.value = "";
    }
  }

  async function logout() {
    await supabase.auth.signOut({
      scope: "local",
    });

    router.replace("/login");
    router.refresh();
  }

  async function switchAccount() {
    await supabase.auth.signOut({
      scope: "local",
    });

    router.replace("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <main
        className={`${robotoMono.className} flex min-h-screen items-center justify-center bg-black text-[#55DDE8]`}
      >
        LOADING_ACCOUNT...
      </main>
    );
  }

  return (
    <main
      className={`${robotoMono.className} relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-10 text-[#55DDE8]`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(#55DDE8 1px, transparent 1px), linear-gradient(90deg, #55DDE8 1px, transparent 1px)",
          backgroundSize: "45px 45px",
        }}
      />

      <div className="pointer-events-none absolute h-[500px] w-[500px] rounded-full bg-[#55DDE8]/5 blur-[120px]" />

      <div className="relative z-10 w-full max-w-[600px]">
        <button
          onClick={() =>
            router.push("/")
          }
          className="mb-8 flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#55DDE8] text-2xl text-black">
            ⚙
          </div>

          <span className="text-3xl font-bold">
            DesAIgn
          </span>
        </button>

        <div className="rounded-[28px] border border-[#55DDE8]/70 bg-black/80 p-8">
          <div className="mb-8 flex items-center justify-between border-b border-[#55DDE8]/20 pb-5">
            <div>
              <p className="text-xs tracking-[0.25em] text-[#55DDE8]/45">
                USER PROFILE
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                MY ACCOUNT_
              </h1>
            </div>

            <div className="h-3 w-3 animate-pulse rounded-full bg-[#55DDE8]" />
          </div>

          {/* Avatar */}
          <div className="mb-8 flex flex-col items-center">
            <div
              className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-[#55DDE8]/60 bg-[#1b1b1b] bg-cover bg-center text-4xl"
              style={
                avatarUrl
                  ? {
                      backgroundImage: `url("${avatarUrl}")`,
                    }
                  : undefined
              }
            >
              {!avatarUrl && "👤"}
            </div>

            <label className="mt-4 cursor-pointer text-xs tracking-[0.15em] text-[#55DDE8]/70 transition hover:text-[#55DDE8]">
              {uploadingAvatar
                ? "UPLOADING..."
                : "CHANGE PHOTO"}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={uploadAvatar}
                disabled={uploadingAvatar}
                className="hidden"
              />
            </label>
          </div>

          {/* Nickname */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-bold tracking-[0.18em] text-[#55DDE8]/60">
              NICKNAME
            </label>

            <div className="flex gap-3">
              <input
                value={nickname}
                onChange={(event) =>
                  setNickname(
                    event.target.value
                  )
                }
                placeholder="Enter nickname..."
                maxLength={30}
                className="flex-1 rounded-2xl border border-transparent bg-[#282828] px-5 py-4 text-sm text-white outline-none transition focus:border-[#55DDE8]"
              />

              <button
                onClick={saveNickname}
                disabled={savingNickname}
                className="rounded-2xl border border-[#55DDE8] px-5 text-xs font-bold text-[#55DDE8] transition hover:bg-[#55DDE8]/10 disabled:opacity-40"
              >
                {savingNickname
                  ? "SAVING..."
                  : "SAVE"}
              </button>
            </div>

            {profileMessage && (
              <p className="mt-3 text-xs text-[#55DDE8]/60">
                {profileMessage}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-6">
            <p className="mb-2 text-xs font-bold tracking-[0.18em] text-[#55DDE8]/60">
              EMAIL_ADDRESS
            </p>

            <div className="rounded-2xl bg-[#282828] px-5 py-4 text-sm text-white">
              {email}
            </div>
          </div>

          {/* User ID */}
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold tracking-[0.18em] text-[#55DDE8]/60">
              USER_ID
            </p>

            <div className="overflow-hidden text-ellipsis rounded-2xl bg-[#181818] px-5 py-4 text-xs text-[#55DDE8]/50">
              {userId}
            </div>
          </div>

          <div className="grid gap-3">
            <button
              onClick={switchAccount}
              className="rounded-full border border-[#55DDE8] py-4 text-sm font-bold tracking-[0.12em] transition hover:bg-[#55DDE8]/10"
            >
              SWITCH ACCOUNT
            </button>

            <button
              onClick={logout}
              className="rounded-full bg-[#55DDE8] py-4 text-sm font-bold tracking-[0.12em] text-black transition hover:brightness-110"
            >
              LOG OUT
            </button>
          </div>

          <div className="mt-8 border-t border-[#55DDE8]/15 pt-5 text-center text-[10px] tracking-[0.2em] text-[#55DDE8]/30">
            DesAIgn // USER SESSION //
            AUTHORIZED
          </div>
        </div>
      </div>
    </main>
  );
}