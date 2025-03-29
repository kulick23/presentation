import { useState, ChangeEvent } from "react";
import "./EditorToolBar.scss";

interface EditorToolBarProps {
  onUpdateStyle: (style: {
    textColor?: string;
    backgroundColor?: string;
    fontSize?: number;
    fontWeight?: string;
    fontFamily?: string;
  }) => void;
  onDownloadPDF: () => void;
  initialStyle?: {
    textColor?: string;
    backgroundColor?: string;
    fontSize?: number;
    fontWeight?: string;
    fontFamily?: string;
  };
}

export default function EditorToolBar({
  onUpdateStyle,
  onDownloadPDF,
  initialStyle = {}
}: EditorToolBarProps) {
  const [textColor, setTextColor] = useState(initialStyle.textColor || "#000000");
  const [backgroundColor, setBackgroundColor] = useState(initialStyle.backgroundColor || "#ffffff");
  const [fontSize, setFontSize] = useState(initialStyle.fontSize || 16);
  const [isBold, setIsBold] = useState(initialStyle.fontWeight === "bold");
  const [fontFamily, setFontFamily] = useState(initialStyle.fontFamily || "Arial");

  const update = (newProps: Partial<typeof initialStyle>) => {
    onUpdateStyle({
      textColor,
      backgroundColor,
      fontSize,
      fontWeight: isBold ? "bold" : "normal",
      fontFamily,
      ...newProps,
    });
  };

  const handleTextColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTextColor(e.target.value);
    update({ textColor: e.target.value });
  };

  const handleBackgroundColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBackgroundColor(e.target.value);
    update({ backgroundColor: e.target.value });
  };

  const handleFontSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const size = Number(e.target.value);
    setFontSize(size);
    update({ fontSize: size });
  };

  const toggleBold = () => {
    setIsBold((prev) => {
      const newBold = !prev;
      update({ fontWeight: newBold ? "bold" : "normal" });
      return newBold;
    });
  };

  const handleFontFamilyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFontFamily(e.target.value);
    update({ fontFamily: e.target.value });
  };

  return (
    <div className="editor-toolbar">
      <button className="editor-toolbar__button button-blue" onClick={onDownloadPDF}>
        Download PDF
      </button>
      <label className="editor-toolbar__label">
        Text Color:
        <input
          type="color"
          className="editor-toolbar__input"
          value={textColor}
          onChange={handleTextColorChange}
        />
      </label>
      <label className="editor-toolbar__label">
        Background Color:
        <input
          type="color"
          className="editor-toolbar__input"
          value={backgroundColor}
          onChange={handleBackgroundColorChange}
        />
      </label>
      <label className="editor-toolbar__label">
        Font Size:
        <input
          type="number"
          className="editor-toolbar__input editor-toolbar__input--small"
          value={fontSize}
          onChange={handleFontSizeChange}
        />
      </label>
      <label className="editor-toolbar__label">
        Font Family:
        <select className="editor-toolbar__select" value={fontFamily} onChange={handleFontFamilyChange}>
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
        </select>
      </label>
      <button className="editor-toolbar__button button-blue" onClick={toggleBold}>
        {isBold ? "Bold" : "Normal"}
      </button>
    </div>
  );
}