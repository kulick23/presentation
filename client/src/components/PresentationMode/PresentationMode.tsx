import { useState } from "react";
import { usePresentationStore } from "../../store";
import "./PresentationMode.scss";

const defaultSlideStyle = {
  textColor: "#ffffff",
  backgroundColor: "rgba(27,27,27,1)",
  fontSize: 16,
  fontWeight: "normal",
  fontFamily: "Arial",
};

interface PresentationModeProps {
  onClose: () => void;
}

export default function PresentationMode({ onClose }: PresentationModeProps) {
  const { slides, globalStyle } = usePresentationStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!slides.length) {
    return (
      <div className="presentation-mode presentation-mode--no-slides">
        <button className="presentation-mode__close-btn" onClick={onClose}>
          ✖
        </button>
        <div className="presentation-mode__no-slide-message">No slides available</div>
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentIndex];

  return (
    <div className="presentation-mode">
      <button className="presentation-mode__close-btn" onClick={onClose}>
        ✖
      </button>
      <div className="presentation-mode__container">
        <button className="presentation-mode__nav-btn presentation-mode__nav-btn--prev" onClick={prevSlide}>
          ‹
        </button>
        <div
          className="presentation-mode__content"
          style={{
            backgroundColor: defaultSlideStyle.backgroundColor,
            color: defaultSlideStyle.textColor,
            fontWeight: defaultSlideStyle.fontWeight,
            fontSize: defaultSlideStyle.fontSize,
            fontFamily: defaultSlideStyle.fontFamily,
          }}
        >
          <h2 className="presentation-mode__title">#{slide.order}</h2>
          <div
            className="presentation-mode__html"
            style={{
              whiteSpace: "pre-wrap",
              color: globalStyle.textColor,
              backgroundColor: globalStyle.backgroundColor,
              fontSize: `${globalStyle.fontSize}px`,
              fontWeight: globalStyle.fontWeight,
              fontFamily: globalStyle.fontFamily,
            }}
            dangerouslySetInnerHTML={{ __html: slide.content }}
          />
        </div>
        <button className="presentation-mode__nav-btn presentation-mode__nav-btn--next" onClick={nextSlide}>
          ›
        </button>
      </div>
    </div>
  );
}