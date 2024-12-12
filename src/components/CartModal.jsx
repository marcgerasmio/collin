import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { IoCloseCircleSharp } from "react-icons/io5";

const CartModal = ({ isOpen, onClose }) => {
  const userDetails = JSON.parse(sessionStorage.getItem("user"));
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchCartItems();
    }
  }, [isOpen]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`http://localhost:1337/api/carts?filters[user_name][$eq]=${userDetails.name}&_limit=1000`);
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.data); 
        console.log(data.data);
      } else {
        console.error("Failed to fetch cart items");
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((itemId) => itemId !== id)
        : [...prevSelectedItems, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.id !== id)
    );
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter((itemId) => itemId !== id)
    );
  };

  const handleCheckout = () => {
    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    sessionStorage.setItem("selectedItems", JSON.stringify(selectedCartItems));
    navigate("/multiple-details"); // Perform the redirection
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-lg shadow-lg overflow-y-auto max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Your Cart</h2>
            <button
              onClick={onClose}
              className="hover:underline text-black text-xl"
            >
              <IoCloseCircleSharp />
            </button>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-800">
              Select All
            </span>
          </div>
          {cartItems.length > 0 ? (
            <>
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex items-center py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="mr-4"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-800">
                        {item.product_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ${item.price} x {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-800">
                      ${item.price * item.quantity}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-right">
                <h3 className="text-md font-bold text-green-600">
                  Total: ${total}
                </h3>
                <div className="flex justify-end gap-4 mt-2">
                  <button
                    onClick={handleCheckout}
                    className="inline-block btn bg-customOrange hover:bg-customOrange text-white"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">Your cart is empty!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
