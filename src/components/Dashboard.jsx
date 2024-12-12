import Header from "./Header";
import CategorySection from "./CategorySection";
import ProductCard from "./ProductCard";
import Footer from "./Footer";

const bannerItems = [
  {
    id: 1,
    image: "https://via.placeholder.com/300x200",
    alt: "Fresh Vegetables",
    title: "Fresh Vegetables",
    description: "Get farm-fresh vegetables delivered to your doorstep",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/300x200",
    alt: "Organic Fruits",
    title: "Organic Fruits",
    description: "Enjoy the sweetness of nature with our organic fruits",
  },
  {
    id: 3,
    image: "https://via.placeholder.com/300x200",
    alt: "Daily Essentials",
    title: "Daily Essentials",
    description: "Stock up on your daily essentials with great discounts",
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="px-5">
        <div className="container mx-auto px-4 py-7">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bannerItems.map((item) => (
              <div
                key={item.id}
                className="relative h-[200px] overflow-hidden rounded-lg md:h-[300px]"
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 p-4 text-center text-white">
                  <h2 className="mb-2 text-2xl font-bold md:text-3xl">
                    {item.title}
                  </h2>
                  <p className="text-sm md:text-base">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <CategorySection />
        <section className="bg-green-400 mb-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-between gap-8 md:flex-row p-5">
              <div className="text-center md:text-left">
                <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                  We Deliver your
                  <br />
                  Grocery in 24 Hours
                </h2>
                <button className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-green-500 transition-transform hover:scale-105">
                  Order Now
                </button>
              </div>
              <div className="w-full max-w-md md:w-1/2">
                <img
                  src="img.png"
                  alt="Delivery Person on Scooter"
                  className="w-full object-contain"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
