import { useEffect, useState } from "react";
import UsersPanel from "../components/UsersPanel/UsersPanel";
import { usePresentationStore } from "../store";
import EditorWorkspace from "../components/EditorWorkspace/EditorWorkspace";
import PresentationMode from "../components/PresentationMode/PresentationMode";
import "./routes.scss";

interface User {
  id: string;
  name: string;
  role: "creator" | "editor" | "viewer";
}

export default function AppRoutes() {
  const [isPresentation, setIsPresentation] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [nick, setNick] = useState("");
  const [role, setRole] = useState<"creator" | "editor" | "viewer">("viewer");

  const { joinPresentation, addSlide } = usePresentationStore();

  useEffect(() => {
    if (user) {
      joinPresentation("123", user);
    }
  }, [user, joinPresentation]);

  const handleLogin = () => {
    if (!nick.trim()) return;
    setUser({ id: Date.now().toString(), name: nick.trim(), role });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddSlide = () => {
    addSlide();
  };

  if (!user) {
    return (
      <div className="login-form">
        <h2 className="login-form__title">Login to Presentation</h2>
        <input
          type="text"
          placeholder="Enter nickname"
          value={nick}
          onChange={(e) => setNick(e.target.value)}
          className="login-form__input"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "creator" | "editor" | "viewer")}
          className="login-form__select"
        >
          <option value="creator">Creator</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
        <button onClick={handleLogin} className="login-form__button">
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app__main-container">
        <div className="app__toolbar">
          <button onClick={() => setIsPresentation(true)} className="app__btn">
            👁 View
          </button>
          {user.role === "creator" && (
            <button onClick={handleAddSlide} className="app__btn button-green">
              ➕ Add Slide
            </button>
          )}
          <button onClick={handleLogout} className="app__btn">
            ⏏ Log out
          </button>
        </div>
        <div className="app__content">
          {!isPresentation ? (
            <EditorWorkspace />
          ) : (
            <PresentationMode onClose={() => setIsPresentation(false)} />
          )}
        </div>
      </div>
      <UsersPanel currentUser={user} presentationId="123" />
    </div>
  );
}