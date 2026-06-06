import { Link, NavLink } from "react-router";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

/**
 * Top navigation bar with cart count and authentication links.  In
 * addition to the default navigation items the header shows a
 * dynamic badge with the current cart count and displays login and
 * logout links depending on the authentication state.  Authenticated
 * users also see a link to their orders page.
 */
export default function Header() {
  const { totalCount } = useCart();
  const { user, signOutUser } = useAuth();

  return (
    <header className="bg-white shadow-sm text-gray-800">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3 max-w-4xl">
        <Link to="/" className="text-2xl font-bold text-green-600">
          Вкусно и точка
        </Link>
        <ul className="flex space-x-4 items-center">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `hover:text-green-600 ${isActive ? "text-green-600 font-semibold" : ""}`
              }
            >
              Главная
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/menu"
              className={({ isActive }) =>
                `hover:text-green-600 ${isActive ? "text-green-600 font-semibold" : ""}`
              }
            >
              Меню
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `relative hover:text-green-600 ${isActive ? "text-green-600 font-semibold" : ""}`
              }
            >
              Корзина
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-3 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-green-600 px-1 text-xs font-bold text-white">
                  {totalCount}
                </span>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `hover:text-green-600 ${isActive ? "text-green-600 font-semibold" : ""}`
              }
            >
              О нас
            </NavLink>
          </li>
          {/* Orders link is visible regardless of authentication; the
              Orders page itself checks if the user is logged in. */}
          <li>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `hover:text-green-600 ${isActive ? "text-green-600 font-semibold" : ""}`
              }
            >
              Заказы
            </NavLink>
          </li>
        </ul>
        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <span className="text-sm text-gray-700">
                {user.email || user.displayName}
              </span>
              <button
                onClick={signOutUser}
                className="text-green-600 underline text-sm"
              >
                Выйти
              </button>
            </>
          ) : (
            <NavLink
              to="/auth"
              className={({ isActive }) =>
                `hover:text-green-600 ${isActive ? "text-green-600 font-semibold" : ""}`
              }
            >
              Войти
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}