import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
// import Invoice from "./Invoice/Invoice";

// function ConvertJsonToInvoice(
//   test,
//   MyCompany,
//   EmailCompany,
//   PhoneCompany,
//   AddressCompany
// ) {
//   let MyBalance =
//     test.payment.transactions[0].amount.total +
//     " " +
//     test.payment.transactions[0].amount.currency;
//   let invoice = {
//     id: test.payment.id,
//     invoice_no: test.payment.transactions[0].related_resources[0].sale.id,
//     balance: MyBalance,
//     company: MyCompany,
//     email: EmailCompany,
//     phone: PhoneCompany,
//     address: AddressCompany,
//     date: test.payment.create_time,
//     due_date: test.payment.update_time,
//     items: test.payment.transactions[0].item_list.items,
//   };
//   return invoice;
// }

const Success = () => {
  const [session, setSession] = useState({});
  const location = useLocation();
  const queryLocation = location.search;
  useEffect(() => {
    async function fetchSession() {
      const products = await fetch(
        process.env.REACT_APP_URL1 + "/api/paypal/success" + queryLocation
      ).then((res) => res.json());
      setSession(products);
    }
    fetchSession();
  }, [queryLocation]);

  return (
    <div className="sr-root">
      <div className="sr-main">
        <header className="sr-header">
          <div className="sr-header__logo"></div>
        </header>
        {session.status === "success" ? (
          <div className="sr-payment-summary completed-view">
            <h1>Your payment succeeded</h1>
            <h4>View CheckoutSession response:</h4>
          </div>
        ) : session.message === "Session already create " ? (
          <div className="sr-payment-summary completed-view">
            <h1>Your payment Already Validate </h1>
            <h4>View CheckoutSession response:</h4>
          </div>
        ) : (
          <div className="sr-payment-summary completed-view">
            <h1>Your payment Failed</h1>
            <h4>View CheckoutSession response:</h4>
          </div>
        )}

        <div className="sr-section completed-view">
          <div className="sr-callout">
            {Object.keys(session).length === 0 ? (
              <div></div>
            ) : (
              <h1>DOCUMENTO FACTURA</h1>
              )}
          </div>
          <Link to="/">Return to DashBoard</Link>
        </div>
      </div>
      <div className="sr-content">
        <div className="pasha-image-stack">
          <img
            alt=""
            src="https://picsum.photos/280/320?random=1"
            width="140"
            height="160"
          />
          <img
            alt=""
            src="https://picsum.photos/280/320?random=2"
            width="140"
            height="160"
          />
        </div>
      </div>
    </div>
  );
};

export default Success;
