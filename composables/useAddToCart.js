import { useCartStore } from "@/stores/cart";
import { toast } from "vue3-toastify";

export function useAddToCart() {
  const cart = useCartStore();

  const addProduct = ({ title, icon, options, price }) => {
    cart.addToCart({
      title,
      icon,
      options,
      price,
    });
    toast.success(`Товар «${title}» добавлен в корзину!`);
  };

  return {
    addProduct,
  };
}
