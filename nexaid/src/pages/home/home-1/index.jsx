import React from "react";
import Home from "@/components/home-1";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home-1 || Nexaid Interships - Job Borad ReactJs Template",
  description: "Nexaid Interships - Job Borad ReactJs Template",
};

const HomePage1 = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <Home />
    </>
  );
};

export default HomePage1;
