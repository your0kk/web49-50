import { type RouteConfig, index, route } from "@react-router/dev/routes";

// Центральная конфигурация маршрутов приложения. Каждый маршрут
// связывает адрес в браузере с конкретным файлом страницы из папки app/routes.
export default [
  index("routes/home.tsx"),
  route("menu", "routes/menu.tsx"),
  route("cart", "routes/cart.tsx"),
  route("checkout", "routes/checkout.tsx"),
  route("about", "routes/about.tsx"),
  route("auth", "routes/auth.tsx"),
  route("orders", "routes/orders.tsx"),
] satisfies RouteConfig;