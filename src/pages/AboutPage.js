import React from 'react';
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

const AboutPage = () => {
  const backgroundImage = useBackgroundSlideshow();
  
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
            <h1 className="text-5xl md:text-6xl font-bold font-serif mb-4">About Us</h1>
            <p className="text-xl md:text-2xl">Our Story, Our People, Our Mission</p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-[#fdfdfb] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-3xl font-bold font-serif mb-4 text-school-green">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                To provide a holistic education, discipline and hard work. We strive to create a learning environment where every student discovers their potential and develops into responsible citizens ready to serve their communities and nation with distinction.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-3xl font-bold font-serif mb-4 text-school-brown">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                To be the leading centre of academic, spiritual and social excellence in Uganda, producing well-rounded graduates who are intellectually competent, morally upright, and socially responsible. We envision our students becoming future leaders who will positively transform their communities and contribute to national development.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Motto Section */}
      <section className="bg-[#f8f9fa] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 inline-block">
              <h2 className="text-3xl font-bold font-serif mb-4 text-school-green">Our Motto</h2>
              <p className="text-xl font-semibold text-gray-800 italic">
                "Holistic education discipline and hard work"
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-serif italic mb-6 text-gray-900">Our Leadership & Staff</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated team that makes Kabukye Secondary School a beacon of excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src="/assets/media4.jpeg" 
                alt="Teaching Staff" 
                className="rounded-2xl shadow-lg w-full object-cover"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-3xl font-bold font-serif mb-4 text-gray-900">A Dedicated Team of Educators</h3>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Led by our esteemed Headteacher, Mr. Isabirye Saleh, our teaching staff comprises highly qualified and experienced educators committed to nurturing every student's potential. Each teacher brings expertise in their subject areas and a passion for holistic education.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our staff works collaboratively to create engaging learning experiences that combine academic rigor with practical skills development. We maintain small class sizes to ensure personalized attention and foster meaningful teacher-student relationships that support both academic and personal growth.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="overflow-hidden rounded-2xl shadow-lg"
            >
              <img 
                src="/assets/media5.jpeg" 
                alt="Staff Members" 
                className="w-full h-80 object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-school-green rounded-2xl shadow-lg p-8 flex flex-col justify-center"
            >
              <h3 className="text-white text-2xl font-bold font-serif mb-4">Join Our Team</h3>
              <p className="text-gray-300 mb-6">
                We are always looking for passionate educators who share our commitment to excellence. If you are interested in joining our team, we would love to hear from you.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-school-yellow hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-full transition-colors w-fit"
              >
                View Opportunities
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-[#fdfdfb] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-gray-900">Our Core Values</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Excellence",
                description: "We strive for academic and personal excellence in everything we do.",
                delay: 0.1
              },
              {
                title: "Integrity",
                description: "We uphold moral principles and honesty in all our actions.",
                delay: 0.2
              },
              {
                title: "Discipline",
                description: "We maintain order and self-control as foundations for success.",
                delay: 0.3
              },
              {
                title: "Hard Work",
                description: "We believe diligence and effort are keys to achieving goals.",
                delay: 0.4
              },
              {
                title: "God Fearing",
                description: "We cultivate faith and devotion to Allah, following Islamic principles in all aspects of learning and life.",
                delay: 0.5
              },
              {
                title: "Innovation",
                description: "We embrace creative approaches to teaching and learning.",
                delay: 0.6
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: value.delay }}
                className="bg-white rounded-2xl shadow-lg p-8 text-center"
              >
                <h3 className="text-xl font-bold font-serif mb-3 text-school-green">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
