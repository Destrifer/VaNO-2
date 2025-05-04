import { useCartStore } from "@/stores/cart";

export function useAddToCart() {
  const cart = useCartStore();

  const addProduct = ({ title, icon, options, price }) => {
    cart.addToCart({
      title,
      icon,
      options,
      price,
    });
    alert("Товар добавлен в корзину!");
  };

  return {
    addProduct,
  };
}
