import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { internshipsAPI } from "@/utils/api";
import LoginPopup from "@/components/common/form/login/LoginPopup";
import FooterDefault from "@/components/footer/common-footer";
import DefaulHeader from "@/components/header/DefaulHeader";
import MobileMenu from "@/components/header/MobileMenu";
import CompnayInfo from "@/components/job-single-pages/shared-components/CompanyInfo";
import SocialTwo from "@/components/job-single-pages/social/SocialTwo";
import Contact from "@/components/job-single-pages/shared-components/Contact";
import JobDetailsDescriptions from "@/components/job-single-pages/shared-components/JobDetailsDescriptions";
import RelatedJobs2 from "@/components/job-single-pages/related-jobs/RelatedJobs2";
import JobOverView2 from "@/components/job-single-pages/job-overview/JobOverView2";
import ApplyJobModalContent from "@/components/job-single-pages/shared-components/ApplyJobModalContent";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Job Single Dynamic V3 || Nexaid Internships - Job Board ReactJs Template",
  description: "Nexaid Internships - Job Board ReactJs Template",
};

const JobSingleDynamicV3 = () => {
  const params = useParams();
  const id = params.id;
  
  // États pour les données API
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchInternshipDetails();
    }
  }, [id]);

  const fetchInternshipDetails = async () => {
    try {
      setLoading(true);
      const response = await internshipsAPI.getById(id);
      
      if (response.data.success) {
        setInternship(response.data.data);
      } else {
        setError('Internship not found');
      }
    } catch (err) {
      setError('Error loading internship details');
      console.error('Error fetching internship:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour formater les données API au format attendu par le template
  const formatInternshipForTemplate = (apiInternship) => {
    if (!apiInternship) return null;
    
    return {
      id: apiInternship._id,
      jobTitle: apiInternship.title,
      company: apiInternship.company,
      location: apiInternship.location,
      time: formatDate(apiInternship.createdAt),
      salary: apiInternship.salary,
      logo: apiInternship.logo || getDefaultLogo(apiInternship.company),
      jobType: apiInternship.jobType?.map(type => ({
        type: type,
        styleClass: getJobTypeClass(type)
      })) || [],
      link: apiInternship.companyId?.website || '#',
      description: apiInternship.description,
      requirements: apiInternship.requirements,
      responsibilities: apiInternship.responsibilities,
      benefits: apiInternship.benefits,
      category: apiInternship.category,
      experience: apiInternship.experience,
      skills: apiInternship.skills,
      startDate: apiInternship.startDate,
      endDate: apiInternship.endDate,
      applicationDeadline: apiInternship.applicationDeadline,
      companyInfo: apiInternship.companyId
    };
  };

  // Fonctions utilitaires
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
    const firstLetter = companyName ? companyName.charAt(0).toUpperCase() : '?';
    return `https://ui-avatars.com/api/?name=${firstLetter}&background=random&color=fff&size=128`;
  };

  const getJobTypeClass = (type) => {
    const typeMap = {
      'Full-time': 'time',
      'Part-time': 'time',
      'Remote': 'privacy',
      'On-site': 'privacy',
      'Hybrid': 'privacy'
    };
    return typeMap[type] || 'time';
  };

  // Formater les données pour le template
  const company = formatInternshipForTemplate(internship);

  // Rendu conditionnel pour loading et error
  if (loading) {
    return (
      <>
        <MetaComponent meta={metadata} />
        <span className="header-span"></span>
        <DefaulHeader />
        <MobileMenu />
        
        <section className="job-detail-section">
          <div className="job-detail-outer">
            <div className="auto-container">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading internship details...</span>
                </div>
                <p className="mt-3">Loading internship details...</p>
              </div>
            </div>
          </div>
        </section>
        
        <FooterDefault footerStyle="alternate5" />
      </>
    );
  }

  if (error || !company) {
    return (
      <>
        <MetaComponent meta={metadata} />
        <span className="header-span"></span>
        <DefaulHeader />
        <MobileMenu />
        
        <section className="job-detail-section">
          <div className="job-detail-outer">
            <div className="auto-container">
              <div className="text-center py-5">
                <i className="flaticon-warning text-muted" style={{ fontSize: '64px' }}></i>
                <h4 className="mt-3">Internship Not Found</h4>
                <p className="text-muted">The internship you're looking for doesn't exist or has been removed.</p>
                <a href="/job-list-v5" className="theme-btn btn-style-one mt-3">
                  Browse All Internships
                </a>
              </div>
            </div>
          </div>
        </section>
        
        <FooterDefault footerStyle="alternate5" />
      </>
    );
  }

  return (
    <>
      <MetaComponent meta={{
        ...metadata,
        title: `${company.jobTitle} at ${company.company} || Nexaid Internships`,
        description: company.description?.substring(0, 160) || metadata.description
      }} />
      {/* <!-- Header Span --> */}
      <span className="header-span"></span>

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader />
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

      {/* <!-- Job Detail Section --> */}
      <section className="job-detail-section">
        <div className="job-detail-outer">
          <div className="auto-container">
            <div className="row">
              <div className="content-column col-lg-8 col-md-12 col-sm-12">
                <div className="job-block-outer">
                  <div className="job-block-seven style-two">
                    <div className="inner-box">
                      <div className="content">
                        <h4>{company?.jobTitle}</h4>

                        <ul className="job-info">
                          <li>
                            <span className="icon flaticon-briefcase"></span>
                            {company?.company}
                          </li>
                          {/* company info */}
                          <li>
                            <span className="icon flaticon-map-locator"></span>
                            {company?.location}
                          </li>
                          {/* location info */}
                          <li>
                            <span className="icon flaticon-clock-3"></span>{" "}
                            {company?.time}
                          </li>
                          {/* time info */}
                          <li>
                            <span className="icon flaticon-money"></span>{" "}
                            {company?.salary}
                          </li>
                          {/* salary info */}
                        </ul>
                        {/* End .job-info */}

                        <ul className="job-other-info">
                          {company?.jobType?.map((val, i) => (
                            <li key={i} className={`${val.styleClass}`}>
                              {val.type}
                            </li>
                          ))}
                          {internship?.isUrgent && (
                            <li className="required">Urgent</li>
                          )}
                          {internship?.isFeatured && (
                            <li className="featured">Featured</li>
                          )}
                        </ul>
                        {/* End .job-other-info */}
                      </div>
                      {/* End .content */}
                    </div>
                  </div>
                  {/* <!-- Job Block --> */}
                </div>
                {/* <!-- job block outer --> */}

                <div className="job-overview-two">
                  <h4>Job Description</h4>
                  <JobOverView2 internship={internship} />
                </div>
                {/* <!-- job-overview-two --> */}

                <JobDetailsDescriptions internship={internship} />
                {/* End job-details */}

                <div className="other-options">
                  <div className="social-share">
                    <h5>Share this job</h5>
                    <SocialTwo />
                  </div>
                </div>
                {/* <!-- Other Options --> */}
              </div>
              {/* End .content-column */}

              <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
                <aside className="sidebar">
                  <div className="btn-box">
                    <a
                      href="#"
                      className="theme-btn btn-style-one"
                      data-bs-toggle="modal"
                      data-bs-target="#applyJobModal"
                    >
                      Apply For Job
                    </a>
                    <button className="bookmark-btn">
                      <i className="flaticon-bookmark"></i>
                    </button>
                  </div>
                  {/* End apply for job btn */}

                  {/* <!-- Modal --> */}
                  <div
                    className="modal fade"
                    id="applyJobModal"
                    tabIndex="-1"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                      <div className="apply-modal-content modal-content">
                        <div className="text-center">
                          <h3 className="title">Apply for this job</h3>
                          <button
                            type="button"
                            className="closed-modal"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        {/* End modal-header */}

                        <ApplyJobModalContent internshipId={id} />
                        {/* End PrivateMessageBox */}
                      </div>
                      {/* End .send-private-message-wrapper */}
                    </div>
                  </div>
                  {/* End .modal */}

                  <div className="sidebar-widget company-widget">
                    <div className="widget-content">
                      <div className="company-title">
                        <div className="company-logo">
                          <img
                            src={company.logo}
                            alt="resource"
                            onError={(e) => {
                              e.target.src = getDefaultLogo(company.company);
                            }}
                          />
                        </div>
                        <h5 className="company-name">{company.company}</h5>
                        <a href="#" className="profile-link">
                          View company profile
                        </a>
                      </div>
                      {/* End company title */}

                      <CompnayInfo companyInfo={company.companyInfo} />

                      <div className="btn-box">
                        <a
                          href={company?.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="theme-btn btn-style-three"
                        >
                          Visit Website
                        </a>
                      </div>
                      {/* End btn-box */}
                    </div>
                  </div>
                  {/* End .company-widget */}

                  <div className="sidebar-widget contact-widget">
                    <h4 className="widget-title">Contact Us</h4>
                    <div className="widget-content">
                      <div className="default-form">
                        <Contact />
                      </div>
                      {/* End .default-form */}
                    </div>
                  </div>
                  {/* End contact-widget */}
                </aside>
                {/* End .sidebar */}
              </div>
              {/* End .sidebar-column */}
            </div>
            {/* End .row  */}

            <div className="related-jobs">
              <div className="title-box">
                <h3>Related Jobs</h3>
                <div className="text">Find similar internship opportunities.</div>
              </div>
              {/* End title box */}

              <div className="row">
                <RelatedJobs2 category={internship?.category} currentId={id} />
              </div>
              {/* End .row */}
            </div>
            {/* <!-- Related Jobs --> */}
          </div>
          {/* End auto-container */}
        </div>
        {/* <!-- job-detail-outer--> */}
      </section>
      {/* <!-- End Job Detail Section --> */}

      <FooterDefault footerStyle="alternate5" />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default JobSingleDynamicV3;