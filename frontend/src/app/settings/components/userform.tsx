import React from "react";

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

interface UserFormProps {
  isEdit?: boolean;
  formUser: User;
  setFormUser: React.Dispatch<React.SetStateAction<User>>;
  formError: string;
  formLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  isEdit = false,
  formUser,
  setFormUser,
  formError,
  formLoading,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-gray-50 border border-gray-200 rounded-xl p-6">
      <div className="space-y-4">
        <input
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Username"
          value={formUser.username}
          onChange={e => setFormUser(prev => ({ ...prev, username: e.target.value }))}
        />
        <input
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="First Name"
          value={formUser.first_name}
          onChange={e => setFormUser(prev => ({ ...prev, first_name: e.target.value }))}
        />
        <input
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Last Name"
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
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formUser.is_admin}
            onChange={e => setFormUser(prev => ({ ...prev, is_admin: e.target.checked }))}
          />
          Admin?
        </label>
        <input
          className="border rounded-lg px-3 py-2 w-full"
          placeholder="Password (leave empty to keep unchanged)"
          type="password"
          value={formUser.password_hash}
          onChange={e => setFormUser(prev => ({ ...prev, password_hash: e.target.value }))}
        />
      </div>
      {formError && <div className="text-red-500 text-sm">{formError}</div>}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          disabled={formLoading}
        >
          {isEdit ? "Save" : "Add"}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
