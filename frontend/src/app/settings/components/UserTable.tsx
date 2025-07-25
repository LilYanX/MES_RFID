import React from "react";

interface User {
  _id?: string;
  uuid: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_admin: boolean;
}

export default function UserTable({ users, onEdit, onDelete }: {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <table className="min-w-full text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">Username</th>
            <th className="py-2 px-4">Nom</th>
            <th className="py-2 px-4">First Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Role</th>
            <th className="py-2 px-4">Admin</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id || user.uuid} className="border-t hover:bg-gray-50">
              <td className="py-2 px-4">{user.username}</td>
              <td className="py-2 px-4">{user.last_name}</td>
              <td className="py-2 px-4">{user.first_name}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">{user.role}</td>
              <td className="py-2 px-4">{user.is_admin ? "Yes" : "No"}</td>
              <td className="py-2 px-4 flex gap-2 justify-center">
                <button
                  onClick={() => onEdit(user)}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(user._id || user.uuid)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                  title="Delete"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 