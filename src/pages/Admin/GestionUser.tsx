import Navbar from "../../components/Navbar"
import styles from "./gestionUser.css"
import { useEffect, useState } from "react"
import { getUsers, deleteUser, toggleBlockUser } from "../../services/api";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Función para cargar los usuarios (Llama a getAllUsers) ---
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers(); // <--- Llama al servicio
      setUsers(data);
    } catch (err) {
      setError("No se pudo cargar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar la carga de usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Función para Eliminar Usuario (Llama a deleteUser) ---
  const handleDeleteUser = async (userId) => {
    if (!window.confirm(`¿Seguro que quieres eliminar al usuario ${userId}?`)) return;

    try {
      await deleteUser(userId); // <--- Llama al servicio
      
      // Actualiza el estado local: filtra al usuario eliminado
      setUsers(prevUsers => prevUsers.filter(user => users.id !== userId));
      alert(`Usuario ${userId} eliminado. 🗑️`);

    } catch (err) {
      alert("Error al eliminar el usuario.");
      // Opcional: Volver a cargar la lista para asegurar la consistencia
      // fetchUsers(); 
    }
  };

  // --- Función para Bloquear/Desbloquear Usuario (Llama a toggleBlockUser) ---
  const handleToggleBlock = async (userId) => {
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return;
    
    // El nuevo estado es el inverso del estado actual
    const newBlockedState = !userToUpdate.isBlocked; 

    try {
      // <--- Llama al servicio con el nuevo estado
      const updatedUser = await toggleBlockUser(userId, newBlockedState); 
      
      // Actualiza el estado local: mapea y reemplaza el usuario modificado
      setUsers(prevUsers =>
        prevUsers.filter(user => user.Id !== userId)
      );
      alert(`Usuario ${userId} ${newBlockedState ? 'BLOQUEADO' : 'DESBLOQUEADO'}.`);
      
    } catch (err) {
      alert("Error al modificar el estado de bloqueo.");
    }
  };


  // --- Renderizado del Componente ---
  if (loading) return <p>Cargando... ⏳</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Administración de Usuarios</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.isBlocked ? 'Bloqueado 🔒' : 'Activo ✅'}</td>
              <td>
                <button onClick={() => handleToggleBlock(user.id)}>
                  {user.isBlocked ? 'Desbloquear' : 'Bloquear'}
                </button>
                <button 
                  onClick={() => handleDeleteUser(user.id)} 
                  style={{ marginLeft: '10px', backgroundColor: 'salmon' }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && <p>No hay usuarios para mostrar.</p>}
    </div>
  );
}
import { getUsers } from "../../services/api"

export default UserList;