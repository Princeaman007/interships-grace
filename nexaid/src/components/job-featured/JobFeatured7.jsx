import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { internshipsAPI } from '../../utils/api';

const JobFeatured7 = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedInternships();
  }, []);

  const fetchFeaturedInternships = async () => {
    try {
      const response = await internshipsAPI.getFeatured();
      
      if (response.data.success) {
        setInternships(response.data.data);
      }
    } catch (err) {
      setError('Error loading featured internships');
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getDefaultLogo = (companyName) => {
    // Generate a default logo based on company name
    const firstLetter = companyName ? companyName.charAt(0).toUpperCase() : '?';
    return `https://ui-avatars.com/api/?name=${firstLetter}&background=random&color=fff&size=64`;
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading featured internships...</span>
        </div>
        <p className="mt-2 text-muted">Loading featured internships...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-warning text-center" role="alert">
        <i className="flaticon-warning"></i>
        <p className="mb-1">{error}</p>
        <button 
          className="btn btn-sm btn-outline-primary mt-2"
          onClick={fetchFeaturedInternships}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (internships.length === 0) {
    return (
      <div className="text-center py-4">
        <i className="flaticon-search-1 text-muted" style={{ fontSize: '48px' }}></i>
        <h5 className="mt-3">No Featured Internships</h5>
        <p className="text-muted">Check back later for new opportunities!</p>
      </div>
    );
  }

  return (
    <>
      {internships.map((item) => (
        <div className="job-block-five" key={item._id}>
          <div className="inner-box">
            <div className="content">
              <span className="company-logo">
                <img
                  src={item.logo || getDefaultLogo(item.company)}
                  alt={item.company}
                  onError={(e) => {
                    e.target.src = getDefaultLogo(item.company);
                  }}
                />
              </span>
              <h4>
                <Link to={`/job-single-v3/${item._id}`}>{item.title}</Link>
              </h4>
              <ul className="job-info">
                <li>
                  <span className="icon flaticon-briefcase"></span>
                  {item.company}
                </li>
                <li>
                  <span className="icon flaticon-map-locator"></span>
                  {item.location}
                </li>
                <li>
                  <span className="icon flaticon-clock-3"></span>
                  {formatDate(item.createdAt)}
                </li>
                <li>
                  <span className="icon flaticon-money"></span>
                  {item.salary || 'Not specified'}
                </li>
              </ul>
            </div>
            <ul className="job-other-info">
              {item.jobType?.slice(0, 2).map((type, i) => (
                <li key={i} className="time">
                  {type}
                </li>
              ))}
              {item.isUrgent && (
                <li className="required">Urgent</li>
              )}
              {item.isFeatured && (
                <li className="featured">Featured</li>
              )}
            </ul>
            <Link
              to={`/job-single-v3/${item._id}`}
              className="theme-btn btn-style-eight"
            >
              Apply Now
            </Link>
          </div>
        </div>
      ))}
    </>
  );
};

export default JobFeatured7;