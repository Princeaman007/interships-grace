
import AllApplicants from "@/components/dashboard-pages/employers-dashboard/all-applicants";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "All Applicants || Nexaid Interships - Job Borad ReactJs Template",
  description: "Nexaid Interships - Job Borad ReactJs Template",
};

const AllApplicantsEmploeesPage = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <AllApplicants />
    </>
  );
};

export default AllApplicantsEmploeesPage
