import useLocalStorage from "/js/preact/hooks/useLocalStorage.js";

export const useShoppingCart = () => {
    const [cart, setCart] = useLocalStorage("shopping_cart", []);

    return {
        products: cart,
        add: (id, quantity = 1) => {
            setCart(cart => [...cart, ...Array(quantity).fill(id)])
        },
        remove: (id, quantity = 1) => {
            const nextCart = [...cart];

            for (let i = 0; i < quantity; ++i) {
                const index = nextCart.findIndex(_ => _ === id);

                if (index !== -1) {
                    nextCart.splice(index, 1);
                }
            }

            setCart(nextCart);
        }
    };
};

export default useShoppingCart;