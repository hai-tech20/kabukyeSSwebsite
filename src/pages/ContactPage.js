import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { supabase } from '../supabase';

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

const ContactPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const backgroundImage = useBackgroundSlideshow();
  const [formData, setFormData] = useState({
    student_full_name: '',
    gender: '',
    date_of_birth: '',
    education_level: '',
    former_school: '',
    class_applying_for: '',
    district: '',
    subjects_and_grades: {},
    option_subjects: {
      subject_combination: '',
      olevel_English_Language: '',
      olevel_Mathematics: '',
      olevel_Biology: '',
      olevel_Chemistry: '',
      olevel_Physics: '',
      olevel_Geography: '',
      olevel_History_and_Political_Education: '',
      optional_subject: { subject: '', grade: '' }
    },
    parent_guardian_full_name: '',
    parent_guardian_phone: '',
    created_at: new Date().toISOString()
  });
  const [errors, setErrors] = useState({});

  const educationLevels = {
    'Primary': {
      subjects: ['Mathematics', 'English', 'Science', 'Social Studies'],
      grades: ['D1', 'D2', 'C3', 'C4', 'C5', 'C6', 'P7', 'P8', 'F9']
    },
    'Secondary': {
      'S1': ['Mathematics', 'English', 'Science', 'Social Studies'], // Primary subjects for S1
      'S2': ['English Language', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'Geography', 'History and Political Education', 'Religious Education', 'Kiswahili', 'Entrepreneurship Education', 'Physical Education'],
      'S3': ['English Language', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'Geography', 'History and Political Education', 'Religious Education'],
      'S5': [] // No compulsory subjects for S5, only subject combination
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Auto-determine education level and reset subjects when class changes
    if (name === 'class_applying_for') {
      const educationLevel = value === 'Primary' ? 'Primary' : 'Secondary';
      setFormData(prev => ({
        ...prev,
        class_applying_for: value,
        education_level: educationLevel,
        subjects_and_grades: {},
        option_subjects: value === 'S5' ? {
          subject_combination: prev.option_subjects?.subject_combination || '',
          olevel_English_Language: prev.option_subjects?.olevel_English_Language || '',
          olevel_Mathematics: prev.option_subjects?.olevel_Mathematics || '',
          olevel_Biology: prev.option_subjects?.olevel_Biology || '',
          olevel_Chemistry: prev.option_subjects?.olevel_Chemistry || '',
          olevel_Physics: prev.option_subjects?.olevel_Physics || '',
          olevel_Geography: prev.option_subjects?.olevel_Geography || '',
          olevel_History_and_Political_Education: prev.option_subjects?.olevel_History_and_Political_Education || '',
          optional_subject: prev.option_subjects?.optional_subject || { subject: '', grade: '' }
        } : value === 'S1' ? {
          optional_subject: prev.option_subjects?.optional_subject || { subject: '', grade: '' }
        } : {}
      }));
    }
  };

  const handleSubjectGradeChange = (subject, grade) => {
    setFormData(prev => ({
      ...prev,
      subjects_and_grades: {
        ...prev.subjects_and_grades,
        [subject]: grade
      }
    }));
  };

  const addOptionalSubject = () => {
    const newSubjectKey = `optional_${Date.now()}`;
    setFormData(prev => ({
      ...prev,
      option_subjects: {
        ...prev.option_subjects,
        [newSubjectKey]: { subject: '', grade: '' }
      }
    }));
  };

  const removeOptionalSubject = (subject) => {
    setFormData(prev => {
      const newOptionSubjects = { ...prev.option_subjects };
      delete newOptionSubjects[subject];
      return {
        ...prev,
        option_subjects: newOptionSubjects
      };
    });
  };

  const handleOptionalSubjectChange = (subjectKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      option_subjects: {
        ...prev.option_subjects,
        [subjectKey]: subjectKey === 'subject_combination' || subjectKey.startsWith('olevel_')
          ? value 
          : {
              ...prev.option_subjects[subjectKey],
              [field]: value
            }
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.student_full_name.trim()) {
      newErrors.student_full_name = 'Student full name is required';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    }
    
    if (!formData.education_level) {
      newErrors.education_level = 'Education level is required';
    }
    
    if (!formData.class_applying_for) {
      newErrors.class_applying_for = 'Class applying for is required';
    }
    
    if (!formData.district.trim()) {
      newErrors.district = 'District is required';
    }
    
    if (!formData.parent_guardian_full_name.trim()) {
      newErrors.parent_guardian_full_name = 'Parent/guardian name is required';
    }
    
    if (!formData.parent_guardian_phone.trim()) {
      newErrors.parent_guardian_phone = 'Parent/guardian phone is required';
    } else if (!/^(\+256|0)\d{9}$/.test(formData.parent_guardian_phone)) {
      newErrors.parent_guardian_phone = 'Please enter a valid Ugandan phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      let subjectsData = formData.subjects_and_grades;
      let subjectCombination = null;
      
      if (formData.class_applying_for === 'Primary') {
        // Primary: PLE results
        subjectsData = formData.subjects_and_grades;
      } else if (formData.class_applying_for === 'S1') {
        // S1: Compulsory subjects
        subjectsData = formData.subjects_and_grades;
      } else if (formData.class_applying_for === 'S2' || formData.class_applying_for === 'S3') {
        // S2/S3: Compulsory subjects
        subjectsData = formData.subjects_and_grades;
      } else if (formData.class_applying_for === 'S5') {
        // S5: O-Level results go to subjects_and_grades, subject combination separate
        subjectsData = {};
        console.log('S5 - option_subjects data:', formData.option_subjects);
        console.log('S5 - option_subjects type:', typeof formData.option_subjects);
        console.log('S5 - option_subjects keys:', Object.keys(formData.option_subjects || {}));
        
        // Extract O-level subjects from option_subjects and move to subjects_and_grades
        Object.entries(formData.option_subjects).forEach(([key, value]) => {
          console.log(`Processing key: ${key}, value: ${value}, type: ${typeof value}`);
          if (key.startsWith('olevel_')) {
            const subjectName = key.replace('olevel_', '');
            subjectsData[subjectName] = value || '';
            console.log(`Added to subjectsData: ${subjectName}: ${value}`);
          }
        });
        
        console.log('Final subjectsData for S5:', subjectsData);
        console.log('subjectsData type:', typeof subjectsData);
        console.log('subjectsData keys:', Object.keys(subjectsData));
        subjectCombination = formData.option_subjects.subject_combination || null;
        console.log('Subject combination for S5:', subjectCombination);
      }

      const applicationData = {
        student_full_name: formData.student_full_name,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        former_school: formData.former_school,
        class_applying_for: formData.class_applying_for,
        district: formData.district,
        parent_guardian_full_name: formData.parent_guardian_full_name,
        parent_guardian_phone: formData.parent_guardian_phone,
        subjects_and_grades: subjectsData,
        optional_subject: formData.option_subjects.optional_subject || null,
        subject_combination: subjectCombination,
        created_at: new Date().toISOString()
      };

      console.log('Final application data:', applicationData);

      const smsUrl = window.location.origin === 'http://localhost:3000' || window.location.origin === 'http://localhost:3001'
        ? 'http://localhost:3001'
        : 'https://sms.kabukyesecondaryschool.com';

      const res = await fetch(`${smsUrl}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Error submitting application:', data);
        alert('Error submitting application: ' + (data.error || data.details || 'Unknown error'));
      } else {
        console.log('Application submitted successfully:', data);
        alert('Application submitted successfully!');
        setIsModalOpen(false);
        setFormData({
          student_full_name: '',
          gender: '',
          date_of_birth: '',
          education_level: '',
          former_school: '',
          class_applying_for: '',
          district: '',
          subjects_and_grades: {},
          option_subjects: {
            subject_combination: '',
            olevel_English_Language: '',
            olevel_Mathematics: '',
            olevel_Biology: '',
            olevel_Chemistry: '',
            olevel_Physics: '',
            olevel_Geography: '',
            olevel_History_and_Political_Education: '',
            optional_subject: { subject: '', grade: '' }
          },
          parent_guardian_full_name: '',
          parent_guardian_phone: ''
        });
        setErrors({});
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting application. Please try again.');
    }
  };

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
            <h1 className="text-5xl md:text-6xl font-bold font-serif mb-4">Contact Us</h1>
            <p className="text-xl md:text-2xl">We'd love to hear from you</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-gray-900">Get In Touch</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions about admissions, programs, or want to visit our campus? We're here to help you every step of the way.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto px-4">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* First Row: Location and Email - Full Width */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Location Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-school-green to-school-brown rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-serif mb-2 text-gray-900">Location</h3>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Kabukye+Senior+Secondary+School+Buwaiswa" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-school-green hover:text-school-brown font-semibold transition-colors inline-flex items-center"
                    >
                      📍 W436+XMP, Buwaiswa
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <p className="text-gray-600 text-sm mt-1">Tap to open Kabukye Senior Secondary School in Maps</p>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-school-green to-school-brown rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-serif mb-2 text-gray-900">Email</h3>
                    <p className="text-gray-700 font-medium">kabukyesecondaryschool@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Row: Headteacher and Deputy Headteacher - Full Width */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Headteacher Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-school-green to-school-brown rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-serif mb-2 text-gray-900">Headteacher</h3>
                    <p className="text-gray-700 font-medium mb-2">Mr. Isabirye Saleh</p>
                    <div className="flex flex-col space-y-1">
                      <a href="tel:+256770535212" className="text-school-green hover:text-school-brown font-semibold transition-colors">
                        +256 770 535 212
                      </a>
                      <a href="tel:+256702755397" className="text-school-green hover:text-school-brown font-semibold transition-colors">
                        +256 702 755 397
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deputy Headteacher Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-school-green to-school-brown rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-serif mb-2 text-gray-900">Deputy Headteacher</h3>
                    <a href="tel:+256703164895" className="text-school-green hover:text-school-brown font-semibold transition-colors">
                      +256 703 164 895
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Here Button - Below all cards */}
            <div className="flex justify-center pt-6">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 15px 35px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-3/4 lg:w-2/3 bg-gradient-to-r from-school-green to-school-brown text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-white/20"
              >
                <span className="relative z-10">Apply Here</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold font-serif mb-4 text-gray-900">Find Us on the Map</h2>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a 
                href="https://maps.app.goo.gl/BmKCWsRNcD8ahQb79" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-school-green hover:bg-school-brown text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm inline-flex items-center"
              >
                🗺️ Open in Maps
              </a>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Kabukye+Senior+Secondary+School+Buwaiswa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-school-brown hover:bg-school-green text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm inline-flex items-center"
              >
                🎯 Search School Location
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            <iframe
              src="https://maps.google.com/maps?q=Kabukye+Secondary+School+Buwaiswa+Kamuli+Uganda&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kabukye Secondary School Location"
              className="w-full"
            ></iframe>
          </motion.div>
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-school-green to-school-brown text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold font-serif">Student Application Form</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsModalOpen(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Student Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      name="student_full_name"
                      value={formData.student_full_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent outline-none transition-colors ${
                        errors.student_full_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter student's full name"
                    />
                    {errors.student_full_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.student_full_name}</p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent outline-none transition-colors ${
                        errors.gender ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent outline-none transition-colors ${
                        errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.date_of_birth && (
                      <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>
                    )}
                  </div>

                  {/* Class Applying For */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class Applying For *
                    </label>
                    <select
                      name="class_applying_for"
                      value={formData.class_applying_for}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent outline-none transition-colors ${
                        errors.class_applying_for ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Class</option>
                      <option value="S1">S1</option>
                      <option value="S2">S2</option>
                      <option value="S3">S3</option>
                      <option value="S5">S5</option>
                    </select>
                    {errors.class_applying_for && (
                      <p className="text-red-500 text-sm mt-1">{errors.class_applying_for}</p>
                    )}
                  </div>

                  {/* Former School */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Former School
                    </label>
                    <input
                      type="text"
                      name="former_school"
                      value={formData.former_school}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent outline-none transition-colors"
                      placeholder="Enter former school name"
                    />
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District *
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent outline-none transition-colors ${
                        errors.district ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter district"
                    />
                    {errors.district && (
                      <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                    )}
                  </div>

                  {/* Parent/Guardian Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent/Guardian Full Name *
                    </label>
                    <input
                      type="text"
                      name="parent_guardian_full_name"
                      value={formData.parent_guardian_full_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent outline-none transition-colors ${
                        errors.parent_guardian_full_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter parent/guardian full name"
                    />
                    {errors.parent_guardian_full_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.parent_guardian_full_name}</p>
                    )}
                  </div>

                  {/* Parent/Guardian Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent/Guardian Phone *
                    </label>
                    <input
                      type="tel"
                      name="parent_guardian_phone"
                      value={formData.parent_guardian_phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent outline-none transition-colors ${
                        errors.parent_guardian_phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter parent/guardian phone (e.g., +256712345678)"
                    />
                    {errors.parent_guardian_phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.parent_guardian_phone}</p>
                    )}
                  </div>
                </div>

                {/* Primary Subjects and Grades */}
                {formData.education_level === 'Primary' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Subjects and Grades</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {educationLevels.Primary.subjects.map(subject => (
                        <div key={subject} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {subject} *
                          </label>
                          <select
                            value={formData.subjects_and_grades[subject] || ''}
                            onChange={(e) => handleSubjectGradeChange(subject, e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent outline-none transition-colors"
                          >
                            <option value="">Select Grade</option>
                            {educationLevels.Primary.grades.map(grade => (
                              <option key={grade} value={grade}>{grade}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compulsory Subjects and Grades */}
                {formData.education_level === 'Secondary' && formData.class_applying_for && formData.class_applying_for !== 'S5' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {formData.class_applying_for === 'S1' 
                        ? 'PLE Results'
                        : formData.class_applying_for === 'S3' || formData.class_applying_for === 'S4' 
                        ? 'Compulsory Subjects (S.3 & S.4)' 
                        : 'Compulsory Subjects (S.1 & S.2)'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {educationLevels.Secondary[formData.class_applying_for]?.map(subject => (
                        <div key={subject} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {subject} *
                          </label>
                          <select
                            value={formData.subjects_and_grades[subject] || ''}
                            onChange={(e) => handleSubjectGradeChange(subject, e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent outline-none transition-colors"
                          >
                            <option value="">Select Grade</option>
                            {formData.class_applying_for === 'S1' 
                              ? educationLevels.Primary.grades.map(grade => (
                                  <option key={grade} value={grade}>{grade}</option>
                                ))
                              : ['A', 'B', 'C', 'D', 'E'].map(grade => (
                                  <option key={grade} value={grade}>{grade}</option>
                                ))
                            }
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* S5 Application Details */}
                {formData.education_level === 'Secondary' && formData.class_applying_for === 'S5' && (
                  <div className="space-y-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject Combination *
                      </label>
                      <input
                        type="text"
                        value={formData.option_subjects.subject_combination || ''}
                        onChange={(e) => handleOptionalSubjectChange('subject_combination', undefined, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent outline-none transition-colors"
                        placeholder="Enter subject combination (e.g., PCM, PCB, HEG)"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-md font-semibold text-gray-900">O-Level Results</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {educationLevels.Secondary['S3'].map(subject => {
                          const fieldName = subject.replace(/\s+/g, '_');
                          return (
                          <div key={subject} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {subject}
                            </label>
                            <select
                              value={formData.option_subjects[`olevel_${fieldName}`] || ''}
                              onChange={(e) => handleOptionalSubjectChange(`olevel_${fieldName}`, 'grade', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent outline-none transition-colors"
                            >
                              <option value="">Select Grade</option>
                              {['A', 'B', 'C', 'D', 'E'].map(grade => (
                                <option key={grade} value={grade}>{grade}</option>
                              ))}
                            </select>
                          </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Optional Subject at the bottom of O-Level Results */}
                    <div className="space-y-4">
                      <h4 className="text-md font-semibold text-gray-900">Optional Subject</h4>
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Optional Subject
                        </label>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={formData.option_subjects.optional_subject?.subject || ''}
                            onChange={(e) => handleOptionalSubjectChange('optional_subject', 'subject', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent outline-none transition-colors"
                            placeholder="Enter subject name"
                          />
                          <select
                            value={formData.option_subjects.optional_subject?.grade || ''}
                            onChange={(e) => handleOptionalSubjectChange('optional_subject', 'grade', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent outline-none transition-colors"
                          >
                            <option value="">Select Grade</option>
                            {['A', 'B', 'C', 'D', 'E'].map(grade => (
                              <option key={grade} value={grade}>{grade}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Optional Subject for S2 and S3 */}
                {formData.education_level === 'Secondary' && (
                  (formData.class_applying_for === 'S2' || 
                   formData.class_applying_for === 'S3') && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Optional Subject</h3>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Optional Subject
                      </label>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={formData.option_subjects.optional_subject?.subject || ''}
                          onChange={(e) => handleOptionalSubjectChange('optional_subject', 'subject', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent outline-none transition-colors"
                          placeholder="Enter subject name"
                        />
                        <select
                          value={formData.option_subjects.optional_subject?.grade || ''}
                          onChange={(e) => handleOptionalSubjectChange('optional_subject', 'grade', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-school-green focus:border-transparent outline-none transition-colors"
                        >
                          <option value="">Select Grade</option>
                          {['A', 'B', 'C', 'D', 'E'].map(grade => (
                            <option key={grade} value={grade}>{grade}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 mt-6">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-school-green hover:bg-opacity-90 text-white font-semibold rounded-lg transition-colors"
                  >
                    Submit Application
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ContactPage;
