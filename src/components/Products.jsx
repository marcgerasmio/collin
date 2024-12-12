import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { FaShoppingCart } from "react-icons/fa";

function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const selectedCategory = sessionStorage.getItem("selectedCategory");
  const userDetails = JSON.parse(sessionStorage.getItem("user"));

  const totalPrice = selectedProduct ? selectedProduct.product_price * quantity : 0;
  const shipping = 5.0;
  const totalAmount = totalPrice + shipping;

  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategory) return;

      try {
        const response = await fetch(
          `http://localhost:1337/api/products?filters[category_name][$eq]=${selectedCategory}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        const result = data.data;
        console.log(result);
        setProducts(result);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const handleQuantityChange = (value) => {
    setQuantity(Math.max(1, value));
  };

  const handleAddToCart = async () => {
    const cartData = {
      data: {
        product_name: selectedProduct.product_name,
        quantity: quantity,
        price: selectedProduct.product_price,
        user_name: userDetails.name, 
        branch_name : selectedProduct.branch_name,
      }
    };

    const jsonString = JSON.stringify(cartData);

    try {
      const response = await fetch("http://localhost:1337/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: jsonString,
      });

      if (response.ok) {
        const data = await response.json();
        alert("Product added to cart!");
        console.log(data);
        setOrderSuccess(true);
      } else {
        const errorData = await response.text(); 
        alert("Failed to add to cart!");
        console.error(errorData);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding to cart!");
    }
  };

  const handleCart = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    console.log(userDetails.name)
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOrderSuccess(false);
  };

  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckout = async (product) => {
    console.log(product)
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    const cartData = {
      data: {
        product_name: product.product_name,
        quantity: quantity,
        total: product.product_price * quantity,
        customer_name: userDetails.name,
        date: formattedDate,
        branch_name : product.branch_name,
      }
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
        alert("Product bought successfully!");
      window.location.reload();
      } else {
        const errorData = await response.text(); 
        alert("Failed to buy product!");
        console.error(errorData);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding to cart!");
    }
  };


  return (
    <>
      <Header />
      <div className="my-4 mx-8 flex justify-between">
        <h1 className="text-bold text-xl mt-2">
          You are currently browsing : {selectedCategory}
        </h1>
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 w-1/4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-5 py-3 mb-10">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-48 w-full object-cover"
            />
            <div className="flex flex-1 flex-col p-4">
              <h3 className="text-lg font-medium overflow-hidden text-ellipsis">
                {product.product_name}
              </h3>
              <span className="text-xl font-bold mb-8">
                ${product.product_price}
              </span>
              <div className="flex flex-col mt-auto gap-2">
                <button
                  onClick={() => handleCart(product)}
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleCheckout(product)}
                  className="flex justify-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-400"
                >
                  <FaShoppingCart className="h-5 w-5" />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />

      {/* Modal for adding to cart */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-3/4 max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              {selectedProduct.product_name}
            </h2>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.product_name}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <p className="text-gray-600 mb-4">Price: ${selectedProduct.product_price}</p>
            <div className="mb-4">
              <label htmlFor="quantity" className="mr-2">
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                className="border rounded p-2 w-20"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleAddToCart}
                className="btn bg-green-500 text-white"
              >
                Add to Cart
              </button>
              <button
                onClick={handleCloseModal}
                className="btn bg-red-500 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-3/4 max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600 mb-4">Your order has been placed successfully. Thank you for shopping with us!</p>
            <button onClick={handleCloseModal} className="btn bg-blue-500 text-white">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Products;
