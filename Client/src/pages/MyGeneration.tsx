import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRightIcon, DownloadIcon, TrashIcon } from "lucide-react";
import SoftBackDrop from "../components/SoftBackDrop";
import type { IThumbnail } from "../assets/assets";
import Footer from "../components/Footer";
import { toast } from "react-hot-toast";
import api from "../configs/api";
import { useAuth } from "../context/AuthContext";

const aspectRatioClassMap: Record<string, string> = {
  "16:9": "aspect-video",
  "1:1": "aspect-square",
  "9:16": "aspect-[9/16]",
};

const getPreviewUrl = (thumb: IThumbnail) => {
  const params = new URLSearchParams({
    thumbnail_url: thumb.image_url || "",
    title: thumb.title || "Generated thumbnail",
  });

  return `/preview?${params.toString()}`;
};

const MyGeneration = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [thumbnails, setThumbnails] = useState<IThumbnail[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchThumbnails = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/user/thumbnails");
      const list = data?.thumbnails ?? data?.data ?? [];
      setThumbnails(Array.isArray(list) ? list : []);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message || "Failed to load thumbnails");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (imageUrl?: string) => {
    if (!imageUrl) return toast.error("Image is not ready yet");

    const link = document.createElement("a");
    link.href = imageUrl.replace("/upload", "/upload/fl_attachment");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this thumbnail?");
    if (!confirmed) return;

    try {
      const { data } = await api.delete(`/api/thumbnail/detail/${id}`);
      toast.success(data.message || "Thumbnail deleted");
      setThumbnails((prev) => prev.filter((t) => t._id !== id));
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message || "Delete failed");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchThumbnails();
    } else {
      setThumbnails([]);
    }
  }, [isLoggedIn]);

  return (
    <>
      <SoftBackDrop />
      <div className="mt-32 min-h-screen px-6 md:px-16 lg:px-24 xl:px-32">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-200">My Generations</h1>
          <p className="mt-1 text-sm text-zinc-400">
            View and manage all your AI-generated thumbnails
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[260px] rounded-2xl bg-white/[0.06] border border-white/10 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && thumbnails.length === 0 && (
          <div className="py-24 text-center">
            <h3 className="text-lg font-semibold text-zinc-200">No thumbnails yet</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Generate your first thumbnail to see it here
            </p>
          </div>
        )}

        {!loading && thumbnails.length > 0 && (
          <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 2xl:columns-4">
            {thumbnails.map((thumb) => {
              const aspectClass = aspectRatioClassMap[thumb.aspect_ratio ?? "16:9"];

              return (
                <div
                  key={thumb._id}
                  onClick={() => navigate(`/generate/${thumb._id}`)}
                  className="group relative mb-8 cursor-pointer break-inside-avoid rounded-2xl bg-white/[0.06] border border-white/10 shadow-xl transition"
                >
                  <div className={`relative overflow-hidden rounded-t-2xl ${aspectClass} bg-black`}>
                    {thumb.image_url ? (
                      <img
                        src={thumb.image_url}
                        alt={thumb.title || "Generated thumbnail"}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-zinc-300">
                        {thumb.isGenerating ? "Generating..." : "No Image"}
                      </div>
                    )}

                    {thumb.isGenerating && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-medium text-white">
                        Generating...
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2">
                      {thumb.title}
                    </h3>

                    <div className="flex items-center justify-between gap-1 text-xs text-zinc-400">
                      <span className="px-2 py-0.5 rounded bg-white/8">{thumb.style}</span>
                      <span className="px-2 py-0.5 rounded bg-white/8">{thumb.color_scheme ?? "vibrant"}</span>
                      <span className="px-2 py-0.5 rounded bg-white/8">{thumb.aspect_ratio ?? "16:9"}</span>
                    </div>

                    {thumb.createdAt && (
                      <p className="text-xs text-zinc-500">
                        {new Date(thumb.createdAt).toDateString()}
                      </p>
                    )}
                  </div>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-2 right-2 max-sm:flex sm:hidden group-hover:flex gap-1.5"
                  >
                    <button type="button" onClick={() => handleDelete(thumb._id)}>
                      <TrashIcon className="size-6 bg-black/50 p-1 rounded hover:bg-indigo-600 transition-all" />
                    </button>

                    <button type="button" onClick={() => handleDownload(thumb.image_url)}>
                      <DownloadIcon className="size-6 bg-black/50 p-1 rounded hover:bg-indigo-600 transition-all" />
                    </button>

                    {thumb.image_url && (
                      <Link target="_blank" to={getPreviewUrl(thumb)}>
                        <ArrowUpRightIcon className="size-6 bg-black/50 p-1 rounded hover:bg-indigo-600 transition-all" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default MyGeneration;
