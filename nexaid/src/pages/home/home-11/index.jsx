import React from "react";

import Home from "@/components/home-11";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home-11 || Nexaid Interships - Job Borad ReactJs Template",
  description: "Nexaid Interships - Job Borad ReactJs Template",
};

const HomePage11 = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <Home />
    </>
  );
};

export default HomePage11;
