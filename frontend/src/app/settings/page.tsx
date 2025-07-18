"use client";
import React, { useEffect, useState } from "react";
import axios from "@/utils/config/axiosConfig";
import ReactDOM from "react-dom";

interface User {
  uuid: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_admin: boolean;
  password_hash?: string;
}

const emptyUser: User = {
  uuid: "",
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  role: "user",
  is_admin: false,
  password_hash: "",
};

const SettingsPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formUser, setFormUser] = useState<User>(emptyUser);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Ajout des deux états pour la suppression
  const [userToDeleteUuid, setUserToDeleteUuid] = useState<string | null>(null);
  const [userToDeleteName, setUserToDeleteName] = useState<string | null>(null);

  // Charger les utilisateurs
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/users");
      console.log("Utilisateurs récupérés :", res.data);
      // Correction : on s'assure que chaque user a bien un champ uuid
      const usersWithUuid = res.data.map((user: any) => ({
        ...user,
        uuid: user.uuid || user._id || "",
      }));
      setUsers(usersWithUuid);
    } catch (err: any) {
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Ajout
  const handleAddUser = () => {
    setFormUser(emptyUser);
    setFormError("");
    setShowAddModal(true);
  };
  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    // Validation simple
    if (!formUser.username || !formUser.first_name || !formUser.last_name || !formUser.email || !formUser.password_hash || !formUser.role) {
      setFormError("Tous les champs sont obligatoires.");
      setFormLoading(false);
      return;
    }
    try {
      await axios.post("/users/register", formUser);
      setShowAddModal(false);
      fetchUsers();
    } catch (err: any) {
      setFormError("Erreur lors de l'ajout de l'utilisateur.");
    } finally {
      setFormLoading(false);
    }
  };

  // Modification
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormUser({ ...user, password_hash: "" }); // On ne modifie pas le mot de passe par défaut
    setFormError("");
    setShowEditModal(true);
  };
  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setShowEditModal(true);
    setFormError("");
    if (!formUser.username || !formUser.first_name || !formUser.last_name || !formUser.email || !formUser.role) {
      setFormError("Tous les champs sont obligatoires.");
      setFormLoading(false);
      return;
    }
    try {
      // Préparer le payload sans uuid, created_at, updated_at
      const payload: any = {
        username: formUser.username,
        first_name: formUser.first_name,
        last_name: formUser.last_name,
        email: formUser.email,
        role: formUser.role,
        is_admin: formUser.is_admin,
      };
      if (formUser.password_hash && formUser.password_hash.trim() !== "") {
        payload.password_hash = formUser.password_hash;
      }
      await axios.put(`/users/update/${selectedUser?.uuid}`, payload);
      setShowEditModal(false);
      fetchUsers();
    } catch (err: any) {
      setFormError("Erreur lors de la modification de l'utilisateur.");
    } finally {
      setFormLoading(false);
    }
  };

  // Suppression
  const handleDeleteUser = (user: User) => {
    setUserToDeleteUuid(user.uuid);
    setUserToDeleteName(user.username);
    setShowDeleteModal(true);
  };
  const handleDeleteUserConfirm = async () => {
    setFormLoading(true);
    try {
      if (userToDeleteUuid) {
        await axios.delete(`/users/delete/${userToDeleteUuid}`);
        setShowDeleteModal(false);
        fetchUsers();
      } else {
        setFormError("Utilisateur non sélectionné ou UUID manquant.");
      }
    } catch (err: any) {
      setFormError("Erreur lors de la suppression de l'utilisateur.");
    } finally {
      setFormLoading(false);
    }
  };

  // Formulaire utilisateur (ajout/modif)
  const UserForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <form onSubmit={isEdit ? handleEditUserSubmit : handleAddUserSubmit} className="space-y-4 bg-gray-50 border border-gray-200 rounded-xl p-6">
      <div className="space-y-4">
        <input
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Nom d'utilisateur"
          value={formUser.username}
          onChange={e => setFormUser(prev => ({ ...prev, username: e.target.value }))}
        />
        <input
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Prénom"
          value={formUser.first_name}
          onChange={e => setFormUser(prev => ({ ...prev, first_name: e.target.value }))}
        />
        <input
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Nom"
          value={formUser.last_name}
          onChange={e => setFormUser(prev => ({ ...prev, last_name: e.target.value }))}
        />
        <input
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Email"
          type="email"
          value={formUser.email}
          onChange={e => setFormUser(prev => ({ ...prev, email: e.target.value }))}
        />
        <select
          className="border rounded-lg px-3 py-2 w-full"
          value={formUser.role}
          onChange={e => setFormUser(prev => ({ ...prev, role: e.target.value }))}
        >
          <option value="user">Utilisateur</option>
          <option value="admin">Admin</option>
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formUser.is_admin}
            onChange={e => setFormUser(prev => ({ ...prev, is_admin: e.target.checked }))}
          />
          Admin ?
        </label>
        {/* Champ mot de passe uniquement si ajout OU si modif (optionnel) */}
        {(!isEdit || isEdit) && (
          <input
            className="border rounded-lg px-3 py-2 w-full"
            placeholder="Mot de passe (laisser vide pour ne pas changer)"
            type="password"
            value={formUser.password_hash}
            onChange={e => setFormUser(prev => ({ ...prev, password_hash: e.target.value }))}
          />
        )}
      </div>
      {formError && <div className="text-red-500 text-sm">{formError}</div>}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          disabled={formLoading}
        >
          {isEdit ? "Enregistrer" : "Ajouter"}
        </button>
      </div>
    </form>
  );

  // Modal générique avec React Portal
  const Modal = ({ show, onClose, children }: { show: boolean, onClose: () => void, children: React.ReactNode }) => {
    React.useEffect(() => {
      if (show) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return () => {
        document.body.style.overflow = "";
      };
    }, [show]);
    if (!show) return null;
    return ReactDOM.createPortal(
      <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow p-8 w-full max-w-xl relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
            onClick={onClose}
            type="button"
            aria-label="Fermer"
          >×</button>
          {children}
        </div>
      </div>,
      typeof window !== "undefined" ? document.body : (null as any)
    );
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Gestion des utilisateurs</h2>
      <div className="mb-6 flex gap-4 items-center">
        <input
          type="text"
          className="border rounded-lg px-3 py-2 flex-1"
          placeholder="Rechercher par nom ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleAddUser}
        >
          Ajouter un utilisateur
        </button>
      </div>
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <table className="min-w-full text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">Nom d'utilisateur</th>
              <th className="py-2 px-4">Prénom</th>
              <th className="py-2 px-4">Nom</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Rôle</th>
              <th className="py-2 px-4">Admin</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-4">Chargement...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} className="text-red-500 py-4">{error}</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-gray-400 py-4">Aucun utilisateur trouvé.</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.uuid} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{user.username}</td>
                  <td className="py-2 px-4">{user.first_name}</td>
                  <td className="py-2 px-4">{user.last_name}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.role}</td>
                  <td className="py-2 px-4">{user.is_admin ? "Oui" : "Non"}</td>
                  <td className="py-2 px-4">
                    <button
                      className="text-blue-600 hover:underline mr-2"
                      onClick={() => handleEditUser(user)}
                    >
                      Modifier
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDeleteUser(user)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Ajout */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
        <h3 className="text-xl font-bold mb-4">Ajouter un utilisateur</h3>
        <UserForm />
      </Modal>

      {/* Modal Modification */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <h3 className="text-xl font-bold mb-4">Modifier l'utilisateur</h3>
        <UserForm isEdit />
      </Modal>

      {/* Modal Suppression */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <h3 className="text-xl font-bold mb-4">Supprimer l'utilisateur</h3>
        <p className="mb-6">Voulez-vous vraiment supprimer <span className="font-semibold">{userToDeleteName}</span> ?</p>
        {formError && <div className="text-red-500 text-sm mb-2">{formError}</div>}
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => setShowDeleteModal(false)}
            disabled={formLoading}
          >
            Annuler
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={handleDeleteUserConfirm}
            disabled={formLoading}
          >
            Supprimer
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage; 