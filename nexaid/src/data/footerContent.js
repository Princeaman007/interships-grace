const footerContent = [
  {
    id: 1,
    title: "For Candidates",
    menuList: [
      { name: "Browse Jobs", route: "/job-list-v5" },
      { name: "Browse Categories", route: "/job-list-v5" },
    ],
  },
  {
    id: 2,
    title: "For Employers",
    menuList: [
      { name: "Browse Candidates", route: "/candidates-list-v3" },
      { name: "Employer Login", route: "/login" }, // Redirige vers login
    ],
  },
  {
    id: 3,
    title: "Company",
    menuList: [
      { name: "About Us", route: "/about" },
      { name: "Contact", route: "/contact" },
      { name: "FAQ", route: "/faq" },
      { name: "Pricing", route: "/pricing" },
    ],
  },
];

export default footerContent;