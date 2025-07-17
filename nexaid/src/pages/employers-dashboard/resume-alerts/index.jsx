
import ResumeAlerts from "@/components/dashboard-pages/employers-dashboard/resume-alerts";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Resume Alerts || Nexaid Interships - Job Borad ReactJs Template",
  description: "Nexaid Interships - Job Borad ReactJs Template",
};

const ResumeAlertsEmploeeDBPage = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <ResumeAlerts />
    </>
  );
};

export default ResumeAlertsEmploeeDBPage
