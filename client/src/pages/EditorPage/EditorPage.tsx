import { useParams } from "react-router-dom";

export default function EditorPage() {
  const { id } = useParams();
  return (
    <div className="container">
      <h1>Presentation Editor {id}</h1>
    </div>
  );
}
