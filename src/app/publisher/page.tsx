"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────────── */

interface SocialAccount {
  id: string;
  platform: string;
  displayName: string | null;
  profileUrl: string | null;
  scopes: string[];
  tokenExpiry: string | null;
  createdAt: string;
}

interface MeResponse {
  email: string;
  accounts: SocialAccount[];
}

interface UploadedAsset {
  id: string;
  storageKey: string;
  mime: string;
  sha256: string;
  previewUrl: string; // local blob URL for preview
}

interface PublishResult {
  postId: string;
  results: Record<string, { success: boolean; postUrl?: string; error?: string }>;
}

/* ─── Login Screen ──────────────────────────────────────────── */

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/publisher/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), secret: secret.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        onLogin();
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass rounded-3xl p-8 sm:p-12 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white tracking-tight">Publisher Login</h1>
        <p className="mt-2 text-sm text-zinc-400">Admin access only.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-emerald-400/40 transition"
              placeholder="mahmood@asadi.ai"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Publisher Secret</label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-emerald-400/40 transition"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-400/20 px-4 py-2.5 text-sm font-semibold text-emerald-200 hover:bg-emerald-400/30 transition disabled:opacity-50"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Account Connections ───────────────────────────────────── */

function AccountCard({
  platform,
  account,
  onDisconnect,
}: {
  platform: string;
  account: SocialAccount | undefined;
  onDisconnect: () => void;
}) {
  const label = platform === "linkedin" ? "LinkedIn" : "X (Twitter)";
  const color = platform === "linkedin" ? "cyan" : "zinc";

  return (
    <div className="premium-pill rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold",
              platform === "linkedin"
                ? "border-cyan-400/25 bg-cyan-400/10 text-cyan-300"
                : "border-white/20 bg-white/5 text-white/70"
            )}
          >
            {platform === "linkedin" ? "in" : "𝕏"}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{label}</div>
            {account ? (
              <div className="text-xs text-zinc-400">{account.displayName || "Connected"}</div>
            ) : (
              <div className="text-xs text-zinc-500">Not connected</div>
            )}
          </div>
        </div>
        <div>
          {account ? (
            <button
              onClick={onDisconnect}
              className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-400/20 transition"
            >
              Disconnect
            </button>
          ) : (
            <a
              href={`/api/social/${platform}/connect`}
              className={cn(
                "inline-block rounded-lg border px-3 py-1.5 text-xs transition",
                platform === "linkedin"
                  ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20"
                  : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
              )}
            >
              Connect
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Platform Preview ──────────────────────────────────────── */

function LinkedInPreview({ body, images }: { body: string; images: UploadedAsset[] }) {
  return (
    <div className="rounded-xl border border-cyan-400/10 bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center text-xs font-bold text-cyan-300">
          M
        </div>
        <div>
          <div className="text-xs font-semibold text-white">Mahmood Asadi</div>
          <div className="text-[10px] text-zinc-500">AI-Native Technical Leader</div>
        </div>
      </div>
      <div className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
        {body || <span className="text-zinc-600 italic">Start typing…</span>}
      </div>
      {images.length > 0 && (
        <div className={cn(
          "mt-3 grid gap-1 rounded-lg overflow-hidden",
          images.length === 1 ? "grid-cols-1" : "grid-cols-2"
        )}>
          {images.slice(0, 4).map((img) => (
            <img
              key={img.id}
              src={img.previewUrl}
              alt=""
              className="w-full h-32 object-cover bg-black/20"
            />
          ))}
        </div>
      )}
      <div className="mt-3 flex gap-4 text-[10px] text-zinc-500">
        <span>👍 Like</span>
        <span>💬 Comment</span>
        <span>🔁 Repost</span>
        <span>📤 Send</span>
      </div>
    </div>
  );
}

function XPreview({ body, images }: { body: string; images: UploadedAsset[] }) {
  const charCount = body.length;
  const isOver = charCount > 280;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/70 shrink-0">
          M
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white">Mahmood Asadi</span>
            <span className="text-[10px] text-zinc-500">@mahmoodasadi</span>
          </div>
          <div className="mt-1 text-sm text-white/80 whitespace-pre-wrap leading-relaxed break-words">
            {body ? (
              <>
                {body.slice(0, 280)}
                {isOver && <span className="text-red-400">{body.slice(280)}</span>}
              </>
            ) : (
              <span className="text-zinc-600 italic">Start typing…</span>
            )}
          </div>
          {images.length > 0 && (
            <div className={cn(
              "mt-2 grid gap-0.5 rounded-xl overflow-hidden",
              images.length === 1 ? "grid-cols-1" : "grid-cols-2"
            )}>
              {images.slice(0, 4).map((img) => (
                <img
                  key={img.id}
                  src={img.previewUrl}
                  alt=""
                  className="w-full h-28 object-cover bg-black/20"
                />
              ))}
            </div>
          )}
          <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500">
            <span>💬</span>
            <span>🔁</span>
            <span>❤️</span>
            <span>📊</span>
          </div>
        </div>
      </div>
      <div className={cn(
        "mt-2 text-right text-xs",
        isOver ? "text-red-400" : "text-zinc-500"
      )}>
        {charCount}/280
      </div>
    </div>
  );
}

/* ─── Main Publisher Page ───────────────────────────────────── */

export default function PublisherPage() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<MeResponse | null>(null);

  // Composer state
  const [body, setBody] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [images, setImages] = useState<UploadedAsset[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null);
  const [publishError, setPublishError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check auth on mount
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/publisher/me");
      if (res.ok) {
        const data: MeResponse = await res.json();
        setMe(data);
        setAuthed(true);
      } else {
        setAuthed(false);
      }
    } catch {
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Disconnect handler
  const handleDisconnect = async (platform: string) => {
    if (!confirm(`Disconnect ${platform === "linkedin" ? "LinkedIn" : "X"}? This will delete stored tokens.`)) return;
    await fetch(`/api/social/${platform}/disconnect`, { method: "POST" });
    checkAuth();
  };

  // Image upload
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (images.length >= 4) break;
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) continue;
      if (file.size > 10 * 1024 * 1024) continue;

      try {
        // Step 1: Get upload URL
        const urlRes = await fetch("/api/assets/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, mime: file.type, bytes: file.size }),
        });
        if (!urlRes.ok) continue;
        const { uploadUrl, storageKey } = await urlRes.json();

        // Step 2: Upload to S3
        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        // Step 3: Compute sha256 client-side
        const arrayBuf = await file.arrayBuffer();
        const hashBuf = await crypto.subtle.digest("SHA-256", arrayBuf);
        const sha256 = Array.from(new Uint8Array(hashBuf)).map((b) => b.toString(16).padStart(2, "0")).join("");

        // Step 4: Ingest
        const ingestRes = await fetch("/api/assets/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ storageKey, mime: file.type, bytes: file.size, sha256 }),
        });
        if (!ingestRes.ok) continue;
        const { asset } = await ingestRes.json();

        setImages((prev) => [...prev, {
          ...asset,
          previewUrl: URL.createObjectURL(file),
        }]);
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const removed = prev.find((i) => i.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  // Toggle platform
  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(platform)) next.delete(platform);
      else next.add(platform);
      return next;
    });
  };

  // Publish
  const handlePublish = async () => {
    setPublishError("");
    setPublishResult(null);
    setPublishing(true);

    try {
      const res = await fetch("/api/publisher/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: body.trim(),
          linkUrl: linkUrl.trim() || undefined,
          assetIds: images.map((i) => i.id),
          platforms: Array.from(selectedPlatforms),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.error || "Publish failed");
      } else {
        setPublishResult(data);
      }
    } catch {
      setPublishError("Network error");
    } finally {
      setPublishing(false);
      setShowConfirm(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-zinc-400">Loading…</div>
      </div>
    );
  }

  // Auth gate
  if (!authed) {
    return <LoginScreen onLogin={checkAuth} />;
  }

  const linkedin = me?.accounts.find((a) => a.platform === "linkedin");
  const x = me?.accounts.find((a) => a.platform === "x");
  const canPublish = body.trim().length > 0 && selectedPlatforms.size > 0;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Publisher</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Compose, preview, and publish to LinkedIn and X.
            </p>
          </div>
          <a
            href="/"
            className="text-xs text-zinc-500 hover:text-white transition"
          >
            ← Back to Portfolio
          </a>
        </div>

        {/* Connected Accounts */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
            Connected Accounts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AccountCard
              platform="linkedin"
              account={linkedin}
              onDisconnect={() => handleDisconnect("linkedin")}
            />
            <AccountCard
              platform="x"
              account={x}
              onDisconnect={() => handleDisconnect("x")}
            />
          </div>
        </section>

        {/* Composer + Previews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Composer */}
          <div className="glass rounded-3xl p-6">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
              Compose
            </h2>

            {/* Post body */}
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              placeholder="Write your post…"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-emerald-400/40 transition resize-none"
            />

            {/* Link */}
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Optional link URL"
              className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-emerald-400/40 transition"
            />

            {/* Image upload */}
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={images.length >= 4}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 hover:bg-white/10 transition disabled:opacity-30"
                >
                  📎 Add Images ({images.length}/4)
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
              {images.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {images.map((img) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.previewUrl}
                        alt=""
                        className="w-20 h-20 rounded-lg object-cover border border-white/10"
                      />
                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Platform selection */}
            <div className="mt-6">
              <div className="text-xs text-zinc-400 mb-2">Publish to:</div>
              <div className="flex gap-2">
                {linkedin && (
                  <button
                    onClick={() => togglePlatform("linkedin")}
                    className={cn(
                      "rounded-xl border px-4 py-2 text-xs transition",
                      selectedPlatforms.has("linkedin")
                        ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-300"
                        : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                    )}
                  >
                    ✓ LinkedIn
                  </button>
                )}
                {x && (
                  <button
                    onClick={() => togglePlatform("x")}
                    className={cn(
                      "rounded-xl border px-4 py-2 text-xs transition",
                      selectedPlatforms.has("x")
                        ? "border-white/30 bg-white/15 text-white"
                        : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                    )}
                  >
                    ✓ X (Twitter)
                  </button>
                )}
                {!linkedin && !x && (
                  <p className="text-xs text-zinc-500">Connect at least one account above.</p>
                )}
              </div>
            </div>

            {/* Publish button (2-step: Preview → Confirm) */}
            <div className="mt-6">
              {publishError && (
                <div className="mb-3 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-300">
                  {publishError}
                </div>
              )}

              {publishResult && (
                <div className="mb-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs text-emerald-300">
                  <div className="font-semibold mb-1">Published!</div>
                  {Object.entries(publishResult.results).map(([platform, r]) => (
                    <div key={platform} className="flex items-center gap-2">
                      <span>{platform === "linkedin" ? "LinkedIn" : "X"}:</span>
                      {r.success ? (
                        r.postUrl ? (
                          <a href={r.postUrl} target="_blank" rel="noopener noreferrer" className="underline">
                            View post ↗
                          </a>
                        ) : (
                          <span>✓ Success</span>
                        )
                      ) : (
                        <span className="text-red-300">✗ {r.error}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!showConfirm ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={!canPublish || publishing}
                  className="w-full rounded-xl bg-emerald-400/20 px-4 py-3 text-sm font-semibold text-emerald-200 hover:bg-emerald-400/30 transition disabled:opacity-30"
                >
                  Preview & Confirm
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-xs text-amber-300">
                    ⚠️ This will publish immediately to {Array.from(selectedPlatforms).join(" & ")}.
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/10 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePublish}
                      disabled={publishing}
                      className="flex-1 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition disabled:opacity-50"
                    >
                      {publishing ? "Publishing…" : "🚀 Publish Now"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Previews */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
              Previews
            </h2>

            {selectedPlatforms.has("linkedin") && (
              <div>
                <div className="text-xs text-cyan-400 mb-2 font-medium">LinkedIn</div>
                <LinkedInPreview body={body} images={images} />
              </div>
            )}

            {selectedPlatforms.has("x") && (
              <div>
                <div className="text-xs text-white/60 mb-2 font-medium">X (Twitter)</div>
                <XPreview body={body} images={images} />
              </div>
            )}

            {selectedPlatforms.size === 0 && (
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8 text-center">
                <p className="text-sm text-zinc-500">Select a platform to see preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
