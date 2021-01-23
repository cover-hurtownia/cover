import useLocalStorage from "/js/preact/hooks/useLocalStorage.js";

export const useShoppingCart = () => {
    const [cart, setCart] = useLocalStorage("shopping_cart", {});

    const setQuantity = (id, quantity) => {
        if (quantity <= 0 && cart.hasOwnProperty(id)) {
            delete cart[id];
        }
        else {
            cart[id] = quantity;
        }

        setCart({ ...cart });
    };

    return {
        products: cart,
        set: (id, quantity = 1) => setQuantity(id, quantity),
        add: (id, quantity = 1) => setQuantity(id, cart.hasOwnProperty(id) ? cart[id] + quantity : quantity),
        remove: (id, quantity = 1) => setQuantity(id, cart.hasOwnProperty(id) ? cart[id] - quantity : 0),
        removeAll: id => setQuantity(id, 0)
    };
};

export default useShoppingCart;