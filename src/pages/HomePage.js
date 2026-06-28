import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

// Counting effect component
const CountingNumber = ({ target, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && count < target) {
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        setCount((prevCount) => {
          const nextCount = prevCount + increment;
          return nextCount >= target ? target : nextCount;
        });
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isVisible, count, target, duration]);

  return (
    <span ref={ref}>
      {Math.floor(count)}{suffix}
    </span>
  );
};

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

const HomePage = () => {
  const navigate = useNavigate();
  const backgroundImage = useBackgroundSlideshow();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section 
        id="hero"
        className="relative h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center transition-all duration-1000"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex flex-col items-center mb-6">
              <img
                src="/assets/ddm3.png"
                alt="Kabukye Secondary School Badge"
                className="w-32 h-32 shadow-2xl mb-4"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-serif mb-4">KABUKYE SECONDARY SCHOOL</h1>
            <p className="text-xl md:text-2xl mb-6 font-serif">KAMULI, UGANDA</p>
            <p className="text-2xl md:text-3xl italic text-yellow-400 mb-8 font-serif">"Holistic Education & Hard Work"</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => scrollToSection('about')}
              className="bg-school-yellow hover:bg-opacity-90 text-white font-semibold py-3 px-8 rounded-full transition-colors"
            >
              Discover Our Story
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/contact')}
              className="border-2 border-white text-white font-semibold py-3 px-8 rounded-full hover:bg-white hover:text-gray-900 transition-all"
            >
              Get In Touch
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/contact')}
              className="bg-school-green border-2 border-school-yellow text-white font-semibold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all"
            >
              Apply Here
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: "🎓", number: 20, suffix: "+", text: "Years of Excellence" },
              { icon: "👥", number: 500, suffix: "+", text: "Students Enrolled" },
              { icon: "📚", number: 30, suffix: "+", text: "Qualified Teachers" },
              { icon: "🏆", number: 85, suffix: "%", text: "Exam Pass Rate" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8 text-center"
              >
                <div className="text-4xl mb-4 text-school-green">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-serif">
                  <CountingNumber target={stat.number} duration={2000} suffix={stat.suffix} />
                </div>
                <p className="text-gray-800 font-semibold">{stat.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Headteacher Section */}
      <section id="about" className="bg-[#fdfdfb] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-gray-900">
                Where Every Student's Potential is <span className="text-school-green">Unleashed</span>
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Kabukye Secondary School, nestled in the heart of Kamuli, has been a beacon of academic excellence and moral formation for over two decades. Under the visionary leadership of our Headteacher, <span className="font-semibold">Mr. Isabirye Saleh</span>, we are committed to shaping responsible, knowledgeable, and skilled citizens ready to serve their communities and nation.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our dedicated teaching staff works tirelessly to ensure that every learner receives quality education in a nurturing, disciplined, and inclusive environment. At Kabukye, we believe that hard work, integrity, and determination are the keys to a brighter future.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/about')}
                className="mt-6 bg-school-green hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-full transition-colors"
              >
                Learn More About Us
              </motion.button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <img 
                src="/assets/media1.jpeg" 
                alt="Headteacher and Students" 
                className="rounded-2xl shadow-lg w-full max-w-md object-cover"
                style={{ maxHeight: '540px' }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Life at Kabukye Section */}
      <section className="bg-[#fdfdfb] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-gray-900">Life at Kabukye</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our school is more than just classrooms — it's a vibrant community where students grow academically, socially, and morally.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="overflow-hidden rounded-2xl shadow-lg"
            >
              <img 
                src="/assets/media2.jpeg" 
                alt="Students in classroom" 
                className="w-full h-64 object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="overflow-hidden rounded-2xl shadow-lg"
            >
              <img 
                src="/assets/media3.jpeg" 
                alt="Students activities" 
                className="w-full h-64 object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-school-green rounded-2xl shadow-lg p-8 flex flex-col justify-center text-center"
            >
              <h3 className="text-white text-2xl font-bold font-serif mb-4">Join Our Community</h3>
              <p className="text-gray-300 mb-6">
                Admissions are open! Give your child the gift of quality education at Kabukye Secondary School.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/contact')}
                className="bg-school-yellow hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-full transition-colors"
              >
                Contact Us Today
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
