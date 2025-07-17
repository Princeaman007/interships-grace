

import CandidatesList from "@/components/candidates-listing-pages/candidates-list-v4";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: 'Candidates List V4 || Nexaid Interships - Job Borad ReactJs Template',
  description:
    'Nexaid Interships - Job Borad ReactJs Template',
  
}


const CandidateListPage4 = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      
      <CandidatesList />
    </>
  );
};

export default CandidateListPage4
