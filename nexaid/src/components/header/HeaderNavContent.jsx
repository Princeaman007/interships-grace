

import { Link } from "react-router-dom";


import { useLocation } from "react-router-dom";
const HeaderNavContent = () => {
  const { pathname } = useLocation();
  return (
    <>
      <nav className="nav main-menu">
        <ul className="navigation" id="navbar">
          <li
            className={`${pathname === "/" ? "current" : ""
              }`}
          >
            <Link to="/">Home</Link>
          </li>

          <li
            className={`${pathname === "/job-list-v5" ? "current" : ""
              }`}
          >
            <Link to="/job-list-v5">Jobs</Link>
          </li>
          {/* End findjobs menu items */}

          <li
            className={`${pathname === "/employers-list-v3" ? "current" : ""
              }`}
          >
            <Link to="/employers-list-v3">Employers</Link>
          </li>
          {/* End Employers menu items */}

          <li
            className={`${pathname === "/candidates-list-v3" ? "current" : ""
              }`}
          >
            <Link to="/candidates-list-v3">Candidates</Link>
          </li>
          {/* End Candidates menu items */}


          <li
            className={`${pathname === "/blog-list-v3" ? "current" : ""}`}
          >
            <Link to="/blog-list-v3">Blog</Link>
          </li>

         <li
            className={`${pathname === "/about" ? "current" : ""}`}
          >
            <Link to="/about">About</Link>
          </li>
          {/* End About menu items */}

          <li
            className={`${pathname === "/terms" ? "current" : ""}`}
          >
            <Link to="/terms">Terms</Link>
          </li>
          {/* End Pricing menu items */}

          <li
            className={`${pathname === "/faq" ? "current" : ""}`}
          >
            <Link to="/faq">FAQ</Link>
          </li>
          {/* End FAQ menu items */}

          <li
            className={`${pathname === "/contact" ? "current" : ""}`}
          >
            <Link to="/contact">Contact</Link>
          </li>
          {/* End Contact menu items */}
        </ul>
      </nav>
    </>
  );
};

export default HeaderNavContent;
