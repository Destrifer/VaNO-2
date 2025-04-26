import { useCartStore } from "@/stores/cart";

export function useAddToCart() {
  const cart = useCartStore();

  const addProduct = ({ title, options, price }) => {
    cart.addToCart({
      title,
      options,
      price,
    });
    alert("Товар добавлен в корзину!");
  };

  return {
    addProduct,
  };
}
