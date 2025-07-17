import { useState } from 'react';
import { Link } from "react-router-dom";
import { applicationsAPI } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';

const ApplyJobModalContent = ({ internshipId, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    coverLetter: '',
    portfolio: '',
    acceptTerms: false
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!allowedTypes.includes(file.type)) {
        setError('Only PDF, DOC, and DOCX files are allowed for resume');
        return;
      }
      
      if (file.size > maxSize) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setResume(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!isAuthenticated) {
      setError('You must be logged in to apply');
      setLoading(false);
      return;
    }

    if (user?.role !== 'student') {
      setError('Only students can apply to internships');
      setLoading(false);
      return;
    }

    if (!resume) {
      setError('Please upload your resume');
      setLoading(false);
      return;
    }

    if (!formData.coverLetter.trim()) {
      setError('Please write a cover letter');
      setLoading(false);
      return;
    }

    if (formData.coverLetter.length < 50) {
      setError('Cover letter must be at least 50 characters long');
      setLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      const applicationData = new FormData();
      applicationData.append('internshipId', internshipId);
      applicationData.append('coverLetter', formData.coverLetter);
      applicationData.append('resume', resume);
      
      if (formData.portfolio) {
        applicationData.append('portfolio', formData.portfolio);
      }

      const response = await applicationsAPI.apply(applicationData);

      if (response.data.success) {
        setSuccess(true);
        setFormData({ coverLetter: '', portfolio: '', acceptTerms: false });
        setResume(null);
        
        if (onSuccess) {
          onSuccess();
        }
        
        // Close modal after 3 seconds
        setTimeout(() => {
          const modal = document.getElementById('applyJobModal');
          if (modal) {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
              modalInstance.hide();
            }
          }
        }, 3000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error submitting application';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-4">
        <i className="flaticon-lock text-muted" style={{ fontSize: '48px' }}></i>
        <h4 className="mt-3">Login Required</h4>
        <p className="text-muted">You need to be logged in to apply for internships.</p>
        <Link to="/login" className="btn btn-primary">
          Login Now
        </Link>
      </div>
    );
  }

  if (user?.role !== 'student') {
    return (
      <div className="text-center py-4">
        <i className="flaticon-warning text-warning" style={{ fontSize: '48px' }}></i>
        <h4 className="mt-3">Student Account Required</h4>
        <p className="text-muted">Only student accounts can apply to internships.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="alert alert-success">
          <i className="flaticon-check-mark text-success" style={{ fontSize: '48px' }}></i>
          <h4 className="mt-3">Application Submitted Successfully!</h4>
          <p>We've received your application. The company will review it and get back to you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <form className="default-form job-apply-form" onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="flaticon-warning"></i> {error}
        </div>
      )}
      
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <label className="form-label">Resume *</label>
          <div className="uploading-outer apply-cv-outer">
            <div className="uploadButton">
              <input
                className="uploadButton-input"
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                id="upload"
                onChange={handleFileChange}
                required
              />
              <label
                className="uploadButton-button ripple-effect"
                htmlFor="upload"
              >
                {resume ? (
                  <>
                    <i className="flaticon-check-mark text-success"></i>
                    {resume.name}
                  </>
                ) : (
                  <>
                    <i className="flaticon-upload"></i>
                    Upload Resume (PDF, DOC, DOCX)
                  </>
                )}
              </label>
            </div>
          </div>
          <small className="form-text text-muted">Maximum file size: 5MB</small>
        </div>

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <label className="form-label">Cover Letter *</label>
          <textarea
            className="form-control"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleInputChange}
            placeholder="Tell us why you're interested in this internship and what makes you a great candidate..."
            rows="6"
            required
            minLength="50"
          />
          <small className="form-text text-muted">
            {formData.coverLetter.length}/2000 characters (minimum 50)
          </small>
        </div>

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <label className="form-label">Portfolio URL (Optional)</label>
          <input
            type="url"
            className="form-control"
            name="portfolio"
            value={formData.portfolio}
            onChange={handleInputChange}
            placeholder="https://your-portfolio.com"
          />
          <small className="form-text text-muted">Link to your portfolio, GitHub, or personal website</small>
        </div>

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <div className="input-group checkboxes square">
            <input 
              type="checkbox" 
              name="acceptTerms" 
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="acceptTerms" className="remember">
              <span className="custom-checkbox"></span> 
              I accept the{" "}
              <Link to="/terms" target="_blank">
                Terms and Conditions and Privacy Policy
              </Link>
            </label>
          </div>
        </div>

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <button
            className="theme-btn btn-style-one w-100"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Submitting Application...
              </>
            ) : (
              <>
                <i className="flaticon-paper-plane me-2"></i>
                Submit Application
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ApplyJobModalContent;