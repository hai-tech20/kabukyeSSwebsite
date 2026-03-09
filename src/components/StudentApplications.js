import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabase';

const StudentApplications = ({ applications, loading, fetchApplications, setMessage }) => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const viewApplicationDetails = (application) => {
    console.log('Full application data:', application);
    console.log('subjects_and_grades:', application.subjects_and_grades);
    console.log('option_subjects:', application.option_subjects);
    console.log('subject_combination:', application.subject_combination);
    setSelectedApplication(application);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGradeDisplay = (subjects) => {
    if (!subjects || typeof subjects !== 'object') return 'No subjects';
    
    const allSubjects = [];
    
    // Handle compulsory subjects (simple key-value pairs)
    Object.entries(subjects).forEach(([key, value]) => {
      if (value && typeof value === 'string' && !key.startsWith('olevel_') && key !== 'subject_combination' && key !== 'optional_subject') {
        allSubjects.push(`${key}: ${value}`);
      }
    });
    
    // Handle O-level subjects (olevel_ prefixed keys)
    Object.entries(subjects).forEach(([key, value]) => {
      if (key.startsWith('olevel_') && value) {
        const subject = key.replace('olevel_', '');
        allSubjects.push(`${subject}: ${value}`);
      }
    });
    
    // Handle optional subjects (object with subject and grade)
    Object.entries(subjects).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null && value.subject) {
        allSubjects.push(`${value.subject}: ${value.grade || 'No grade'}`);
      }
    });
    
    return allSubjects.length > 0 ? allSubjects.join(', ') : 'No subjects';
  };

  const getCompulsorySubjects = (subjects) => {
    if (!subjects || typeof subjects !== 'object') return 'No subjects';
    
    const compulsorySubjects = [];
    Object.entries(subjects).forEach(([key, value]) => {
      if (value && typeof value === 'string' && !key.startsWith('olevel_') && key !== 'subject_combination' && key !== 'optional_subject') {
        compulsorySubjects.push(`${key}: ${value}`);
      }
    });
    
    return compulsorySubjects.length > 0 ? compulsorySubjects.join(', ') : 'No subjects';
  };

  const getOlevelSubjects = (subjects) => {
    if (!subjects || typeof subjects !== 'object') return 'No subjects';
    
    const olevelSubjects = [];
    Object.entries(subjects).forEach(([key, value]) => {
      if (key.startsWith('olevel_') && value) {
        const subject = key.replace('olevel_', '');
        olevelSubjects.push(`${subject}: ${value}`);
      }
    });
    
    return olevelSubjects.length > 0 ? olevelSubjects.join(', ') : 'No subjects';
  };

  const getOptionalSubjects = (subjects) => {
    if (!subjects || typeof subjects !== 'object') return 'No subjects';
    
    const optionalSubjects = [];
    Object.entries(subjects).forEach(([key, value]) => {
      // Handle nested objects (optional_subject structure)
      if (typeof value === 'object' && value !== null && value.subject) {
        optionalSubjects.push(`${value.subject}: ${value.grade || 'No grade'}`);
      }
      // Handle direct string values (for S2/S3)
      else if (key === 'optional_subject' && value && typeof value === 'string') {
        optionalSubjects.push(value);
      }
    });
    
    return optionalSubjects.length > 0 ? optionalSubjects.join(', ') : 'No subjects';
  };

  const getS5Subjects = (subjects_and_grades) => {
    console.log('getS5Subjects called with:', subjects_and_grades);
    if (!subjects_and_grades || typeof subjects_and_grades !== 'object') return 'No subjects';
    
    // Show everything in subjects_and_grades for S5
    const subjects = [];
    Object.entries(subjects_and_grades).forEach(([key, value]) => {
      console.log(`Processing key: ${key}, value:`, value);
      // Add everything that has a value
      if (value && (typeof value === 'string' || typeof value === 'number')) {
        subjects.push(`${key}: ${value}`);
      }
      // Handle nested objects
      else if (typeof value === 'object' && value !== null && value.subject) {
        subjects.push(`${value.subject}: ${value.grade || 'No grade'}`);
      }
      // Include empty strings too
      else if (value === '' || value === null || value === undefined) {
        subjects.push(`${key}: [empty]`);
      }
    });
    
    const result = subjects.length > 0 ? subjects.join(', ') : 'No subjects found';
    console.log('getS5Subjects result:', result);
    return result;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold font-serif text-gray-900 mb-2">Student Applications</h2>
        <p className="text-gray-600">View and manage all student applications</p>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-r-2 border-school-green"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 inline-block">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-600">Student applications will appear here once submitted.</p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((application, index) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => viewApplicationDetails(application)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-school-green rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {application.student_full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{application.student_full_name}</h3>
                    <p className="text-sm text-gray-600">{application.gender}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Class:</span>
                  <span className="text-sm font-semibold text-gray-900">{application.class_applying_for}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Former School:</span>
                  <span className="text-sm font-semibold text-gray-900">{application.former_school || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">District:</span>
                  <span className="text-sm font-semibold text-gray-900">{application.district}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Parent Phone:</span>
                  <span className="text-sm font-semibold text-gray-900">{application.parent_guardian_phone}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Applied:</span>
                  <span className="text-sm font-semibold text-gray-900">{formatDate(application.created_at)}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-4 bg-school-brown hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                View Full Details
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Application Details Modal */}
      <AnimatePresence>
        {showModal && selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Student Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Full Name:</span>
                        <p className="text-gray-900 font-semibold">{selectedApplication.student_full_name}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-700">Gender:</span>
                        <p className="text-gray-900 font-semibold">{selectedApplication.gender}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-700">Date of Birth:</span>
                        <p className="text-gray-900 font-semibold">{formatDate(selectedApplication.date_of_birth)}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-700">Class Applying For:</span>
                        <p className="text-gray-900 font-semibold">{selectedApplication.class_applying_for}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-700">Former School:</span>
                        <p className="text-gray-900 font-semibold">{selectedApplication.former_school || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-700">District:</span>
                        <p className="text-gray-900 font-semibold">{selectedApplication.district}</p>
                      </div>
                    </div>
                  </div>

                  {/* Parent Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Parent/Guardian Information</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Full Name:</span>
                        <p className="text-gray-900 font-semibold">{selectedApplication.parent_guardian_full_name}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-700">Phone:</span>
                        <p className="text-gray-900 font-semibold">{selectedApplication.parent_guardian_phone}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-700">Date Applied:</span>
                        <p className="text-gray-900 font-semibold">{formatDate(selectedApplication.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subjects Information */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                  
                  {/* Subject Combination for S5 */}
                  {selectedApplication.class_applying_for === 'S5' && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-700 mb-3">Subject Combination</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-900 font-semibold">
                          {selectedApplication.subject_combination || 'No subject combination'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Compulsory Subjects - Show for all classes except S5 */}
                    {selectedApplication.class_applying_for !== 'S5' && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">Compulsory Subjects & Grades</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-900">
                            {getCompulsorySubjects(selectedApplication.subjects_and_grades)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* O-Level Subjects for S5 */}
                    {selectedApplication.class_applying_for === 'S5' && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">O-Level Results</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-900">
                            {getS5Subjects(selectedApplication.subjects_and_grades)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Optional Subjects for S2, S3, S5 */}
                    {(selectedApplication.class_applying_for === 'S2' || 
                      selectedApplication.class_applying_for === 'S3' || 
                      selectedApplication.class_applying_for === 'S5') && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">Optional Subject & Grade</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-900">
                            {(() => {
                              if (selectedApplication.class_applying_for === 'S5') {
                                const optional = selectedApplication.optional_subject;
                                if (optional && optional.subject) {
                                  return `${optional.subject}: ${optional.grade || 'No grade'}`;
                                } else if (typeof optional === 'string') {
                                  return optional;
                                } else {
                                  return 'No optional subject';
                                }
                              } else {
                                // For S2 and S3, check both optional_subject and option_subjects
                                const optional = selectedApplication.optional_subject;
                                if (optional && optional.subject) {
                                  return `${optional.subject}: ${optional.grade || 'No grade'}`;
                                } else if (typeof optional === 'string') {
                                  return optional;
                                } else {
                                  return getOptionalSubjects(selectedApplication.option_subjects);
                                }
                              }
                            })()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentApplications;
