import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { 
  LayoutDashboard,
  Upload,
  MessageSquare,
  FileText,
  Users,
  LogOut,
  Trash2,
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [contacts, setContacts] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    file: null,
    category: 'public'
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Ewebb | Admin Dashboard';
    
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }

    fetchData();
  }, [fetchData]);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const [contactsResponse, documentsResponse] = await Promise.all([
        axios.get(`${backendUrl}/api/admin/contacts`, { headers }),
        axios.get(`${backendUrl}/api/admin/documents`, { headers })
      ]);

      setContacts(contactsResponse.data.contacts);
      setDocuments(documentsResponse.data.documents);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin');
        toast.error('Session expired. Please login again.');
      } else {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) {
      toast.error('Please select a file to upload');
      return;
    }

    setUploadLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('category', uploadForm.category);

      await axios.post(`${backendUrl}/api/admin/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('File uploaded successfully');
      setUploadForm({ file: null, category: 'public' });
      document.getElementById('fileInput').value = '';
      await fetchData(); // Refresh documents list
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploadLoading(false);
    }
  };

  const updateContactStatus = async (contactId, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      
      await axios.put(`${backendUrl}/api/admin/contacts/${contactId}/status?status=${status}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      toast.success('Contact status updated');
      await fetchData(); // Refresh contacts
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('Failed to update contact status');
    }
  };

  const deleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      
      await axios.delete(`${backendUrl}/api/admin/documents/${documentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      toast.success('Document deleted successfully');
      await fetchData(); // Refresh documents
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'responded': return 'bg-green-100 text-green-800';
      case 'resolved': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'contacts', label: 'Contact Messages', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'documents', label: 'Document Management', icon: <FileText className="w-5 h-5" /> },
    { id: 'upload', label: 'Upload Documents', icon: <Upload className="w-5 h-5" /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <LayoutDashboard className="w-8 h-8 text-primary-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchData}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Messages</p>
                      <p className="text-2xl font-bold text-gray-800">{contacts.length}</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">New Messages</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {contacts.filter(c => c.status === 'new').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Documents</p>
                      <p className="text-2xl font-bold text-gray-800">{documents.length}</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                      <Upload className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Public Docs</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {documents.filter(d => d.category === 'public').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Messages Tab */}
            {activeTab === 'contacts' && (
              <div className="space-y-6">
                {contacts.length === 0 ? (
                  <div className="text-center py-20">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600">No messages yet</h3>
                    <p className="text-gray-500">Contact messages will appear here</p>
                  </div>
                ) : (
                  contacts.map((contact, index) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="card p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">{contact.name}</h3>
                            <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                              {contact.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-1">{contact.email}</p>
                          {contact.phone && <p className="text-gray-600 mb-1">{contact.phone}</p>}
                          <p className="text-sm text-gray-500">{formatDate(contact.created_at)}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateContactStatus(contact.id, 'responded')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Mark as Responded"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => updateContactStatus(contact.id, 'resolved')}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Mark as Resolved"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-800 mb-2">{contact.subject}</h4>
                        <p className="text-gray-600 whitespace-pre-wrap">{contact.message}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                {documents.length === 0 ? (
                  <div className="text-center py-20">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600">No documents uploaded</h3>
                    <p className="text-gray-500">Uploaded documents will appear here</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((document, index) => (
                      <motion.div
                        key={document.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card p-6"
                      >
                        <div className="flex items-center mb-4">
                          <FileText className="w-8 h-8 text-primary-500 mr-3" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 truncate">{document.original_name}</h3>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              document.category === 'public' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {document.category}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-500 mb-4">
                          <div className="flex items-center mb-1">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(document.uploaded_at)}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            {document.uploaded_by}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              const backendUrl = process.env.REACT_APP_BACKEND_URL;
                              window.open(`${backendUrl}/uploads/${document.category}/${document.filename}`, '_blank');
                            }}
                            className="flex-1 btn-primary flex items-center justify-center text-sm py-2"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </button>
                          <button
                            onClick={() => deleteDocument(document.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div className="max-w-2xl mx-auto">
                <div className="card p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload New Document</h2>
                  
                  <form onSubmit={handleFileUpload} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select File
                      </label>
                      <input
                        id="fileInput"
                        type="file"
                        onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={uploadForm.category}
                        onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="public">Public Document</option>
                        <option value="eulogy">Eulogy Document (7-day expiry)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={uploadLoading}
                      className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploadLoading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-5 h-5 mr-2" />
                          Upload Document
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;