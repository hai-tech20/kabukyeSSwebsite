import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabase';
import StudentApplications from '../components/StudentApplications';

const AdminDashboard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    media_type: 'image',
    media_file: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showApplications, setShowApplications] = useState(false);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
        fetchPosts();
      }
    };
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
        fetchPosts();
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('POSTS')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        setMessage('Error fetching posts: ' + error.message);
      } else {
        setPosts(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage('Error fetching posts: ' + err.message);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        setMessage('Error fetching applications: ' + error.message);
      } else {
        setApplications(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage('Error fetching applications: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage('Login failed. Please check your credentials.');
      } else {
        setUser(data.user);
        setIsAuthenticated(true);
        setMessage('Login successful!');
        fetchPosts();
      }
    } catch (err) {
      setMessage('Login error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    setPosts([]);
    setApplications([]);
    setMessage('Logged out successfully!');
  };

  const toggleApplicationsView = () => {
    setShowApplications(!showApplications);
    if (!showApplications) {
      fetchApplications();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, media_file: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Get current user using Supabase v2 syntax
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Auth error:', userError);
        setMessage('Please log in to add posts.');
        return;
      }

      console.log('Current user:', user); // Debug log
      console.log('User ID:', user.id); // Debug log

      let media_url = '';

      // Upload media if it's an image or video
      if (formData.media_file && (formData.media_type === 'image' || formData.media_type === 'video')) {
        const fileExt = formData.media_file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media')
          .upload(fileName, formData.media_file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(fileName);

        media_url = publicUrl;
      }

      // Create post object with explicit user_id
      const postData = {
        title: formData.title,
        description: formData.description,
        media_type: formData.media_type,
        media_url: media_url,
        user_id: user.id
      };

      console.log('Post data to insert:', postData); // Debug log

      // Insert post into database - RLS allows any authenticated user
      const { data, error } = await supabase
        .from('POSTS')
        .insert([postData])
        .select();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      console.log('Insert success:', data); // Debug log

      setMessage('Post created successfully!');
      setFormData({ title: '', description: '', media_type: 'image', media_file: null });
      fetchPosts();
      setTimeout(() => setMessage(''), 3000);

    } catch (err) {
      console.error('Error creating post:', err);
      setMessage('Error creating post: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId, mediaUrl) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Delete media from storage if it exists
      if (mediaUrl && (mediaUrl.includes('image') || mediaUrl.includes('video'))) {
        const fileName = mediaUrl.split('/').pop();
        await supabase.storage
          .from('media')
          .remove([fileName]);
      }

      // Delete post from database - RLS allows any authenticated user
      const { error } = await supabase
        .from('POSTS')
        .delete()
        .eq('id', postId);

      if (error) {
        throw error;
      }

      setMessage('Post deleted successfully!');
      fetchPosts();
      setTimeout(() => setMessage(''), 3000);

    } catch (err) {
      console.error('Error deleting post:', err);
      setMessage('Error deleting post: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderMedia = (post) => {
    if (post.media_type === 'image') {
      return <img src={post.media_url} alt={post.title} className="w-20 h-20 object-cover rounded" />;
    } else if (post.media_type === 'video') {
      return <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-xs">📹 Video</div>;
    } else {
      return <div className="w-20 h-20 bg-gradient-to-r from-school-green to-school-brown rounded flex items-center justify-center text-white text-xs">📄</div>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
          >
            <h2 className="text-3xl font-bold font-serif mb-6 text-center text-school-green">Admin Login</h2>
            
            {message && (
              <div className={`p-3 rounded-lg mb-4 text-center ${
                message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent"
                  placeholder="••••••"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full bg-school-green hover:bg-opacity-90 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold font-serif text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.email}</p>
          </motion.div>
          
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleApplicationsView}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {showApplications ? 'Manage Posts' : 'View Applications'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </motion.button>
          </div>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`p-4 rounded-lg mb-6 ${
              message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </motion.div>
        )}

        {showApplications ? (
          <StudentApplications 
            applications={applications}
            loading={loading}
            fetchApplications={fetchApplications}
            setMessage={setMessage}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add New Post Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold font-serif mb-6 text-gray-900">Add New Post</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent"
                    placeholder="Enter post title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent"
                    placeholder="Enter post description"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
                  <select
                    value={formData.media_type}
                    onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="article">Article</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>

                {(formData.media_type === 'image' || formData.media_type === 'video') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Media</label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept={formData.media_type === 'image' ? 'image/*' : 'video/*'}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent"
                    />
                  </div>
                )}

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full bg-school-green hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Post'}
                </motion.button>
              </form>
            </motion.div>

            {/* Existing Posts */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold font-serif mb-6 text-gray-900">Existing Posts</h2>
              
              {posts.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No posts found.</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {posts.map((post) => (
                    <div key={post.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {renderMedia(post)}
                        <div>
                          <h4 className="font-semibold text-gray-900">{post.title}</h4>
                          <p className="text-sm text-gray-600">{post.media_type}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(post.id, post.media_url)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Delete
                      </motion.button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
