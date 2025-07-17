import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Categories from "../components/Categories";
import LocationBox from "../components/LocationBox";
import SearchBox from "../components/SearchBox";

const JobSearchForm = () => {
  const dispatch = useDispatch();
  
  // Récupérer les valeurs des filtres depuis Redux
  const { jobList } = useSelector((state) => state.filter);
  const { keyword, location, category } = jobList || {};

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Les données sont déjà dans Redux grâce aux composants SearchBox, LocationBox, Categories
    // Le FilterJobBox va automatiquement réagir aux changements de Redux
    console.log('Search submitted with:', {
      keyword,
      location, 
      category
    });
    
    // Optionnel : scroll vers les résultats
    const resultsSection = document.querySelector('.ls-section');
    if (resultsSection) {
      resultsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <form className="job-search-form" onSubmit={handleSubmit}>
      <div className="row">
        <div className="form-group col-lg-4 col-md-12 col-sm-12">
          <SearchBox />
        </div>
        {/* <!-- Form Group --> */}

        <div className="form-group col-lg-3 col-md-12 col-sm-12 location">
          <LocationBox />
        </div>
        {/* <!-- Form Group --> */}

        <div className="form-group col-lg-3 col-md-12 col-sm-12 location">
          <Categories />
        </div>
        {/* <!-- Form Group --> */}

        <div className="form-group col-lg-2 col-md-12 col-sm-12 text-right">
          <button type="submit" className="theme-btn btn-style-one">
            Find Jobs
          </button>
        </div>
        {/* <!-- Form Group --> */}
      </div>
    </form>
    // End job Search form
  );
};

export default JobSearchForm;