import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaTrash } from "react-icons/fa";

// Static data (for fallback if sessionStorage is empty)
const initialOrderItems = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 79.99,
    quantity: 1,
    image: "https://via.placeholder.com/100x100?text=Headphones",
  },
  {
    id: 2,
    name: "Smartphone Case",
    price: 19.99,
    quantity: 2,
    image: "https://via.placeholder.com/100x100?text=Phone+Case",
  },
  {
    id: 3,
    name: "USB-C Cable",
    price: 9.99,
    quantity: 3,
    image: "https://via.placeholder.com/100x100?text=USB+Cable",
  },
];

function MultipleItems() {
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState(initialOrderItems);

  useEffect(() => {

    const selectedItems = JSON.parse(sessionStorage.getItem("selectedItems"));
    

    if (selectedItems) {
      setOrderItems(selectedItems);
    }
  }, []);

  const handleQuantityChange = (id, newQuantity) => {
    setOrderItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setOrderItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 10.0;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    for (const item of orderItems) {
      const cartData = {
        data: {
          product_name: item.product_name,
          quantity: item.quantity,
          total: item.price * item.quantity,
          customer_name: item?.user_name || "Guest",
          date: formattedDate,
        },
      };
  
      const jsonString = JSON.stringify(cartData);
  
      try {
        const response = await fetch("http://localhost:1337/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonString,
        });
  
        if (response.ok) {
          const data = await response.json();
        } else {
          const errorData = await response.text();
          console.error("Failed to add item:", errorData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    alert("All items processed!");
    handleDelete();
  };

  const handleDelete = async () => {
    for (const item of orderItems) {
      try {
        const response = await fetch(`http://localhost:1337/api/carts/${item.documentId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log(`Item with id ${item.id} deleted:`, data);
        } else {
          const errorData = await response.text();
          console.error(`Failed to delete item with id ${item.id}:`, errorData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  
  
  navigate("/products");
    
  };
  
  
  

  return (
    <div className="container mx-auto px-4 py-8 bg-customGreen min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Items in Your Order</h2>
            <hr />
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex items-center">
                  <div>
                    <h3 className="font-semibold">{item.product_name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, parseInt(e.target.value))
                    }
                    className="w-16 text-center border rounded-md mr-4"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
            <hr />
            <div className="flex justify-between font-semibold text-lg mt-4">
              <span>Total:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <button onClick={handleSubmit} className="btn bg-customOrange text-white hover:bg-customOrange">
                <FaShoppingCart className="mr-2" /> Confirm Order
              </button>
              <button
                onClick={() => navigate("/products")}
                className="btn bg-slate-500 text-white hover:bg-slate-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultipleItems;
