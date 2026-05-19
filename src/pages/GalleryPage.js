import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const useBackgroundSlideshow = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
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

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return `/assets/${allImages[currentIndex]}`;
};

const GalleryPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const backgroundImage = useBackgroundSlideshow();

  const mediaItems = {
    all: [
      '/assets/ddm1.jpeg',
      '/assets/media1.jpeg',
      '/assets/media2.jpeg',
      '/assets/media3.jpeg',
      '/assets/media4.jpeg',
      '/assets/media5.jpeg',
      '/assets/media6.jpeg',
      '/assets/media7.jpeg',
      '/assets/media8.jpeg'
    ],
    campus: ['/assets/ddm1.jpeg'],
    staff: ['/assets/media4.jpeg', '/assets/media5.jpeg'],
    activities: [
      '/assets/media1.jpeg',
      '/assets/media2.jpeg',
      '/assets/media3.jpeg',
      '/assets/media6.jpeg',
      '/assets/media7.jpeg',
      '/assets/media8.jpeg'
    ]
  };

  const currentMedia = mediaItems[activeFilter] || mediaItems.all;

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
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
            <h1 className="text-5xl md:text-6xl font-bold font-serif mb-4">Gallery</h1>
            <p className="text-xl md:text-2xl">Capturing Moments That Matter</p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { id: 'all', label: 'All' },
              { id: 'campus', label: 'Campus' },
              { id: 'staff', label: 'Staff' },
              { id: 'activities', label: 'Activities' }
            ].map((filter) => (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeFilter === filter.id
                    ? 'bg-school-green text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="bg-[#fdfdfb] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {currentMedia.map((media, index) => (
              <motion.div
                key={media}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="overflow-hidden rounded-2xl shadow-lg cursor-pointer"
              >
                <img 
                  src={media} 
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-64 md:h-80 object-cover transition-transform duration-300 hover:scale-110"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-gray-900">School Video</h2>
            <p className="text-lg text-gray-600">Take a virtual tour of our beautiful campus</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden aspect-video"
          >
            <video 
              controls
              className="w-full h-full"
              poster="/assets/media3.jpeg"
            >
              <source src="/assets/school-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </div>
      </section>

      {/* Student Articles Section */}
      <section className="bg-[#fdfdfb] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-gray-900">Student Articles</h2>
            <p className="text-lg text-gray-600">Thoughts and experiences from our students</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-school-green rounded-full flex items-center justify-center text-white font-bold mr-4">
                  JS
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">John Ssenyonjo</h3>
                  <p className="text-sm text-gray-600">S6 Student</p>
                </div>
              </div>
              <h4 className="text-xl font-bold font-serif mb-3 text-school-green">My Journey at Kabukye</h4>
              <p className="text-gray-700 leading-relaxed">
                "Joining Kabukye Secondary School was the best decision I ever made. The teachers here are not just educators but mentors who guide us through every challenge. The school has helped me discover my passion for science and I'm now preparing to pursue medicine at university."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-school-green rounded-full flex items-center justify-center text-white font-bold mr-4">
                  NN
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Nakato Nansubuga</h3>
                  <p className="text-sm text-gray-600">S4 Student</p>
                </div>
              </div>
              <h4 className="text-xl font-bold font-serif mb-3 text-school-green">Beyond the Classroom</h4>
              <p className="text-gray-700 leading-relaxed">
                "What I love most about Kabukye is the emphasis on holistic development. Beyond academics, I've participated in debate club, sports, and community service. These experiences have shaped me into a confident leader ready to make a positive impact in society."
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-school-green hover:bg-opacity-90 text-white font-semibold py-3 px-8 rounded-full transition-colors"
            >
              Submit Article
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GalleryPage;
