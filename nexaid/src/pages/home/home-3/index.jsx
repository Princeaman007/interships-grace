import React from "react";

import Home from "@/components/home-3";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home-3 || Nexaid Interships - Job Borad ReactJs Template",
  description: "Nexaid Interships - Job Borad ReactJs Template",
};

const HomePage3 = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <Home />
    </>
  );
};

export default HomePage3;
