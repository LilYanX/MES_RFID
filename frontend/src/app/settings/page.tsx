"use client";

import React, { useEffect, useState } from "react";
import axios from "@/utils/config/axiosConfig";
import ReactDOM from "react-dom";
import UserForm from "@/app/settings/components/userform"

interface User {
  _id?: string;
  uuid: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_admin: boolean;
  password_hash?: string;
}

// Modal générique
const Modal = ({ onClose, children }: { onClose: () => void; children: React.ReactNode }) => {
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

const SettingsPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formUser, setFormUser] = useState<User>({
    uuid: "",
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "user",
    is_admin: false,
    password_hash: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/users");
      // On s'assure que chaque user a bien un champ uuid (toujours string)
      const usersWithUuid = res.data.map((user: any) => ({
        ...user,
        uuid: String(user.uuid || user._id || ""),
      }));
      setUsers(usersWithUuid);
    } catch (err) {
      console.error("Erreur lors de la récupération des utilisateurs :", err);
    }
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      await axios.post("/users/register", formUser);
      setShowAddModal(false);
      fetchUsers();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Erreur lors de l'ajout.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      await axios.put(`/users/update/${formUser.uuid}`, formUser);
      setShowEditModal(false);
      fetchUsers();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Erreur lors de la modification.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
    try {
      await axios.delete(`/users/delete/${id}`);
      fetchUsers();
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  // Filtrage dynamique selon la recherche
  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase();
    return (
      user.username.toLowerCase().includes(q) ||
      user.first_name.toLowerCase().includes(q) ||
      user.last_name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h1>
      <div className="mb-6 flex gap-4 items-center">
        <input
          type="text"
          className="border rounded-lg px-3 py-2 flex-1"
          placeholder="Rechercher par nom, prénom, email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          onClick={() => {
            setFormUser({
              uuid: "",
              username: "",
              first_name: "",
              last_name: "",
              email: "",
              role: "user",
              is_admin: false,
              password_hash: "",
            });
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Ajouter un utilisateur
        </button>
      </div>
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <table className="min-w-full text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">Nom d'utilisateur</th>
              <th className="py-2 px-4">Nom</th>
              <th className="py-2 px-4">Prénom</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Rôle</th>
              <th className="py-2 px-4">Admin</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id || user.uuid} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{user.username}</td>
                <td className="py-2 px-4">{user.last_name}</td>
                <td className="py-2 px-4">{user.first_name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.role}</td>
                <td className="py-2 px-4">{user.is_admin ? "Oui" : "Non"}</td>
                <td className="py-2 px-4 flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setFormUser({ ...user, password_hash: "" });
                      setShowEditModal(true);
                    }}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id || user.uuid)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal d'ajout */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl shadow p-8 w-full max-w-xl">
            <h2 className="text-lg font-semibold mb-4">Ajouter un utilisateur</h2>
            <UserForm
              isEdit={false}
              formUser={formUser}
              setFormUser={setFormUser}
              formError={formError}
              formLoading={formLoading}
              onSubmit={handleAddUserSubmit}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </Modal>
      )}

      {/* Modal de modification */}
      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)}>
          <div className="bg-white rounded-xl shadow p-8 w-full max-w-xl">
            <h2 className="text-lg font-semibold mb-4">Modifier l'utilisateur</h2>
            <UserForm
              isEdit={true}
              formUser={formUser}
              setFormUser={setFormUser}
              formError={formError}
              formLoading={formLoading}
              onSubmit={handleEditUserSubmit}
              onCancel={() => setShowEditModal(false)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SettingsPage;
