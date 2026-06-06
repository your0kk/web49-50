import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getOrders } from "@/api";
import { Link } from "react-router";
import restaurantInfo from "@/data/restaurant";
import type { CartItem } from "@/types";

/**
 * Orders page displays a list of the user's previous orders.  If the
 * user is not authenticated they are prompted to log in.  When
 * there are no orders a friendly message is shown with a link back
 * to the menu.  Orders are fetched from the backend using the
 * `getOrders()` function defined in api.ts.
 */
export function meta() {
  return [{ title: `Мои заказы | ${restaurantInfo.name}` }];
}

interface Order {
  id: string;
  created_at: string;
  items: CartItem[];
  totalAmount: number;
}

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setFetching(true);
      try {
        const data = await getOrders(user.uid);
        setOrders(data as Order[]);
      } catch (error) {
        console.error(error);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [user]);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (!user) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Мои заказы</h1>
        <p>Для просмотра заказов необходимо войти.</p>
        <Link to="/auth" className="text-green-600 underline">
          Войти
        </Link>
      </div>
    );
  }

  if (fetching) {
    return <p>Загрузка заказов...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Мои заказы</h1>
        <p>У вас пока нет заказов.</p>
        <Link to="/menu" className="text-green-600 underline">
          Перейти в меню
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Мои заказы</h1>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="rounded-md bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleString("ru-RU")}
            </p>
            <ul className="mt-2 text-sm">
              {order.items.map((ci) => (
                <li key={ci.menuItem.id}>
                  {ci.menuItem.name} × {ci.quantity}
                </li>
              ))}
            </ul>
            <p className="font-bold mt-2">
              Итого: {order.totalAmount.toFixed(2)} ₽
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}