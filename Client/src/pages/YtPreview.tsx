import { useSearchParams } from "react-router-dom";
import { yt_html } from "../assets/assets";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const YtPreview = () => {
  const [searchParams] = useSearchParams();

  const thumbnailUrl = searchParams.get("thumbnail_url") || "";
  const title = searchParams.get("title") || "Generated thumbnail";

  const newHtml = yt_html
    .replaceAll("%%THUMBNAIL_URL%%", escapeHtml(thumbnailUrl))
    .replaceAll("%%TITLE%%", escapeHtml(title));

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <iframe
        srcDoc={newHtml}
        width="100%"
        height="100%"
        allowFullScreen
        title="YouTube preview"
      />
    </div>
  );
};

export default YtPreview;
