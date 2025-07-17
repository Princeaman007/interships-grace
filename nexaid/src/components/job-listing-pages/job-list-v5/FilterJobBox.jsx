import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { internshipsAPI } from "../../../utils/api";
import Pagination from "../components/Pagination";
import JobSelect from "../components/JobSelect";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategory,
  addDatePosted,
  addExperienceSelect,
  addJobTypeSelect,
  addKeyword,
  addLocation,
  addPerPage,
  addSalary,
  addSort,
} from "../../../features/filter/filterSlice";

const FilterJobBox = () => {
  // État pour les données API
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiPagination, setApiPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  // Redux state existant (gardé intact)
  const { jobList, jobSort } = useSelector((state) => state.filter);
  const {
    keyword,
    location,
    destination,
    category,
    datePosted,
    jobTypeSelect,
    experienceSelect,
    salary,
  } = jobList || {};

  const { sort, perPage } = jobSort;
  const dispatch = useDispatch();

  // Charger les données depuis l'API
  useEffect(() => {
    fetchInternships();
  }, [keyword, location, category, jobTypeSelect, experienceSelect, sort]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      
      // Construire les paramètres de recherche
      const params = {};
      if (keyword) params.search = keyword;
      if (location) params.location = location;
      if (category) params.category = category;
      if (jobTypeSelect) params.jobType = jobTypeSelect.replace('-', ' ');
      if (experienceSelect) params.experience = experienceSelect.replace('-', ' ');
      if (sort === 'asc') params.sort = 'newest';
      if (sort === 'des') params.sort = 'oldest';
      
      const response = await internshipsAPI.getAll(params);
      
      if (response.data.success) {
        setInternships(response.data.data);
        setApiPagination(response.data.pagination);
      }
    } catch (err) {
      setError('Error loading internships');
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour formater les données API au format attendu par le template
  const formatApiDataForTemplate = (apiInternships) => {
    return apiInternships.map((internship) => ({
      id: internship._id,
      jobTitle: internship.title,
      company: internship.company,
      location: internship.location,
      time: formatDate(internship.createdAt),
      salary: internship.salary,
      logo: internship.logo || getDefaultLogo(internship.company),
      jobType: internship.jobType?.map(type => ({
        type: type,
        styleClass: getJobTypeClass(type)
      })) || [],
      category: internship.category,
      destination: { min: 0, max: 100 }, // Valeur par défaut pour la compatibilité
      created_at: formatDate(internship.createdAt),
      experience: internship.experience,
      totalSalary: { min: 0, max: 20000 } // Valeur par défaut pour la compatibilité
    }));
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
    return `https://ui-avatars.com/api/?name=${firstLetter}&background=random&color=fff&size=64`;
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

  // Formatage des données pour le template existant
  const jobs = formatApiDataForTemplate(internships);

  // Vos filtres existants (gardés intacts)
  const keywordFilter = (item) =>
    keyword !== ""
      ? item.jobTitle.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
      : item;

  const locationFilter = (item) =>
    location !== ""
      ? item?.location
          ?.toLocaleLowerCase()
          .includes(location?.toLocaleLowerCase())
      : item;

  const destinationFilter = (item) =>
    item?.destination?.min >= destination?.min &&
    item?.destination?.max <= destination?.max;

  const categoryFilter = (item) =>
    category !== ""
      ? item?.category?.toLocaleLowerCase() === category?.toLocaleLowerCase()
      : item;

  const jobTypeFilter = (item) =>
    item.jobType !== undefined && jobTypeSelect !== ""
      ? item?.jobType[0]?.type.toLocaleLowerCase().split(" ").join("-") ===
          jobTypeSelect && item
      : item;

  const datePostedFilter = (item) =>
    datePosted !== "all" && datePosted !== ""
      ? item?.created_at
          ?.toLocaleLowerCase()
          .split(" ")
          .join("-")
          .includes(datePosted)
      : item;

  const experienceFilter = (item) =>
    experienceSelect !== ""
      ? item?.experience?.split(" ").join("-").toLocaleLowerCase() ===
          experienceSelect && item
      : item;

  const salaryFilter = (item) =>
    item?.totalSalary?.min >= salary?.min &&
    item?.totalSalary?.max <= salary?.max;

  const sortFilter = (a, b) =>
    sort === "des" ? a.id > b.id && -1 : a.id < b.id && -1;

  // Contenu avec gestion loading/error
  let content;

  if (loading) {
    content = (
      <div className="col-12">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading internships...</span>
          </div>
          <p className="mt-3">Loading internships...</p>
        </div>
      </div>
    );
  } else if (error) {
    content = (
      <div className="col-12">
        <div className="alert alert-warning text-center" role="alert">
          <i className="flaticon-warning"></i>
          <p className="mb-2">{error}</p>
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={fetchInternships}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  } else if (jobs.length === 0) {
    content = (
      <div className="col-12">
        <div className="text-center py-5">
          <i className="flaticon-search-1 text-muted" style={{ fontSize: '64px' }}></i>
          <h4 className="mt-3">No Internships Found</h4>
          <p className="text-muted">Try adjusting your search criteria or filters.</p>
        </div>
      </div>
    );
  } else {
    // Votre logique de filtrage existante (gardée intacte)
    content = jobs
      ?.filter(keywordFilter)
      ?.filter(locationFilter)
      ?.filter(destinationFilter)
      ?.filter(categoryFilter)
      ?.filter(jobTypeFilter)
      ?.filter(datePostedFilter)
      ?.filter(experienceFilter)
      ?.filter(salaryFilter)
      ?.sort(sortFilter)
      .slice(perPage.start, perPage.end !== 0 ? perPage.end : 16)
      ?.map((item) => (
        <div className="job-block col-lg-6 col-md-12 col-sm-12" key={item.id}>
          <div className="inner-box">
            <div className="content">
              <span className="company-logo">
                <img 
                  src={item.logo} 
                  alt="item brand"
                  onError={(e) => {
                    e.target.src = getDefaultLogo(item.company);
                  }}
                />
              </span>
              <h4>
                <Link to={`/job-single-v3/${item.id}`}>{item.jobTitle}</Link>
              </h4>

              <ul className="job-info">
                <li>
                  <span className="icon flaticon-briefcase"></span>
                  {item.company}
                </li>
                {/* compnay info */}
                <li>
                  <span className="icon flaticon-map-locator"></span>
                  {item.location}
                </li>
                {/* location info */}
                <li>
                  <span className="icon flaticon-clock-3"></span> {item.time}
                </li>
                {/* time info */}
                <li>
                  <span className="icon flaticon-money"></span> {item.salary}
                </li>
                {/* salary info */}
              </ul>
              {/* End .job-info */}

              <ul className="job-other-info">
                {item?.jobType?.map((val, i) => (
                  <li key={i} className={`${val.styleClass}`}>
                    {val.type}
                  </li>
                ))}
              </ul>
              {/* End .job-other-info */}

              <button className="bookmark-btn">
                <span className="flaticon-bookmark"></span>
              </button>
            </div>
          </div>
        </div>
        // End all jobs
      ));
  }

  // Vos handlers existants (gardés intacts)
  const sortHandler = (e) => {
    dispatch(addSort(e.target.value));
  };

  const perPageHandler = (e) => {
    const pageData = JSON.parse(e.target.value);
    dispatch(addPerPage(pageData));
  };

  const clearAll = () => {
    dispatch(addKeyword(""));
    dispatch(addLocation(""));
    dispatch(addCategory(""));
    dispatch(addJobTypeSelect(""));
    dispatch(addDatePosted(""));
    dispatch(addExperienceSelect(""));
    dispatch(addSalary({ min: 0, max: 20000 }));
    dispatch(addSort(""));
    dispatch(addPerPage({ start: 0, end: 0 }));
    // Recharger les données après clear
    setTimeout(() => fetchInternships(), 100);
  };

  return (
    <>
      <div className="ls-switcher">
        <JobSelect />
        {/* End .showing-result */}

        <div className="sort-by">
          {keyword !== "" ||
          location !== "" ||
          category !== "" ||
          jobTypeSelect !== "" ||
          datePosted !== "" ||
          experienceSelect !== "" ||
          salary?.min !== 0 ||
          salary?.max !== 20000 ||
          sort !== "" ||
          perPage.start !== 0 ||
          perPage.end !== 0 ? (
            <button
              onClick={clearAll}
              className="btn btn-danger text-nowrap me-2"
              style={{ minHeight: "45px", marginBottom: "15px" }}
            >
              Clear All
            </button>
          ) : undefined}

          <select
            value={sort}
            className="chosen-single form-select"
            onChange={sortHandler}
          >
            <option value="">Sort by (default)</option>
            <option value="asc">Newest</option>
            <option value="des">Oldest</option>
          </select>
          {/* End select */}

          <select
            onChange={perPageHandler}
            className="chosen-single form-select ms-3 "
            value={JSON.stringify(perPage)}
          >
            <option
              value={JSON.stringify({
                start: 0,
                end: 0,
              })}
            >
              All
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 10,
              })}
            >
              10 per page
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 20,
              })}
            >
              20 per page
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 30,
              })}
            >
              30 per page
            </option>
          </select>
          {/* End select */}
        </div>
        {/* End sort by filter */}
      </div>
      {/* <!-- ls Switcher --> */}

      <div className="row">{content}</div>
      {/* End .row with jobs */}

      <Pagination />
      {/* <!-- End Pagination --> */}
    </>
  );
};

export default FilterJobBox;