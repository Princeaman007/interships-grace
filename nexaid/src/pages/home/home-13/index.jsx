import React from "react";

import Home from "@/components/home-13";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home-13 || Nexaid Interships - Job Borad ReactJs Template",
  description: "Nexaid Interships - Job Borad ReactJs Template",
};

const HomePage13 = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <Home />
    </>
  );
};

export default HomePage13;
