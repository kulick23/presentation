import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="container">
      <h1>List of presentations</h1>
      <Link to="/presentation/123" className="button">
      Create a presentation
      </Link>
    </div>
  );
}
