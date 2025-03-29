import { useState, useEffect } from "react";
import { usePresentationStore, Slide } from "../../store";
import "./PresentationViewer.scss";

const defaultSlideStyle = {
  textColor: "#ffffff",
  backgroundColor: "rgba(27,27,27,1)",
  fontSize: 16,
  fontWeight: "normal",
  fontFamily: "Arial",
};

export default function PresentationViewer() {
  const { slides } = usePresentationStore();
  const [activeSlideId, setActiveSlideId] = useState<string>("");

  useEffect(() => {
    if (slides.length && !activeSlideId) {
      setActiveSlideId(slides[0].id);
    }
  }, [slides, activeSlideId]);

  const activeSlide = slides.find((slide: Slide) => slide.id === activeSlideId);

  const handleThumbnailClick = (id: string) => {
    setActiveSlideId(id);
  };

  return (
    <div className="presentation-viewer">
      <div className="presentation-viewer__sidebar">
        {slides.map((slide: Slide) => (
          <div
            key={slide.id}
            className={`presentation-viewer__thumbnail ${slide.id === activeSlideId ? "presentation-viewer__thumbnail--active" : ""}`}
            onClick={() => handleThumbnailClick(slide.id)}
            style={{
              backgroundColor: defaultSlideStyle.backgroundColor,
              color: defaultSlideStyle.textColor,
              fontWeight: defaultSlideStyle.fontWeight,
              fontSize: defaultSlideStyle.fontSize,
              fontFamily: defaultSlideStyle.fontFamily,
            }}
          >
            <div className="presentation-viewer__thumbnail-header">
              #{slide.order}
            </div>
            <div className="presentation-viewer__thumbnail-content">
              {slide.content}
            </div>
          </div>
        ))}
      </div>
      <div className="presentation-viewer__active">
        {activeSlide ? (
          <div className="presentation-viewer__active-content"
            style={{
              backgroundColor: defaultSlideStyle.backgroundColor,
              color: defaultSlideStyle.textColor,
              fontWeight: defaultSlideStyle.fontWeight,
              fontSize: defaultSlideStyle.fontSize,
              fontFamily: defaultSlideStyle.fontFamily,
            }}
          >
            <h2 className="presentation-viewer__active-title">
              #{activeSlide.order}
            </h2>
            <div
              className="presentation-viewer__active-html"
              dangerouslySetInnerHTML={{ __html: activeSlide.content }}
            />
          </div>
        ) : (
          <div className="presentation-viewer__no-slide">No active slide</div>
        )}
      </div>
    </div>
  );
}