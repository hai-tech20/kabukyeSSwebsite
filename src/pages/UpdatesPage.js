import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { supabase } from '../supabase';

const useBackgroundSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const allImages = [
    'ddm1.jpeg',
    'ddm2.jpeg',
    'one.jpeg',
    'two.jpeg',
    'three.jpeg',
    'four.jpeg',
    'five.jpeg',
    'six.jpeg',
    'seven.jpeg',
    'eight.jpeg',
    'nine.jpeg',
    'ten.jpeg',
    'eleven.jpeg',
    'twelve.jpeg',
    'thirteen.jpeg',
    'fourteen.jpeg',
    'fifteen.jpeg',
    'sixteen.jpeg',
    'seventeen.jpeg',
    'eighteen.jpeg',
    'ninteen.jpeg',
    'twenty.jpeg',
    'media1.jpeg',
    'media2.jpeg',
    'media3.jpeg',
    'media6.jpeg',
    'media7.jpeg',
    'media8.jpeg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return `/assets/${allImages[currentIndex]}`;
};

const UpdatesPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredPost, setHoveredPost] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const videoRefs = useRef({});
  const backgroundImage = useBackgroundSlideshow();

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    // Set up intersection observer for video autoplay
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay was prevented, that's okay
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.7 }
    );

    // Observe all video elements
    Object.values(videoRefs.current).forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [posts]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('POSTS')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  const getMediaTypeIcon = (mediaType) => {
    switch (mediaType) {
      case 'image':
        return '📷';
      case 'video':
        return '🎬';
      case 'article':
        return '📄';
      case 'announcement':
        return '📢';
      default:
        return '📎';
    }
  };

  const getMediaTypeColor = (mediaType) => {
    switch (mediaType) {
      case 'image':
        return 'bg-blue-500';
      case 'video':
        return 'bg-red-500';
      case 'article':
        return 'bg-green-500';
      case 'announcement':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const downloadMedia = (post) => {
    if (post.media_url && (post.media_type === 'image' || post.media_type === 'video')) {
      const link = document.createElement('a');
      link.href = post.media_url;
      link.download = `${post.title}.${post.media_type === 'image' ? 'jpg' : 'mp4'}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const toggleVideoPlay = (postId) => {
    const video = videoRefs.current[postId];
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
  };

  const renderMedia = (post) => {
    const youtubeUrl = getYouTubeEmbedUrl(post.media_url);

    if (youtubeUrl) {
      return (
        <div className="relative group aspect-video">
          <iframe
            src={youtubeUrl}
            className="w-full h-80 rounded-t-2xl bg-gray-100"
            title={post.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    }

    if (post.media_type === 'image') {
      return (
        <div className="relative group">
          <img
            src={post.media_url}
            alt={post.title}
            className="w-full h-80 object-contain rounded-t-2xl bg-gray-100 cursor-pointer"
            onClick={() => setSelectedPost(post)}
          />
        </div>
      );
    } else if (post.media_type === 'video') {
      return (
        <div className="relative group">
          <video
            ref={(el) => videoRefs.current[post.id] = el}
            className="w-full h-80 object-contain rounded-t-2xl bg-gray-100 cursor-pointer"
            muted
            loop
            playsInline
            onClick={() => setSelectedPost(post)}
          >
            <source src={post.media_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black bg-opacity-30 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
      );
    } else {
      // Article or Announcement
      return (
        <div 
          className={`relative h-32 rounded-t-2xl flex items-center justify-center ${
            post.media_type === 'article' 
              ? 'bg-gradient-to-br from-green-400 to-green-600' 
              : 'bg-gradient-to-br from-yellow-400 to-orange-500'
          }`}
        >
          <div className="text-white text-center p-4">
            <div className="text-3xl mb-2">
              {post.media_type === 'article' ? '📄' : '📢'}
            </div>
            <h4 className="text-sm font-bold font-serif">{post.title}</h4>
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-school-green"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section - Bigger like About Page */}
      <section 
        className="relative h-96 bg-cover bg-center bg-no-repeat flex items-center justify-center transition-all duration-1000"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-school-green bg-opacity-70"></div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold font-serif mb-4">School Updates</h1>
            <p className="text-xl md:text-2xl">Latest News & Announcements</p>
          </motion.div>
        </div>
      </section>

      {/* Instagram-style Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">📸</div>
              <p className="text-xl text-gray-600">No updates available at the moment.</p>
              <p className="text-gray-500 mt-2">Check back soon for the latest news!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                  onMouseEnter={() => setHoveredPost(post.id)}
                  onMouseLeave={() => setHoveredPost(null)}
                >
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105">
                    {/* Media */}
                    {renderMedia(post)}
                    
                    {/* Content */}
                    <div className="p-4">
                      {/* Type Badge */}
                      <div className="flex items-start justify-between mb-3">
                        <div className={`px-3 py-1 rounded-full text-xs text-white font-medium ${getMediaTypeColor(post.media_type)}`}>
                          {getMediaTypeIcon(post.media_type)} {post.media_type}
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-lg font-bold font-serif text-school-green mb-2">
                        {post.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                        {post.description}
                      </p>
                      
                      {/* Date */}
                      <div className="text-xs text-gray-500">
                        {formatDate(post.created_at)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 text-gray-800 p-2 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Media Content - Centered */}
              {(() => {
                const youtubeUrl = getYouTubeEmbedUrl(selectedPost.media_url);
                if (youtubeUrl) {
                  return (
                    <div className="flex flex-col items-center w-full">
                      <div className="w-full aspect-video max-h-[70vh] mb-4">
                        <iframe
                          src={youtubeUrl}
                          className="w-full h-full rounded-lg shadow-2xl"
                          title={selectedPost.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="text-center text-white max-w-2xl">
                        <h3 className="text-xl font-bold font-serif mb-2">{selectedPost.title}</h3>
                        <p className="text-sm opacity-90">{selectedPost.description}</p>
                      </div>
                    </div>
                  );
                }

                if (selectedPost.media_type === 'image') {
                  return (
                    <div className="flex flex-col items-center">
                      <img
                        src={selectedPost.media_url}
                        alt={selectedPost.title}
                        className="max-w-full max-h-[70vh] object-contain rounded-lg mb-4"
                      />
                      <div className="text-center text-white max-w-2xl">
                        <h3 className="text-xl font-bold font-serif mb-2">{selectedPost.title}</h3>
                        <p className="text-sm opacity-90">{selectedPost.description}</p>
                      </div>
                    </div>
                  );
                } else if (selectedPost.media_type === 'video') {
                  return (
                    <div className="flex flex-col items-center">
                      <video
                        controls
                        className="max-w-full max-h-[70vh] object-contain rounded-lg mb-4"
                      >
                        <source src={selectedPost.media_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <div className="text-center text-white max-w-2xl">
                        <h3 className="text-xl font-bold font-serif mb-2">{selectedPost.title}</h3>
                        <p className="text-sm opacity-90">{selectedPost.description}</p>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className={`w-full h-full max-w-[90vw] max-h-[90vh] flex items-center justify-center rounded-lg ${
                      selectedPost.media_type === 'article' 
                        ? 'bg-gradient-to-br from-green-400 to-green-600' 
                        : 'bg-gradient-to-br from-yellow-400 to-orange-500'
                    }`}>
                      <div className="text-white text-center p-8">
                        <div className="text-4xl mb-3">
                          {selectedPost.media_type === 'article' ? '📄' : '📢'}
                        </div>
                        <h3 className="text-xl font-bold font-serif mb-2">{selectedPost.title}</h3>
                        <p className="text-sm opacity-90">{selectedPost.description}</p>
                      </div>
                    </div>
                  );
                }
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default UpdatesPage;
