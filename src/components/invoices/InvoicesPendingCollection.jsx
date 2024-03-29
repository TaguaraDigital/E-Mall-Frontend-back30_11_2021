import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../hooks/contexts/AuthContext";
import InvoicesFinder from "../../services/apis/InvoicesFinder";
import InvoicesPayMethod from "./InvoicesPayMethod";
import { FormatDecimal, FormatDate } from "../../services/utils/formats";
import styled from "styled-components";

const ExchangeRate = styled.p`
  padding: 0 5rem;
  text-align: right;
  font-size: 1.3rem;
  span {
    font-weight: bold;
    color: var(--saintOrange);
  }
`;

const InvoicesPendingCollection = () => {
  const { currentUser, checkAuthenticated, invoices, setInvoices } =
    useContext(AuthContext);

  const [amountToPay, setAmountToPay] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(4.4);
  const [totalDebt, setTotalDebt] = useState(0);
  const [isTotalSelected, setIsTotalSelected] = useState(false);

  const handleCheckBoxAll = (e) => {
    setAmountToPay(0);
    setIsTotalSelected(!isTotalSelected);
    invoices.map((invoice) => {
      if (e.target.checked) {
        invoice.invoice_status = 1;
        setAmountToPay((amount) => amount + invoice.invoice_amount);
      } else {
        invoice.invoice_status = 0;
      }

      return amountToPay;
    });
  };

  const handleCheckBox = (e, id) => {
    setAmountToPay(0);
    setIsTotalSelected(false);
    invoices.map((invoice) => {
      if (id === invoice.invoice_id) {
        invoice.invoice_status = e.target.checked ? 1 : 0;
      }

      if (invoice.invoice_status === 1) {
        setAmountToPay((amount) => amount + invoice.invoice_amount);
      }
      return amountToPay;
    });
  };

  useEffect(() => {
    checkAuthenticated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchExchengeRate = async () => {
      try {
        const response = await (1 * 4.6);
        setExchangeRate((pre) => {
          return response;
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchExchengeRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await InvoicesFinder.pending(currentUser.client_code);

        setTotalDebt(
          response.data.invoices.reduce(
            (total, item) => item.invoice_amount + total,
            0
          )
        );

        setInvoices(response.data.invoices);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="list-group">
      <ExchangeRate className="exchange-rate">
        Tasa de Cambio: <span>{FormatDecimal(exchangeRate)}</span> Bs./US$
      </ExchangeRate>
      <table className="smart-table">
        <caption>Recibos Pendientes</caption>
        <thead>
          <tr>
            <th> Numero </th>
            <th> Factura </th>
            <th> Fecha </th>
            <th> Descripción </th>
            <th> Monto US$ </th>
            <th> Monto Bs. </th>
            <th> Pagar </th>
          </tr>
        </thead>
        <tbody>
          {invoices &&
            invoices.length > 0 &&
            invoices.map((invoice, i) => {
              return (
                <tr key={invoice.invoice_id}>
                  <td data-col-title="Numero"> {i + 1} </td>
                  <td data-col-title="Factura"> {invoice.invoice_id} </td>
                  <td data-col-title="Fecha">{FormatDate(invoice.due_date)}</td>
                  <td data-col-title="Descripcion">
                    {invoice.invoice_description}
                  </td>
                  <td data-col-title="Monto US$">
                    {FormatDecimal(invoice.invoice_amount)}
                  </td>
                  <td data-col-title="Monto Bs.">
                    {FormatDecimal(invoice.invoice_amount * exchangeRate)}
                  </td>
                  <td data-col-title="Pagar">
                    <input
                      type="checkbox"
                      checked={invoice.invoice_status === 1}
                      name={"check" + invoice.invoice_id}
                      id={"check" + invoice.invoice_id}
                      onChange={(e) => handleCheckBox(e, invoice.invoice_id)}
                    />
                  </td>
                </tr>
              );
            })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" className="first-cell">
              Deuda Total
            </td>
            <td data-col-title="Deuda US$">{FormatDecimal(totalDebt)}</td>
            <td data-col-title="Deuda">
              {FormatDecimal(totalDebt * exchangeRate)}
            </td>
            <td data-col-title="Pagar todos">
              <input
                type="checkbox"
                name={"check-total"}
                id={"check-total"}
                checked={isTotalSelected}
                onChange={(e) => handleCheckBoxAll(e)}
              />
            </td>
          </tr>
        </tfoot>
      </table>
      {amountToPay > 0 ? (
        <InvoicesPayMethod
          amountToPay={amountToPay}
          exchangeRate={exchangeRate}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default InvoicesPendingCollection;
