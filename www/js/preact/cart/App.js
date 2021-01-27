import * as Preact from "/js/lib/Preact.js";
import { useState, useEffect, useRef } from "/js/lib/PreactHooks.js";

import * as API from "/js/api/index.js";
import * as utils from "/js/utils.js";
import Product from "/js/preact/cart/components/Product.js";
import useShoppingCart from "/js/preact/hooks/useShoppingCart.js";
import * as modal from "/js/modal.js";

const h = Preact.h;

export const CartApp = _ => {
    const shoppingCart = useShoppingCart();
    const [cachedProducts, setCachedProducts] = useState({});
    const [deliveryTypes, setdeliveryTypes] = useState(null);
    const [isOrdering, setOrdering] = useState(false);
    
    const [form, setForm] = useState({});
    
    const setField = (field, value) => setForm({ ...form, [field]: value });
    const getField = field => form[field];

    const emailRef = useRef(null);
    const phoneNumberRef = useRef(null);
    const postalCodeRef = useRef(null);
    
    const cantBeEmptyValidator = (field, help) => {
        const fieldValue = getField(field);

        if (fieldValue === undefined || fieldValue.length === 0) return help;
        else return false;
    };

    const formValidationErrors = {
        firstName: cantBeEmptyValidator("firstName", "imię nie może być puste"),
        lastName: cantBeEmptyValidator("lastName", "nazwisko nie może być puste"),
        address: cantBeEmptyValidator("address", "adres nie może być pusty"),
        city: cantBeEmptyValidator("city", "miejscowość nie może być pusta"),
        postalCode: (() => {
            if (postalCodeRef.current) {
                if (postalCodeRef.current.validity.valueMissing) return "kod pocztowy nie może być pusty";
                else if (postalCodeRef.current.validity.patternMismatch) return "kod pocztowy nie jest poprawny (musi spełniać format XX-XXX)";
                else return false;
            }
            else return "błąd formularza";
        })(),
        email: (() => {
            if (emailRef.current) {
                if (emailRef.current.validity.valueMissing) return "email nie może być pusty";
                else if (emailRef.current.validity.typeMismatch) return "email nie jest poprawny";
                else return false;
            }
            else return "błąd formularza";
        })(),
        phoneNumber: (() => {
            if (phoneNumberRef.current) {
                if (phoneNumberRef.current.validity.valueMissing) return "numer telefonu nie może być pusty";
                else if (phoneNumberRef.current.validity.patternMismatch) return "numer telefonu nie jest poprawny (musi spełniać format XXXXXXXXX)";
                else return false;
            }
            else return "błąd formularza";
        })(),
        deliveryType: getField("deliveryType") ? false : "wybierz metodę wysyłki",
        termsOfService: getField("termsOfService") ? false : "wymagana akceptacja regulaminu",
        privacyPolicy: getField("privacyPolicy") ? false : "wymagana akceptacja polityki prywatności"
    };

    const isFormCorrect = Object.values(formValidationErrors).reduce((correct, error) => correct ? !error : correct, true);
    const formProgress = Object.values(formValidationErrors).reduce((sum, error) => error ? sum : sum + 1, 0) / Object.keys(formValidationErrors).length;
    
    useEffect(async () => {
        const responses = await Promise.all(Object.keys(shoppingCart.products).map(id => {
            if (cachedProducts.hasOwnProperty(id) && cachedProducts[id].status === "ok") return Promise.resolve({ id, response: cachedProducts[id] });
            else return API.products.getById(id).then(response => ({ id, response }));
        }));

        for (const { id, response } of responses) {
            cachedProducts[id] = response;
        }

        setCachedProducts({ ...cachedProducts });
    }, [shoppingCart.products]);

    useEffect(async () => {
        setdeliveryTypes(await API.deliveryTypes.get());
    }, []);

    const productsCost = Object.entries(shoppingCart.products).flatMap(([id, quantity]) => {
        if (cachedProducts.hasOwnProperty(id) && cachedProducts[id].status === "ok") {
            return [cachedProducts[id].data.price * quantity];
        }
        else return [];
    }).reduce((a, b) => a + b, 0);

    const placeOrder = async () => {
        setOrdering(true);

        const response = await API.orders.placeOrder({
            "first_name": getField("firstName"),
            "last_name": getField("lastName"),
            "phone_number": getField("phoneNumber"),
            "email": getField("email"),
            "address": getField("address"),
            "apartment": getField("apartment"),
            "city": getField("city"),
            "postal_code": getField("postalCode"),
            "delivery_type_id": getField("deliveryType"),
            "products": Object.entries(shoppingCart.products).map(([id, quantity]) => ({ id: Number(id), quantity: Number(quantity) })),
            "comment": getField("comment")
        });

        if (response.status === "ok") {
            modal.showMessage("Sukces", `Zamówienie #${response.id} zostało złożone pomyślnie.`, "is-success", [
                {
                    classList: [],
                    textContent: "Przejdź do strony głównej",
                    onClick: _ => window.location = "/"
                }
            ]);
            shoppingCart.clear();
        }
        else {
            modal.showMessage("Błąd", utils.capitalizeFirst(response.error.userMessage) + ".", "is-danger");
            console.error(response.error.devMessage);
        }

        setOrdering(false);
    };

    return h("div", {}, [
        h("h1", { className: "title" }, "Koszyk"),
        h("div", { className: "" }, [
            Object.keys(shoppingCart.products).length === 0
                ? h("div", { className: "notification is-warning" }, "Koszyk jest pusty.")
                : [
                    h("div", { className: "columns is-hidden-mobile" }, [
                        h("div", { className: "column is-1" }),
                        h("div", { className: "column is-5" }, h("span", { className: "subtitle" }, "Produkt")),
                        h("div", { className: "column is-3" }, h("span", { className: "subtitle" }, "Ilość")),
                        h("div", { className: "column is-3" }, h("span", { className: "subtitle" }, "Cena"))
                    ]),
                    h("div", { className: "block" }, [
                        Object.keys(shoppingCart.products).map(id => h(Product, { productId: id, response: cachedProducts[id] }))
                    ]),
                    h("progress", { className: `progress is-large ${formProgress === 1.0 ? "is-success" : "is-danger"}`, value: (formProgress * 100.0).toString(), max: "100" }),
                    h("div", { className: "columns" }, [
                        h("div", { className: "column is-8" }, [
                            h("div", { className: "box" }, [
                                h("div", { className: "title" }, "Dane zamawiającego"),
                                h("div", { className: "columns" }, [
                                    h("div", { className: "column" }, [
                                        h("div", { className: "field" }, [
                                            h("label", { className: "label" }, "Imię"),
                                            h("div", { className: "control" }, [
                                                h("input", {
                                                    className: "input" + (formValidationErrors.firstName ? " is-danger" : " is-success"),
                                                    type: "text",
                                                    placeholder: "Jan",
                                                    required: true,
                                                    value: getField("firstName"),
                                                    onchange: event => setField("firstName", event.target.value)
                                                })
                                            ]),
                                            formValidationErrors.firstName
                                                ? h("p", { className: "help is-danger" }, formValidationErrors.firstName)
                                                : []
                                        ])
                                    ]),
                                    h("div", { className: "column" }, [
                                        h("div", { className: "field" }, [
                                            h("label", { className: "label" }, "Nazwisko"),
                                            h("div", { className: "control" }, [
                                                h("input", {
                                                    className: "input" + (formValidationErrors.lastName ? " is-danger" : " is-success"),
                                                    type: "text",
                                                    placeholder: "Kowalski",
                                                    required: true,
                                                    value: getField("lastName"),
                                                    onchange: event => setField("lastName", event.target.value)
                                                })
                                            ]),
                                            formValidationErrors.lastName
                                                ? h("p", { className: "help is-danger" }, formValidationErrors.lastName)
                                                : []
                                        ])
                                    ])
                                ]),
                                h("div", { className: "columns" }, [
                                    h("div", { className: "column is-8" }, [
                                        h("div", { className: "field" }, [
                                            h("label", { className: "label" }, "Ulica/adres"),
                                            h("div", { className: "control" }, [
                                                h("input", {
                                                    className: "input" + (formValidationErrors.address ? " is-danger" : " is-success"),
                                                    type: "text",
                                                    placeholder: "Ulica/adres",
                                                    required: true,
                                                    value: getField("address"),
                                                    onchange: event => setField("address", event.target.value)
                                                })
                                            ]),
                                            formValidationErrors.address
                                                ? h("p", { className: "help is-danger" }, formValidationErrors.address)
                                                : []
                                        ])
                                    ]),
                                    h("div", { className: "column is-4" }, [
                                        h("div", { className: "field" }, [
                                            h("label", { className: "label" }, "Nr domu/lokalu"),
                                            h("div", { className: "control" }, [
                                                h("input", {
                                                    className: "input",
                                                    type: "text",
                                                    placeholder: "Nr domu/lokalu",
                                                    value: getField("apartment"),
                                                    onchange: event => setField("apartment", event.target.value)
                                                })
                                            ])
                                        ])
                                    ])
                                ]),
                                h("div", { className: "columns" }, [
                                    h("div", { className: "column is-4" }, [
                                        h("div", { className: "field" }, [
                                            h("label", { className: "label" }, "Kod pocztowy"),
                                            h("div", { className: "control" }, [
                                                h("input", {
                                                    ref: postalCodeRef,
                                                    className: "input" + (formValidationErrors.postalCode ? " is-danger" : " is-success"),
                                                    type: "text",
                                                    placeholder: "Kod pocztowy (XX-XXX)",
                                                    required: true,
                                                    pattern: "[0-9]{2}-[0-9]{3}",
                                                    value: getField("postalCode"),
                                                    onchange: event => setField("postalCode", event.target.value)
                                                })
                                            ]),
                                            formValidationErrors.postalCode
                                                ? h("p", { className: "help is-danger" }, formValidationErrors.postalCode)
                                                : []
                                        ])
                                    ]),
                                    h("div", { className: "column is-8" }, [
                                        h("div", { className: "field" }, [
                                            h("label", { className: "label" }, "Miejscowość"),
                                            h("div", { className: "control" }, [
                                                h("input", {
                                                    className: "input" + (formValidationErrors.city ? " is-danger" : " is-success"),
                                                    type: "text",
                                                    placeholder: "Miejscowość",
                                                    required: true,
                                                    value: getField("city"),
                                                    onchange: event => setField("city", event.target.value)
                                                })
                                            ]),
                                            formValidationErrors.city
                                                ? h("p", { className: "help is-danger" }, formValidationErrors.city)
                                                : []
                                        ])
                                    ])
                                ]),
                                h("div", { className: "columns" }, [
                                    h("div", { className: "column is-6" }, [
                                        h("div", { className: "field" }, [
                                            h("label", { className: "label" }, "Adres e-mail"),
                                            h("div", { className: "control" }, [
                                                h("input", {
                                                    ref: emailRef,
                                                    className: "input" + (formValidationErrors.email ? " is-danger" : " is-success"),
                                                    type: "email",
                                                    placeholder: "Email (jan@kowalski.pl)",
                                                    required: true,
                                                    value: getField("email"),
                                                    onchange: event => setField("email", event.target.value)
                                                })
                                            ]),
                                            formValidationErrors.email
                                                ? h("p", { className: "help is-danger" }, formValidationErrors.email)
                                                : []
                                        ])
                                    ]),
                                    h("div", { className: "column is-6" }, [
                                        h("div", { className: "field" }, [
                                            h("label", { className: "label" }, "Numer telefonu"),
                                            h("div", { className: "control" }, [
                                                h("input", {
                                                    ref: phoneNumberRef,
                                                    className: "input" + (formValidationErrors.phoneNumber ? " is-danger" : " is-success"),
                                                    type: "tel",
                                                    pattern: "[0-9]{9}",
                                                    placeholder: "Numer telefonu (XXXXXXXXX)",
                                                    required: true,
                                                    value: getField("phoneNumber"),
                                                    onchange: event => setField("phoneNumber", event.target.value)
                                                })
                                            ]),
                                            formValidationErrors.phoneNumber
                                                ? h("p", { className: "help is-danger" }, formValidationErrors.phoneNumber)
                                                : []
                                        ])
                                    ])
                                ])
                            ]),
                            h("div", { className: "box" }, [
                                h("div", { className: "title" }, "Metoda wysyłki"),
                                deliveryTypes !== null
                                    ? deliveryTypes.status === "ok"
                                        ? h("div", {}, [
                                            deliveryTypes.data.map(({ id, type, price }) => [
                                                h("div", { className: "control" + (id === getField("deliveryType") ? " is-size-4" : " is-size-6") }, [
                                                    h("div", { className: "columns" }, [
                                                        h("div", { className: "column is-half" }, [
                                                            h("label", { className: "radio" }, [
                                                                h("input", {
                                                                    type: "radio",
                                                                    name: "deliveryType",
                                                                    value: id,
                                                                    required: true,
                                                                    onchange: event => setField("deliveryType", Number(event.target.value))
                                                                }),
                                                                " ",
                                                                h("span", {}, utils.showDelivery(type))
                                                            ])
                                                        ]),
                                                        h("div", { className: "column is-half" }, [
                                                            h("span", { className: "has-text-weight-bold" }, `+${utils.showPrice(price)}`)
                                                        ])
                                                    ])
                                                ])
                                            ]),
                                            formValidationErrors.deliveryType
                                                ? h("p", { className: "help is-danger" }, formValidationErrors.deliveryType)
                                                : []
                                        ])
                                        : h("article", { className: "message is-danger" }, [
                                            h("div", { className: "message-body" }, [
                                                h("details", {}, [
                                                    h("summary", {}, `Błąd: ${utils.capitalizeFirst(deliveryTypes.error.userMessage)}.`),
                                                    h("p", {}, `${utils.capitalizeFirst(deliveryTypes.error.devMessage)}.`)
                                                ])
                                            ])
                                        ])
                                    : h("article", { className: "message" }, [
                                        h("div", { className: "message-body" }, [
                                            "Pobieranie metod wysyłki..."
                                        ])
                                    ])
                            ]),
                            h("div", { className: "box" }, [
                                h("div", { className: "title" }, "Zgody"),
                                h("div", {}, [
                                    h("label", { className: "checkbox" }, [
                                        h("input", {
                                            type: "checkbox",
                                            required: true,
                                            className: "mx-2",
                                            onchange: event => setField("termsOfService", event.target.checked)
                                        }),
                                        "Zapoznałem się i akceptuję ",
                                        h("a", { href: "/terms" }, "regulamin serwisu"),
                                        ".",
                                        formValidationErrors.termsOfService
                                            ? h("p", { className: "help is-danger" }, formValidationErrors.termsOfService)
                                            : []
                                    ])
                                ]),
                                h("div", {}, [
                                    h("label", { className: "checkbox" }, [
                                        h("input", {
                                            type: "checkbox",
                                            required: true,
                                            className: "mx-2",
                                            onchange: event => setField("privacyPolicy", event.target.checked)
                                        }),
                                        "Zapoznałem się z ",
                                        h("a", { href: "/privacy" }, "polityką prywatności"),
                                        ".",
                                        formValidationErrors.privacyPolicy
                                            ? h("p", { className: "help is-danger" }, formValidationErrors.privacyPolicy)
                                            : []
                                    ])
                                ])
                            ])
                        ]),
                        h("div", { className: "column is-4" }, [
                            h("div", { className: "box" }, [
                                h("div", { className: "columns m-1" }, [
                                    h("div", { className: "column p-0 is-half" }, h("span", { className: "is-size-5" }, "Produkty:")),
                                    h("div", { className: "column p-0 is-half" }, h("span", { className: "is-size-5" }, utils.showPrice(productsCost)))
                                ]),
                                h("div", { className: "columns m-1" }, [
                                    h("div", { className: "column p-0 is-half" }, h("span", { className: "is-size-5" }, "Wysyłka:")),
                                    h("div", { className: "column p-0 is-half" }, [
                                        (getField("deliveryType") !== undefined && deliveryTypes !== null && deliveryTypes.status === "ok")
                                            ? h("span", { className: "is-size-5" }, [
                                                utils.showPrice(deliveryTypes.data.find(({ id }) => id === getField("deliveryType"))?.price ?? 0)
                                            ])
                                            : h("span", { className: "is-size-5 is-italic has-text-danger" }, "(nie wybrano)")
                                    ])
                                ]),
                                h("div", { className: "columns m-1" }, [
                                    h("div", { className: "column p-0 is-half" }, h("span", { className: "is-size-5 has-text-weight-bold" }, "Razem:")),
                                    h("div", { className: "column p-0 is-half" }, h("span", { className: "is-size-5 has-text-weight-bold" }, utils.showPrice(
                                        productsCost +
                                        (deliveryTypes?.data?.find(({ id }) => id === getField("deliveryType"))?.price ?? 0)
                                    )))
                                ]),
                                h("div", { className: "field" }, [
                                    h("div", { className: "control" }, [
                                        h("textarea", {
                                            className: "textarea is-small",
                                            placeholder: "Opcjonalna wiadomość",
                                            value: getField("comment"),
                                            onchange: event => setField("comment", event.target.value)
                                        })
                                    ])
                                ]),                           
                                h("div", { className: "buttons" }, [
                                    h("input", {
                                        type: "button",
                                        className: "button is-primary is-fullwidth" + (isFormCorrect ? "" : " is-disabled"),
                                        disabled: !isFormCorrect || isOrdering,
                                        value: "Zamawiam",
                                        onclick: _ => placeOrder()
                                    })
                                ]),
                                !isFormCorrect
                                    ? h("article", { className: "message is-danger" }, [
                                        h("div", { className: "message-body" }, "Formularz zawiera błędy.")
                                    ])
                                    : []
                            ])
                        ]),
                        
                    ])
                ]
        ])
    ]);
};

export default CartApp;