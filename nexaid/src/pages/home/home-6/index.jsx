import React from "react";

import Home from "@/components/home-6";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home-6 || Nexaid Interships - Job Borad ReactJs Template",
  description: "Nexaid Interships - Job Borad ReactJs Template",
};

const HomePage6 = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <Home />
    </>
  );
};

export default HomePage6;
