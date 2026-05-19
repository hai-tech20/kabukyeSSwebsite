import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const ReportsPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    // Redirect to role-specific SMS login page with entry token
    window.location.href = `http://localhost:3001/login/${role}?entry=website`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center"
          >
            {/* School Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto bg-blue-900 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif"
            >
              Academic Reports Portal
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 mb-8"
            >
              Access student report cards, academic records, and performance analytics
            </motion.p>

            {/* Role Selection */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <p className="text-gray-700 font-medium mb-6">
                Select your role to continue:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {/* Student Role */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('student')}
                  className="flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl hover:border-green-400 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-16 h-16 mb-4 bg-green-500 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <span className="text-lg font-semibold text-green-800">Student</span>
                  <span className="text-sm text-green-600 mt-1">View your results</span>
                </motion.button>

                {/* Teacher Role */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('teacher')}
                  className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-16 h-16 mb-4 bg-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M12 20h.01M8 20h.01M16 20h.01" />
                    </svg>
                  </div>
                  <span className="text-lg font-semibold text-blue-800">Teacher</span>
                  <span className="text-sm text-blue-600 mt-1">Manage classes</span>
                </motion.button>

                {/* Admin Role */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('admin')}
                  className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl hover:border-purple-400 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-16 h-16 mb-4 bg-purple-500 rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-lg font-semibold text-purple-800">Admin</span>
                  <span className="text-sm text-purple-600 mt-1">Full access</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100"
            >
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-900 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-left">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> This portal requires School Management System (SMS) credentials. 
                    Please contact the school administration if you need access.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReportsPage;
