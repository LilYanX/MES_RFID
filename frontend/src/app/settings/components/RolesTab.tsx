"use client";

import React, { useState, useEffect } from "react";
import axios from "@/utils/config/axiosConfig";

// Définition des types d'autorisations
interface Permission {
  manage_users: boolean;
  view_stats: boolean;
  configure_system: boolean;
  [key: string]: boolean; // Pour permettre l'accès dynamique aux propriétés
}

// Interface pour un rôle complet avec _id
interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: Permission;
  created_at: string;
  protected?: boolean;
}

// Type pour les données de formulaire
type RoleFormData = {
  _id: string;
  name: string;
  description: string;
  permissions: Permission;
  created_at: string;
  protected?: boolean;
};

const PERMISSIONS = [
  { id: "manage_users", label: "Manage users" },
  { id: "view_stats", label: "View statistics" },
  { id: "configure_system", label: "Configure system" }
] as const;

type PermissionKey = typeof PERMISSIONS[number]['id'];

const API_URL = "/api/auth/roles";

const RolesTab = () => {
  // État pour stocker les rôles avec un type plus précis
  const [roles, setRoles] = useState<Role[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const initialPermissions: Permission = {
    manage_users: false,
    view_stats: false,
    configure_system: false
  };
  
  const initialFormState: RoleFormData = {
    _id: "",
    name: "",
    description: "",
    permissions: { ...initialPermissions },
    created_at: new Date().toISOString() // Ajout d'une date par défaut
  };
  
  const [formRole, setFormRole] = useState<RoleFormData>(initialFormState);
  const [formError, setFormError] = useState<string>("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get<Role[]>('/api/roles');
        
        // S'assurer que chaque rôle a un objet permissions valide
        const rolesWithValidPermissions: Role[] = response.data.map(role => ({
          ...role,
          permissions: {
            manage_users: role.permissions?.manage_users || false,
            view_stats: role.permissions?.view_stats || false,
            configure_system: role.permissions?.configure_system || false
          },
          created_at: role.created_at || new Date().toISOString(),
          protected: role.protected || false
        }));
        
        setRoles(rolesWithValidPermissions);
      } catch (err) {
        setError('Error loading roles');
        console.error('Error fetching roles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      if (formRole._id) {
        // Mise à jour d'un rôle existant
        const response = await axios.put<Role>(`/api/roles/${formRole._id}`, formRole);
        const updatedRole: Role = {
          ...response.data,
          permissions: { 
            ...initialPermissions, 
            ...response.data.permissions 
          }
        };
        
        setRoles(prevRoles => 
          prevRoles.map(role => 
            role._id === formRole._id ? updatedRole : role
          )
        );
      } else {
        // Création d'un nouveau rôle
        const response = await axios.post<Role>('/api/roles', formRole);
        const newRole: Role = {
          ...response.data,
          permissions: { 
            ...initialPermissions, 
            ...response.data.permissions 
          }
        };
        
        setRoles(prevRoles => [...prevRoles, newRole]);
      }
      
      setFormRole(initialFormState);
      setShowAddModal(false);
      setShowEditModal(false);
    } catch (err) {
      setFormError('Error saving role');
      console.error('Error saving role:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRole._id) return;
    
    setFormError("");
    setFormLoading(true);
    
    try {
      const response = await axios.put<Role>(`/api/roles/${formRole._id}`, formRole);
      
      // Mettre à jour la liste des rôles avec le rôle mis à jour
      setRoles(prevRoles => 
        prevRoles.map(role => 
          role._id === formRole._id 
            ? { ...response.data, 
                permissions: {
                  manage_users: response.data.permissions?.manage_users || false,
                  view_stats: response.data.permissions?.view_stats || false,
                  configure_system: response.data.permissions?.configure_system || false
                }
              } 
            : role
        )
      );
      
      // Réinitialiser le formulaire et fermer la modale
      setFormRole({
        _id: "",
        name: "",
        description: "",
        permissions: {
          manage_users: false,
          view_stats: false,
          configure_system: false
        },
        created_at: new Date().toISOString(),
        protected: false
      });
      
      setShowEditModal(false);
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour du rôle:", err);
      setFormError(err.response?.data?.message || "Error updating role.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!window.confirm('Are you sure you want to delete this role? This action is irreversible.')) {
      return;
    }

    try {
      setFormLoading(true);
      await axios.delete(`/api/roles/${roleId}`);
      setRoles(prevRoles => prevRoles.filter(role => role._id !== roleId));
    } catch (err) {
      console.error('Error deleting role:', err);
      alert('Error deleting role');
    } finally {
      setFormLoading(false);
    }
  };

  const handlePermissionChange = (permission: keyof Permission, checked: boolean) => {
    setFormRole(prev => {
      const newPermissions = {
        ...prev.permissions,
        [permission]: checked
      };
      return {
        ...prev,
        permissions: newPermissions
      };
    });
  };

  const formatPermissions = (permissions: Permission) => {
    return Object.entries(permissions)
      .filter(([_, value]) => value)
      .map(([key]) => {
        const permission = PERMISSIONS.find(p => p.id === key);
        return permission ? permission.label : key;
      })
      .filter(Boolean) // Filtrer les valeurs undefined
      .join(", ") || "No permissions";
  };

  const handleAddNew = () => {
    setFormRole({
      _id: "",
      name: "",
      description: "",
      permissions: { 
        manage_users: false, 
        view_stats: false, 
        configure_system: false 
      },
      created_at: new Date().toISOString(),
      protected: false
    });
    setShowAddModal(true);
  };

  const handleEditClick = (role: Role) => {
    setFormRole({
      _id: role._id,
      name: role.name,
      description: role.description,
      created_at: role.created_at || new Date().toISOString(),
      permissions: {
        manage_users: role.permissions?.manage_users || false,
        view_stats: role.permissions?.view_stats || false,
        configure_system: role.permissions?.configure_system || false
      },
      protected: role.protected || false
    });
    setShowEditModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-muted-foreground">Loading roles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erreur</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 rounded-md bg-red-100 px-2 py-1 text-sm font-medium text-red-800 hover:bg-red-200"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Role Management</h2>
          <p className="text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Add Role
        </button>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Nom
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Description
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Permissions
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {roles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-center text-sm text-gray-500">
                    No roles found
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr key={role._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                      {role.name}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {role.description || 'No description'}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {formatPermissions(role.permissions)}
                      </div>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditClick(role)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Modifier"
                        >
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRole(role._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                          disabled={role.protected}
                        >
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="mb-6 text-xl font-semibold">Ajouter un nouveau rôle</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Nom du rôle
                </label>
                <input
                  type="text"
                  value={formRole.name}
                  onChange={(e) => setFormRole({...formRole, name: e.target.value})}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formRole.description}
                  onChange={(e) => setFormRole({...formRole, description: e.target.value})}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  rows={3}
                />
              </div>
              
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-medium text-gray-700">Permissions</h3>
                <div className="space-y-2">
                  {PERMISSIONS.map((permission) => (
                    <div key={permission.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`permission-${permission.id}`}
                        checked={formRole.permissions[permission.id as keyof Permission] || false}
                        onChange={(e) => handlePermissionChange(permission.id as keyof Permission, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`permission-${permission.id}`} className="ml-2 block text-sm text-gray-900">
                        {permission.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {formError && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {formError}
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {formLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="mb-6 text-xl font-semibold">Modifier le rôle</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Nom du rôle
                </label>
                <input
                  type="text"
                  value={formRole.name}
                  onChange={(e) => setFormRole({...formRole, name: e.target.value})}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formRole.description}
                  onChange={(e) => setFormRole({...formRole, description: e.target.value})}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  rows={3}
                />
              </div>
              
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-medium text-gray-700">Permissions</h3>
                <div className="space-y-2">
                  {PERMISSIONS.map((permission) => (
                    <div key={permission.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`edit-permission-${permission.id}`}
                        checked={formRole.permissions[permission.id as keyof Permission] || false}
                        onChange={(e) => handlePermissionChange(permission.id as keyof Permission, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`edit-permission-${permission.id}`} className="ml-2 block text-sm text-gray-700">
                        {permission.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {formError && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {formError}
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {formLoading ? 'Mise à jour...' : 'Mettre à jour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesTab;
