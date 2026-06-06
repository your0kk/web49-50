import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("menu", "routes/menu.tsx"),
  route("cart", "routes/cart.tsx"),
  route("checkout", "routes/checkout.tsx"),
  route("about", "routes/about.tsx"),
  route("auth", "routes/auth.tsx"),
  route("orders", "routes/orders.tsx"),
] satisfies RouteConfig;
