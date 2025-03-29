import { usePresentationStore } from "../../store";
import SlideEditor from "../SlideEditor/SlideEditor";
import "./SlideList.css";

export default function SlideList() {
  const { slides } = usePresentationStore();

  return (
    <div className="SlideList">
      {slides.map((slide) => (
        <SlideEditor key={slide.id} slideId={slide.id} />
      ))}
    </div>
  );
}