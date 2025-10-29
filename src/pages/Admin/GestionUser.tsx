import Navbar from "../../components/Navbar";
import "./gestionUser.css";
import { useEffect, useState } from "react";
import { getUsers, deleteUser, toggleBlockUser } from "../../services/api";

const STATE_MAP: Record<number, string> = {
  1: "Activo ✅",
  2: "Bloqueado 🔒",
  3: "Inactivo ⏸️",
  4: "Eliminado 🗑️",
};

function UserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState("all"); // 👈 nuevo estado

  // --- Paginación ---
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // --- Cargar usuarios ---
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      const activeUsers = data.filter((user: any) => user.state !== 4);
      setUsers(activeUsers);
    } catch (err) {
      setError("No se pudo cargar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Eliminar usuario (borrado lógico) ---
  const handleDeleteUser = async (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user || user.state === 4) return;

    if (!window.confirm(`¿Seguro que quieres eliminar al usuario ${user.first_name}?`))
      return;

    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      alert(`Usuario ${user.first_name} eliminado 🗑️`);
    } catch (err) {
      alert("Error al eliminar el usuario.");
    }
  };

  // --- Bloquear / Desbloquear usuario ---
  const handleToggleBlock = async (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const newState = user.state === 2 ? 1 : 2; // alterna entre bloqueado y activo

    try {
      const updatedUser = await toggleBlockUser(userId, newState);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, state: updatedUser.state } : u))
      );
      alert(
        `Usuario ${user.first_name} ${
          newState === 2 ? "bloqueado 🔒" : "desbloqueado ✅"
        }`
      );
    } catch {
      alert("Error al cambiar el estado del usuario.");
    }
  };

  const ROLE_MAP: Record<number, string> = {
    1: "Administrador",
    2: "Dueño Óptica",
    3: "Usuario",
  };

  // --- Filtrar por rol ---
  const filteredUsers =
    selectedRole === "all"
      ? users
      : users.filter((user) => String(user.role) === selectedRole);

  // --- Cálculo de paginación ---
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // --- Renderizado ---
  if (loading) return <p className="loading">Cargando... ⏳</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="userlist-container">
      <Navbar />
      <h1 className="title">Gestión de Usuarios</h1>
      <p className="subtitle">
        En este panel puedes gestionar los usuarios registrados, filtrarlos por rol y controlar su estado.
      </p>
      {/* --- Filtro por rol --- */}
      <div className="filter-container">
        <label htmlFor="roleFilter">Filtrar por rol:</label>
        <select
          id="roleFilter"
          onChange={(e) => setSelectedRole(e.target.value)}
          value={selectedRole}
        >
          <option value="all">Todos</option>
          <option value="1">Administrador</option>
          <option value="2">Dueño Óptica</option>
          <option value="3">Usuario</option>
        </select>
      </div>

      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Rol</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{ROLE_MAP[user.role] || "Desconocido"}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
              <td className="state-cell">
                <span className={`state state-${user.state}`}>
                  {STATE_MAP[user.state] || "Desconocido"}
                </span>
              </td>

              <td>
                {user.state !== 4 ? (
                  <div className="action-buttons">
                    <button
                      className={user.state === 2 ? "btn-unlock" : "btn-lock"}
                      onClick={() => handleToggleBlock(user.id)}
                    >
                      {user.state === 2 ? "Desbloquear" : "Bloquear"}
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                ) : (
                  <span>❌ Eliminado</span>
                )}
              </td>

              </tr>
            ))}
          </tbody>
        </table>

        {/* --- Paginador --- */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {users.length === 0 && <p>No hay usuarios para mostrar.</p>}
    </div>
  );
}

export default UserList;
