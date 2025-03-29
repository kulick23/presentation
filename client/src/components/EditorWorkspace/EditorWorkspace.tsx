import { useState, useEffect, useRef } from "react";
import { usePresentationStore } from "../../store";
import SlideEditor from "../SlideEditor/SlideEditor";
import EditorToolBar from "../EditorToolBar/EditorToolBar";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import "./EditorWorkspace.scss";

export default function EditorWorkspace() {
  const { slides, deleteSlide, reorderSlides, globalStyle, setGlobalStyle } = usePresentationStore();
  const [activeSlideId, setActiveSlideId] = useState<string>("");
  const [selectedSlides, setSelectedSlides] = useState<string[]>([]);
  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slides.length && !activeSlideId) {
      setActiveSlideId(slides[0].id);
    }
  }, [slides, activeSlideId]);

  const handleUpdateStyle = (style: Partial<typeof globalStyle>) => {
    setGlobalStyle(style);
  };

  const handleDownloadPDF = async () => {
    const sortedSlides = [...slides].sort((a, b) => a.order - b.order);
    if (!sortedSlides.length) return;
    const pdf = new jsPDF("landscape", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    for (let i = 0; i < sortedSlides.length; i++) {
      const tempDiv = document.createElement("div");
      tempDiv.style.width = "800px";
      tempDiv.style.height = `${(800 * 9) / 16}px`;
      tempDiv.style.backgroundColor = globalStyle.backgroundColor;
      tempDiv.style.color = globalStyle.textColor;
      tempDiv.style.fontSize = `${globalStyle.fontSize}px`;
      tempDiv.style.fontWeight = globalStyle.fontWeight;
      tempDiv.style.fontFamily = globalStyle.fontFamily;
      tempDiv.style.padding = "10px";
      tempDiv.style.boxSizing = "border-box";
      tempDiv.style.whiteSpace = "pre-wrap";
      tempDiv.innerHTML = sortedSlides[i].content;
      tempDiv.style.position = "fixed";
      tempDiv.style.top = "-9999px";
      document.body.appendChild(tempDiv);
      const canvas = await html2canvas(tempDiv);
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      document.body.removeChild(tempDiv);
    }
    pdf.save("presentation.pdf");
  };

  const toggleSelectSlide = (slideId: string) => {
    setSelectedSlides((prev) =>
      prev.includes(slideId)
        ? prev.filter((id) => id !== slideId)
        : [...prev, slideId]
    );
  };

  const handleDeleteSelected = () => {
    selectedSlides.forEach((id) => {
      deleteSlide(id);
    });
    setSelectedSlides([]);
    if (selectedSlides.includes(activeSlideId)) {
      if (slides.length > 1) {
        const newActive = slides.find((s) => !selectedSlides.includes(s.id));
        setActiveSlideId(newActive ? newActive.id : "");
      } else {
        setActiveSlideId("");
      }
    }
  };

  const sortedSlides = [...slides].sort((a, b) => a.order - b.order);
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const reordered = Array.from(sortedSlides);
    const [removed] = reordered.splice(sourceIndex, 1);
    reordered.splice(destinationIndex, 0, removed);
    const updated = reordered.map((slide, index) => ({
      ...slide,
      order: index + 1,
    }));
    reorderSlides(updated);
  };

  return (
    <div className="editor-workspace">
      <EditorToolBar onUpdateStyle={handleUpdateStyle} onDownloadPDF={handleDownloadPDF} initialStyle={globalStyle} />
      {selectedSlides.length > 0 && (
        <div className="editor-workspace__pdf-message">
          <button className="editor-workspace__delete-button button-red" onClick={handleDeleteSelected}>
            Delete Selected Slides ({selectedSlides.length})
          </button>
        </div>
      )}
      <div className="editor-workspace__content">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="slides-droppable">
            {(provided) => (
              <div
                className="editor-workspace__sidebar"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {sortedSlides.map((slide, index) => (
                  <Draggable key={slide.id} draggableId={slide.id} index={index}>
                    {(providedDraggable) => (
                      <div
                        className={`editor-workspace__sidebar-item ${slide.id === activeSlideId ? "editor-workspace__sidebar-item--active" : ""}`}
                        ref={providedDraggable.innerRef}
                        {...providedDraggable.draggableProps}
                        {...providedDraggable.dragHandleProps}
                        onClick={() => setActiveSlideId(slide.id)}
                        style={{
                          ...providedDraggable.draggableProps.style,
                          backgroundColor: globalStyle.backgroundColor,
                          color: globalStyle.textColor,
                          fontWeight: globalStyle.fontWeight,
                          fontSize: globalStyle.fontSize,
                          fontFamily: globalStyle.fontFamily,
                        }}
                      >
                        <div className="editor-workspace__sidebar-item-header">
                          <input
                            type="checkbox"
                            className="editor-workspace__checkbox"
                            checked={selectedSlides.includes(slide.id)}
                            onChange={() => toggleSelectSlide(slide.id)}
                          />
                        </div>
                        <div className="editor-workspace__sidebar-item-content">
                          <span className="editor-workspace__slide-text">{slide.content}</span>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="editor-workspace__main">
          <div className="editor-workspace__slide" ref={slideRef}>
            {activeSlideId ? (
              <SlideEditor slideId={activeSlideId} slideStyle={globalStyle} />
            ) : (
              <div className="editor-workspace__no-slide">No active slide</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}