import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import Header from '../../components/Header';
import { 
  useActiveAnnouncements, 
  useAllAnnouncements,
  useCreateAnnouncement, 
  useUpdateAnnouncement, 
  useDeactivateAnnouncement, 
  useDeleteAnnouncement 
} from '../../Api';

const Announcements = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [viewMode, setViewMode] = useState('active'); // 'active' or 'all'
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'NORMAL'
  });

  const { data: activeAnnouncements = [], isLoading: loadingActive } = useActiveAnnouncements();
  const { data: allAnnouncements = [], isLoading: loadingAll } = useAllAnnouncements();
  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();
  const deactivateMutation = useDeactivateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();

  const announcements = viewMode === 'active' ? activeAnnouncements : allAnnouncements;
  const isLoading = viewMode === 'active' ? loadingActive : loadingAll;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingAnnouncement) {
      updateMutation.mutate(
        { id: editingAnnouncement.id, data: formData },
        {
          onSuccess: () => {
            setEditingAnnouncement(null);
            setFormData({ title: '', content: '', priority: 'NORMAL' });
            setShowCreateForm(false);
          }
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setFormData({ title: '', content: '', priority: 'NORMAL' });
          setShowCreateForm(false);
        }
      });
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority
    });
    setShowCreateForm(true);
  };

  const handleDeactivate = (id) => {
    if (window.confirm('Are you sure you want to deactivate this announcement?')) {
      deactivateMutation.mutate(id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'NORMAL': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'LOW': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole="HR" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
            <p className="text-gray-600 mt-2">Create and manage company announcements</p>
          </div>
          <button
            onClick={() => {
              setShowCreateForm(true);
              setEditingAnnouncement(null);
              setFormData({ title: '', content: '', priority: 'NORMAL' });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus size={20} />
            <span>New Announcement</span>
          </button>
        </div>

        {/* View Toggle */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setViewMode('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'active'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Active Announcements ({activeAnnouncements.length})
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              All Announcements ({allAnnouncements.length})
            </button>
          </div>
        </div>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 transition-colors"
                >
                  {createMutation.isPending || updateMutation.isPending 
                    ? 'Saving...' 
                    : editingAnnouncement ? 'Update' : 'Create'
                  }
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingAnnouncement(null);
                    setFormData({ title: '', content: '', priority: 'NORMAL' });
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Announcements List */}
        <div className="bg-white rounded-lg shadow-md">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading announcements...</div>
          ) : announcements.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No {viewMode === 'active' ? 'active' : ''} announcements found
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {announcement.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(announcement.priority)}`}>
                          {announcement.priority}
                        </span>
                        {!announcement.active && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3">{announcement.content}</p>
                      <div className="text-sm text-gray-500">
                        Created by {announcement.createdBy?.username} on{' '}
                        {new Date(announcement.createdAt).toLocaleDateString()}
                        {announcement.updatedAt !== announcement.createdAt && (
                          <span> • Updated {new Date(announcement.updatedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      {announcement.active ? (
                        <button
                          onClick={() => handleDeactivate(announcement.id)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Deactivate"
                        >
                          <EyeOff size={16} />
                        </button>
                      ) : (
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Active"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
