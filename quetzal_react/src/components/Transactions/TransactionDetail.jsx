import "../../styles/Transactions/TransactionDetail.css";

const TransactionDetail = ({
  onClose,
  datetime,
  description,
  notes,
  amount,
  category,
  account,
  currency,
  type,
}) => {
  let dateStr = datetime.replace(" ", "T");
  const newDate = Date.parse(dateStr);

  return (
    <>
      <div className="transaction-detail-modal-container">
        <div className="transaction-detail-modal">
          <div className="datetime-close">
            <div className="datetime">
              {new Intl.DateTimeFormat(undefined, {
                year: "numeric",
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
                .format(newDate)
                .replace(", ", " | ")}
            </div>
            <div
              className="modal-close-button"
              onClick={onClose}
              title="Close Modal"
            >
              X
            </div>
          </div>

          <div className="details-splitter-container">
            <div className="details-left">
              <div className="desc-cat">
                <div className="description">{description}</div>
                <div className="category">{category}</div>
              </div>
            </div>
            <div className="details-right">
              <div className="bal-type-acc">
                <div className="type">{type}</div>
                <div className="balance">
                  {Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: currency,
                  }).format(amount)}
                </div>
                <div>{account}</div>
              </div>
            </div>
          </div>
          {notes !== "" ? <div className="notes-container">{notes}</div> : ""}
        </div>
      </div>
    </>
  );
};
export default TransactionDetail;
