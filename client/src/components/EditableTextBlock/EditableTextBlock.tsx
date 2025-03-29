import React, { useState, useRef } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import ReactMarkdown from "react-markdown";
import "./EditableTextBlock.scss"

interface EditableTextBlockProps {
  id: string;
  initialContent: string;
  initialPosition?: { x: number; y: number };
  onUpdate: (id: string, content: string, position: { x: number; y: number }) => void;
}

export default function EditableTextBlock({
  id,
  initialContent,
  initialPosition = { x: 0, y: 0 },
  onUpdate
}: EditableTextBlockProps) {
  const [content, setContent] = useState(initialContent);
  const [position, setPosition] = useState(initialPosition);
  const nodeRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    setPosition({ x: data.x, y: data.y });
    onUpdate(id, content, { x: data.x, y: data.y });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onUpdate(id, e.target.value, position);
  };

  return (
    <Draggable nodeRef={nodeRef} position={position} onStop={handleDragStop}>
      <div ref={nodeRef} className="editable-text-block">
        <textarea value={content} onChange={handleChange} />
        <div className="editable-text-block__margin-top">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </Draggable>
  );
}