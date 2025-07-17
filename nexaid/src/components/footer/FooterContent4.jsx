import { Link } from "react-router-dom";
import SearchForm from "./SearchForm";

const FooterContent4 = () => {
  const footerContent = [
    {
      id: 1,
      title: "For Candidates",
      colClass: "col-lg-3",
      menuList: [
        { name: "Browse Jobs", route: "/job-list-v5" },
        { name: "Browse Categories", route: "/job-list-v5" },
      ],
    },
    {
      id: 2,
      title: "For Employers",
      colClass: "col-lg-3",
      menuList: [
        { name: "Browse Candidates", route: "/candidates-list-v3" },
        { name: "Employer Login", route: "/login" },
      ],
    },
    {
      id: 3,
      title: "Company",
      colClass: "col-lg-2",
      menuList: [
        { name: "About Us", route: "/about" },
        { name: "Contact", route: "/contact" },
        { name: "FAQ", route: "/faq" },
        { name: "Pricing", route: "/pricing" },
      ],
    },
  ];

  return (
    <>
      {footerContent.map((item) => (
        <div
          className={`footer-column ${item.colClass} col-md-6 col-sm-12`}
          key={item.id}
        >
          <div className="footer-widget links-widget">
            <h4 className="widget-title">{item.title}</h4>
            <div className="widget-content">
              <ul className="list">
                {item?.menuList?.map((menu, i) => (
                  <li key={i}>
                    <Link to={menu.route}>{menu.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}

      <div className="footer-column col-lg-4 col-md-12 col-sm-12">
        <div className="footer-widget">
          <h4 className="widget-title">Join Us On</h4>
          <div className="widget-content">
            <div className="newsletter-form">
              <div className="text">We don't send spam so don't worry.</div>
              <SearchForm />
            </div>
          </div>
        </div>
      </div>
      {/* End .footer-column */}
    </>
  );
};

export default FooterContent4;