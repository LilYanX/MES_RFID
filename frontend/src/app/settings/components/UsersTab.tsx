"use client";

import React, { useEffect, useState } from "react";
import axios from "@/utils/config/axiosConfig";
import ReactDOM from "react-dom";
import UserForm from "./userform";

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

// Modal component
const Modal = ({ onClose, children }: { onClose: () => void; children: React.ReactNode }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-xl relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
          onClick={onClose}
          type="button"
          aria-label="Close"
        >×</button>
        {children}
      </div>
    </div>,
    typeof window !== "undefined" ? document.body : (null as any)
  );
};

const UsersTab = () => {
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
      const usersWithUuid = res.data.map((user: any) => ({
        ...user,
        uuid: String(user.uuid || user._id || ""),
      }));
      setUsers(usersWithUuid);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      await axios.post("/auth/users/register", formUser);
      setShowAddModal(false);
      fetchUsers();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Error adding user.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      await axios.put(`/auth/users/update/${formUser.uuid}`, formUser);
      setShowEditModal(false);
      fetchUsers();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Error updating user.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/auth/users/delete/${id}`);
      fetchUsers();
    } catch (err) {
      alert("Error deleting user.");
    }
  };

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
    <div>
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      
      <div className="mb-6 flex gap-4 items-center">
        <input
          type="text"
          className="border rounded-lg px-3 py-2 flex-1"
          placeholder="Search by username, name, or email..."
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
          <span>+</span>
          Add User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user._id || user.uuid} className="hover:bg-gray-50">
                <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">{user.first_name} {user.last_name}</td>
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.is_admin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.is_admin ? "Yes" : "No"}
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setFormUser({ ...user, password_hash: "" });
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id || user.uuid)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found matching your search criteria.
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <h2 className="text-lg font-semibold mb-4">Add New User</h2>
          <UserForm
            isEdit={false}
            formUser={formUser}
            setFormUser={setFormUser}
            formError={formError}
            formLoading={formLoading}
            onSubmit={handleAddUserSubmit}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)}>
          <h2 className="text-lg font-semibold mb-4">Edit User</h2>
          <UserForm
            isEdit={true}
            formUser={formUser}
            setFormUser={setFormUser}
            formError={formError}
            formLoading={formLoading}
            onSubmit={handleEditUserSubmit}
            onCancel={() => setShowEditModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default UsersTab;
