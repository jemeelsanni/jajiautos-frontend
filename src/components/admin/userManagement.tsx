import { useState, useEffect } from 'react';
import { Card } from '../common/card';
import { Button } from '../common/button';
import { Modal } from '../common/modal';
import Badge from '../common/badge';
import { ComponentLoading } from '../common/spinner';
import {
    Users,
    Plus,
    Edit,
    Trash2,
    Search,
    Eye,
    EyeOff,
    UserPlus,
    Shield,
    BarChart3,
    Package
} from 'lucide-react';


type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning';

interface User {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: 'SUPER_ADMIN' | 'SALES_PERSONNEL' | 'INVENTORY_MANAGER';
    isActive: boolean;
    createdAt: string;
    _count: {
        sales: number;
        cars: number;
    };
}

interface CreateUserData {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'SUPER_ADMIN' | 'SALES_PERSONNEL' | 'INVENTORY_MANAGER';
}

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [createUserData, setCreateUserData] = useState<CreateUserData>({
        email: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'SALES_PERSONNEL'
    });

    const roles = [
        { value: 'SUPER_ADMIN', label: 'Super Admin', color: 'danger', icon: Shield },
        { value: 'SALES_PERSONNEL', label: 'Sales Personnel', color: 'primary', icon: BarChart3 },
        { value: 'INVENTORY_MANAGER', label: 'Inventory Manager', color: 'success', icon: Package }
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setUsers(data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = !roleFilter || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    const handleCreateUser = async () => {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(createUserData)
            });

            if (response.ok) {
                await fetchUsers();
                setShowCreateModal(false);
                setCreateUserData({
                    email: '',
                    username: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                    role: 'SALES_PERSONNEL'
                });
                alert('User created successfully!');
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Failed to create user');
        }
    };

    const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
        try {
            const endpoint = isActive ? 'deactivate' : 'activate';
            const response = await fetch(`/api/users/${userId}/${endpoint}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                await fetchUsers();
                alert(`User ${isActive ? 'deactivated' : 'activated'} successfully!`);
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                await fetchUsers();
                alert('User deleted successfully!');
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const getRoleInfo = (role: string) => {
        return roles.find(r => r.value === role) || roles[1];
    };

    if (loading) {
        return (
            <div className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ComponentLoading text="Loading users..." />
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600 mt-2">Manage system users and their permissions</p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)} icon={Plus} size="lg">
                        Add New User
                    </Button>
                </div>

                {/* Filters */}
                <Card className="p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="">All Roles</option>
                            {roles.map(role => (
                                <option key={role.value} value={role.value}>{role.label}</option>
                            ))}
                        </select>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users size={16} />
                            {filteredUsers.length} users found
                        </div>
                    </div>
                </Card>

                {/* Users Table */}
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.map((user) => {
                                    const roleInfo = getRoleInfo(user.role);
                                    return (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.firstName} {user.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                    <div className="text-xs text-gray-400">@{user.username}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={roleInfo.color as BadgeVariant}>{roleInfo.label}</Badge>
                                                <roleInfo.icon size={16} />
                                                <Badge variant={roleInfo.color as BadgeVariant}>{roleInfo.label}</Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm">
                                                    <div className="text-gray-900">{user._count.sales} sales</div>
                                                    <div className="text-gray-500">{user._count.cars} cars added</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={user.isActive ? 'success' : 'danger'}>
                                                    {user.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                                                        className={`p-2 rounded-lg transition-colors ${user.isActive
                                                            ? 'text-red-600 hover:bg-red-50'
                                                            : 'text-green-600 hover:bg-green-50'
                                                            }`}
                                                        title={user.isActive ? 'Deactivate user' : 'Activate user'}
                                                    >
                                                        {user.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowEditModal(true);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit user"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete user"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-16">
                            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
                            <p className="text-gray-600">Try adjusting your search criteria</p>
                        </div>
                    )}
                </Card>

                {/* Create User Modal */}
                <Modal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    title="Create New User"
                    size="lg"
                >
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={createUserData.firstName}
                                onChange={(e) => setCreateUserData({ ...createUserData, firstName: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={createUserData.lastName}
                                onChange={(e) => setCreateUserData({ ...createUserData, lastName: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={createUserData.email}
                                onChange={(e) => setCreateUserData({ ...createUserData, email: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Username"
                                value={createUserData.username}
                                onChange={(e) => setCreateUserData({ ...createUserData, username: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <input
                            type="password"
                            placeholder="Password (minimum 6 characters)"
                            value={createUserData.password}
                            onChange={(e) => setCreateUserData({ ...createUserData, password: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            required
                            minLength={6}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                            <select
                                value={createUserData.role}
                                onChange={(e) => setCreateUserData({ ...createUserData, role: e.target.value as 'SUPER_ADMIN' | 'SALES_PERSONNEL' | 'INVENTORY_MANAGER' })}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                                {roles.map(role => (
                                    <option key={role.value} value={role.value}>{role.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                variant="secondary"
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateUser}
                                disabled={
                                    !createUserData.firstName ||
                                    !createUserData.lastName ||
                                    !createUserData.email ||
                                    !createUserData.username ||
                                    !createUserData.password ||
                                    createUserData.password.length < 6
                                }
                                className="flex-1"
                                icon={UserPlus}
                            >
                                Create User
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* Edit User Modal */}
                {
                    selectedUser && (
                        <Modal
                            isOpen={showEditModal}
                            onClose={() => {
                                setShowEditModal(false);
                                setSelectedUser(null);
                            }}
                            title="Edit User"
                            size="lg"
                        >
                            <div className="space-y-6">
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 mb-2">User Information</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Name:</span>
                                            <span className="ml-2 font-medium">{selectedUser.firstName} {selectedUser.lastName}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Email:</span>
                                            <span className="ml-2 font-medium">{selectedUser.email}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Username:</span>
                                            <span className="ml-2 font-medium">@{selectedUser.username}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Role:</span>
                                            <span className="ml-2">
                                                <Badge variant={getRoleInfo(selectedUser.role).color as BadgeVariant}>
                                                    {getRoleInfo(selectedUser.role).label}
                                                </Badge>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-xl">
                                    <h3 className="font-semibold text-gray-900 mb-2">Performance Stats</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">{selectedUser._count.sales}</div>
                                            <div className="text-sm text-gray-600">Total Sales</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">{selectedUser._count.cars}</div>
                                            <div className="text-sm text-gray-600">Cars Added</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setSelectedUser(null);
                                        }}
                                        className="flex-1"
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        variant={selectedUser.isActive ? 'danger' : 'success'}
                                        onClick={() => {
                                            handleToggleUserStatus(selectedUser.id, selectedUser.isActive);
                                            setShowEditModal(false);
                                            setSelectedUser(null);
                                        }}
                                        className="flex-1"
                                        icon={selectedUser.isActive ? EyeOff : Eye}
                                    >
                                        {selectedUser.isActive ? 'Deactivate' : 'Activate'}
                                    </Button>
                                </div>
                            </div>
                        </Modal>
                    )
                }
            </div >
        </div >
    );
}