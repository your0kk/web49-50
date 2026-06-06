import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import restaurantInfo from "@/data/restaurant";

/**
 * Authentication page for login and registration.  The component
 * uses react-hook-form to manage form state and validation.  It
 * toggles between login and registration modes and calls the
 * appropriate method from the authentication context.  On
 * successful login or registration the user is redirected to the
 * home page.
 */
export function meta() {
  return [{ title: `Авторизация | ${restaurantInfo.name}` }];
}

interface FormData {
  email: string;
  password: string;
}

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      if (isLogin) {
        await signIn(data.email, data.password);
      } else {
        await signUp(data.email, data.password);
      }
      navigate("/");
    } catch (error: any) {
      // Display the error message returned by Firebase (if any)
      alert(error.message || "Ошибка авторизации");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{isLogin ? "Вход" : "Регистрация"}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register("email", { required: "Введите email" })}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          {errors.email && (
            <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Пароль</label>
          <input
            type="password"
            {...register("password", {
              required: "Введите пароль",
              minLength: { value: 6, message: "Минимум 6 символов" }
            })}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          {errors.password && (
            <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600">
        {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-green-600 underline"
        >
          {isLogin ? "Зарегистрируйтесь" : "Войдите"}
        </button>
      </p>
    </div>
  );
}