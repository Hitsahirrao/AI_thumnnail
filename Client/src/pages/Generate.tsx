import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import type { IThumbnail } from "../assets/assets";
import Footer from "../components/Footer";
import {
  AspectRatio,
  colorSchemes,
  dummyThumbnails,
  ThumbnailStyle,
} from "../assets/assets";
import SoftBackDrop from "../components/SoftBackDrop";
import AspectRatioSelector from "../components/AspectRatioSelector";
import StyleSelector from "../components/StyleSelector";
import ColorSchemeSelector from "../components/ColorSchemeSelector";
import PreviewPanel from "../components/PreviewPanel";
import {toast} from "react-hot-toast";
import api from "../configs/api"; 
import {useAuth} from "../context/AuthContext";

const Generate = () => {
  const { id } = useParams<{ id: string }>();
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const {isLoggedIn} = useAuth();

  const [title, setTitle] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null);
  const [loading, setLoading] = useState(false);

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [style, setStyle] = useState<ThumbnailStyle>("Bold & Graphic");
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);

  const [colorSchemeId, setColorSchemeId] = useState<string>(colorSchemes[0].id);

  const handleGenerate = async () => {
  if (!isLoggedIn) return toast.error("Please login to generate a thumbnail");
  if (!title.trim()) return toast.error("Please enter a title or topic for the thumbnail");

  setLoading(true);

  const api_payload = {
    title,
    prompt: additionalDetails,
    style,
    aspect_ratio: aspectRatio,
    color_scheme: colorSchemeId,
    text_overlay: true,
  };

  try {
    const { data } = await api.post("/api/thumbnail/generate", api_payload);

    if (data?.thumbnail?._id) {
      toast.success(data.message || "Thumbnail created");
      navigate("/generate/" + data.thumbnail._id);
    } else {
      toast.error(data?.message || "Something went wrong");
      setLoading(false);
    }
  } catch (error: any) {
    console.log(error);
    toast.error(error?.response?.data?.message || error.message || "An error occurred");
    setLoading(false);
  }
};
  const fetchThumbnail = async ()=> {
    try {
      const {data} = await api.get(`/api/user/thumbnail/${id}`);
      const t = data?.thumbnail as IThumbnail | undefined;

      if(!t){
        setThumbnail(null);
        setLoading(false);
        return;
      }

      setThumbnail(t);
      setLoading(!t.image_url);
      setAdditionalDetails(t.user_prompt || "")
      setTitle((t as any).title || "")
      setAspectRatio((t as any).aspect_ratio || "16:9")
      setStyle((t as any).style || "Bold & Graphic")
      setColorSchemeId((t as any).color_scheme || colorSchemes[0].id)
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message || "An error occurred");
      setLoading(false);
    }
  }

  useEffect(()=>{
    if(isLoggedIn && id){
      fetchThumbnail()
    }
    if(id && loading && isLoggedIn){
      const interval = setInterval(()=>{
        fetchThumbnail()
      },5000);
      return ()=> clearInterval(interval)
    }
  },[id,loading, isLoggedIn])

  useEffect(()=>{
    if(!id && thumbnail){
      setThumbnail(null)
    }
  },[pathname])

  return (
    <>
      <SoftBackDrop />
      <div className="pt-24 min-h-screen">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            {/* Left Panel */}
            <div className={`space-y-6 ${id ? "pointer-events-none" : ""}`}>
              <div className="p-6 rounded-2xl bg-white/[0.08] border border-white/[0.12] shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100 mb-1">
                    Create Your Thumbnail
                  </h2>
                  <p>Describe your vision and let AI bring it to life</p>
                </div>

                <div className="space-y-5">
                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-medium">
                      Title or Topic
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={100}
                      placeholder="e.g., 10 tips for better sleep"
                      className="w-full px-4 py-3 rounded-lg border border-white/12 bg-black/20 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex justify-end">
                      <span className="text-xs text-zinc-400">
                        {title.length}/100
                      </span>
                    </div>
                  </div>

                  {/* Aspect Ratio */}
                  <AspectRatioSelector
                    value={aspectRatio}
                    onChange={setAspectRatio}
                  />

                  {/* Style */}
                  <StyleSelector
                    value={style}
                    onChange={setStyle}
                    isOpen={styleDropdownOpen}
                    setIsOpen={setStyleDropdownOpen}
                  />
 
                  {/* ColorSchemeSelector */}
                  <ColorSchemeSelector value={colorSchemeId} onChange={setColorSchemeId}/>

                  {/* TODO: add your ColorSchemeSelector here */}

                  {/* Details */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Additional Prompts{" "}
                      <span className="text-zinc-400 text-xs">(optional)</span>
                    </label>
                    <textarea
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      rows={3}
                      placeholder="Add any specific elements, mood, or style preferences..."
                      className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/[0.06] text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                </div>

                {/* Button */}
                {!id && (
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="text-[15px] w-full py-3.5 rounded-xl font-medium bg-gradient-to-b from-indigo-400 to-indigo-600 hover:from-indigo-700 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Generating..." : "Generate Thumbnail"}
                  </button>
                )}
              </div>
            </div>

            {/* Right panel can go here if needed */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-zinc-100">Preview</h2>
                <PreviewPanel
                    thumbnail={thumbnail}
                    isLoading={loading}
                    aspectRatio={aspectRatio}
                />
            </div>
            </div>

            {/**Footer */}
            <Footer/>
        </main>
      </div>
    </>
  );
};

export default Generate;
