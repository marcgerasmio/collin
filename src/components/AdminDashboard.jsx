import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-md">
        <div className="container mx-auto flex h-21 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <img src="logo.png" alt="Grocery Store" className="h-18 w-44" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar focus:outline-none"
                aria-haspopup="true"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="User Avatar"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <Link to="/">
                  <li>
                    <button className="text-left w-full">Logout</button>
                  </li>
                </Link>
              </ul>
            </div>
            <p className="font-bold">Admin</p>
          </div>
        </div>
      </header>
    </>
  );
}