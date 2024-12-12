import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

const PurchaseHistory = ({ isOpen, onClose }) => {
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userDetails = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (isOpen && userDetails) {
      // Fetch data from the API using the userDetails.name
      const fetchData = async () => {
        try {
          const response = await fetch(
            `http://localhost:1337/api/transactions?filters[customer_name][$eq]=${userDetails.name}`
          );
          const data = await response.json();
          console.log(data.data)
          setTransactionData(data.data)
          // setTransactionData(data.data || []);
        } catch (error) {
          console.error("Error fetching transaction data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-3/4 max-w-4xl">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">Transaction History</h2>
          <button onClick={onClose} className="text-blue-500 hover:underline">
            <FaArrowLeft className="inline mr-1" /> Close
          </button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="overflow-y-auto max-h-60">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Order ID
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Product Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactionData.map((transaction) => (
                  <tr key={transaction.id} className="border-b">
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {transaction.id}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {transaction.product_name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {transaction.date}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      ${transaction.total}
                    </td>
                  </tr>
                ))}
                {transactionData.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-3 px-4 text-sm text-center text-gray-800">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;
