
import Checkout from "@/components/shop/checkout";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Checkout || Nexaid Interships - Job Borad ReactJs Template",
  description: "Nexaid Interships - Job Borad ReactJs Template",
};

const CheckoutPage = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <Checkout />
    </>
  );
};

export default CheckoutPage
