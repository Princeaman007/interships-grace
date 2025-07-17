import ShopDetails from "@/components/shop/shop-single/ShopDetails";

import {useParams } from "react-router-dom";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Shop-details || Nexaid Interships - Job Borad ReactJs Template",
  description: "Nexaid Interships - Job Borad ReactJs Template",
};

const ShopSingleDyanmic = () => {
  let params = useParams();
  return (
    <>
    <MetaComponent meta={metadata} />
      <ShopDetails id={params.id} />
    </>
  );
};

export default ShopSingleDyanmic