import { Link } from "react-router-dom";
import Social from "./common-footer/Social";


const CopyrightFooter2 = () => {
  return (
    <div className="footer-bottom">
      <div className="auto-container">
        <div className="outer-box">
          <div className="bottom-left">
            <div className="logo">
              <Link to="/">
                <img
                 
                  src="/images/logo.svg"
                  alt="brand"
                />
              </Link>
            </div>
            <div className="copyright-text">
              © {new Date().getFullYear()} Nexaid Interships by{" "}
              <a
                href="https://themeforest.net/user/ib-themes"
                target="_blank"
                rel="noopener noreferrer"
              >
                ib-themes
              </a>
              . All Right Reserved.
            </div>
          </div>

          <div className="social-links">
            <Social />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyrightFooter2;
