import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { createOrder } from "@/api";
import restaurantInfo from "@/data/restaurant";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

/**
 * Checkout page implementing form validation using react-hook-form.
 * The form collects the customer's name, phone number, optional
 * comment and chosen payment method.  When the user submits the
 * form an order is created via the backend API.  A confirmation
 * modal is shown on success and the cart is cleared.
 */
export function meta() {
  return [{ title: `Оформление заказа | ${restaurantInfo.name}` }];
}

interface FormInputs {
  name: string;
  phone: string;
  comment?: string;
  paymentMethod: "card" | "cash";
}

export default function CheckoutPage() {
  const { items, totalAmount, totalCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInputs>({
    defaultValues: {
      name: user?.displayName || "",
      phone: "",
      comment: "",
      paymentMethod: "card"
    }
  });

  if (items.length === 0) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Корзина пуста</h1>
        <p className="text-gray-600">
          Сначала добавьте блюда в заказ из{" "}
          <Link to="/menu" className="text-green-600 underline">
            меню
          </Link>
          .
        </p>
      </div>
    );
  }

  const onSubmit = async (data: FormInputs) => {
    setIsProcessing(true);
    try {
      setSubmittedName(data.name);
      setSubmittedPhone(data.phone);
      await createOrder({
        uid: user?.uid,
        items,
        totalAmount,
        totalCount,
        name: data.name,
        phone: data.phone,
        comment: data.comment,
        paymentMethod: data.paymentMethod
      });
      setIsModalOpen(true);
    } catch (error) {
      alert("Не удалось оформить заказ. Попробуйте ещё раз.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    clearCart();
    // After successful order redirect the user to their orders page
    navigate("/orders");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Оформление заказа</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Имя
          </label>
          <input
            type="text"
            {...register("name", { required: "Введите имя" })}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          {errors.name && (
            <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Телефон
          </label>
          <input
            type="tel"
            {...register("phone", { required: "Введите телефон" })}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          {errors.phone && (
            <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Комментарий к заказу
          </label>
          <textarea
            rows={3}
            {...register("comment")}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          ></textarea>
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-700">
            Способ оплаты
          </span>
          <div className="mt-1 flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="card"
                {...register("paymentMethod")}
                className="mr-2"
                defaultChecked
              />
              Картой
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="cash"
                {...register("paymentMethod")}
                className="mr-2"
              />
              Наличными
            </label>
          </div>
        </div>
        <div className="border-t pt-4 space-y-2">
          {items.map((ci) => (
            <div
              key={ci.menuItem.id}
              className="flex justify-between text-sm"
            >
              <span>
                {ci.menuItem.name} × {ci.quantity}
              </span>
              <span>
                {(ci.menuItem.price * ci.quantity).toFixed(2)} ₽
              </span>
            </div>
          ))}
          <div className="flex justify-between font-bold">
            <span>Итого</span>
            <span>{totalAmount.toFixed(2)} ₽</span>
          </div>
        </div>
        <Button type="submit" disabled={isProcessing}>
          {isProcessing ? "Обработка..." : "Подтвердить заказ"}
        </Button>
      </form>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Спасибо за заказ!"
      >
        <p className="mb-4">
          {submittedName}, ваш заказ на сумму {totalAmount.toFixed(2)} ₽ успешно
          оформлен. Мы свяжемся с вами по номеру {submittedPhone}.
        </p>
        <Button onClick={handleCloseModal}>Закрыть</Button>
      </Modal>
    </div>
  );
}