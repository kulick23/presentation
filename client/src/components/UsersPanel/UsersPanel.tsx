import { usePresentationStore, User } from "../../store";
import "./UsersPanel.scss";

interface UsersPanelProps {
  currentUser: User;
  presentationId: string;
}

export default function UsersPanel({ currentUser, presentationId }: UsersPanelProps) {
  const { users, changeUserRole } = usePresentationStore();

  const handleRoleChange = (userId: string, newRole: "editor" | "viewer") => {
    changeUserRole(presentationId, userId, newRole);
  };

  return (
    <div className="users-panel">
      <h3 className="users-panel__title">Users</h3>
      <ul className="users-panel__list">
        {users.map((user) => (
          <li key={user.id} className="users-panel__item">
            <div className="users-panel__info">
              <span className="users-panel__name"><strong>{user.name}</strong></span>
              <span className="users-panel__role">({user.role})</span>
            </div>
            {currentUser.role === "creator" && user.id !== currentUser.id && (
              <div className="users-panel__role-buttons">
                <button
                  className="users-panel__role-btn users-panel__role-btn--editor"
                  onClick={() => handleRoleChange(user.id, "editor")}
                >
                  Editor
                </button>
                <button
                  className="users-panel__role-btn users-panel__role-btn--viewer"
                  onClick={() => handleRoleChange(user.id, "viewer")}
                >
                  Viewer
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}