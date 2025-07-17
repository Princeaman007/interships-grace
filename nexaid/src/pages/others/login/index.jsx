

import LogIn from "@/components/pages-menu/login";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: 'Login || Nexaid Interships - Job Borad ReactJs Template',
  description:
    'Nexaid Interships - Job Borad ReactJs Template',
  
}



const LoginPage = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      
      <LogIn />
    </>
  );
};

export default LoginPage
