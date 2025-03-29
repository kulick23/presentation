import React from "react";
import { usePresentationStore } from "../../store";
import "./SlideEditor.scss";

interface SlideEditorProps {
  slideId: string;
  slideStyle?: {
    textColor?: string;
    backgroundColor?: string;
    fontSize?: number;
    fontWeight?: string;
    fontFamily?: string;
  };
}

export default function SlideEditor({ slideId, slideStyle }: SlideEditorProps) {
  const { slides, updateSlide } = usePresentationStore();
  const slide = slides.find((s) => s.id === slideId);

  if (!slide) {
    return <div className="slide-editor__not-found">Slide not found</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSlide(slideId, e.target.value);
  };

  return (
    <div className="slide-editor">
      <textarea
        className="slide-editor__textarea"
        value={slide.content}
        onChange={handleChange}
        rows={10}
        cols={50}
        style={{
          color: slideStyle?.textColor,
          backgroundColor: slideStyle?.backgroundColor,
          fontSize: slideStyle?.fontSize,
          fontWeight: slideStyle?.fontWeight,
          fontFamily: slideStyle?.fontFamily,
        }}
      />
    </div>
  );
}
