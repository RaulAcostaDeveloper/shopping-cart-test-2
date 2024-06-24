'use client'
import { createContext, useEffect, useState } from "react"
import { getData, getIMGURL } from "./ApiCalls/GetData";
import { normalizadorDeArrayDeProductos } from "./Utilities/normalizadorDeProductos";
import { normalizadorDelCarrito } from "./Utilities/normalizadorDelCarrito";
import { Header } from "./Components/header";
import { IsError } from "./Components/isError";

// Puse este parche porque necesito los valores iniciales, pero algo está modificando directamente el estado de initialProductData
const deepFreeze = (object) => {
    Object.freeze(object);
    Object.keys(object).forEach((key) => {
        if (typeof object[key] === 'object' && !Object.isFrozen(object[key])) {
            deepFreeze(object[key]);
        }
    });
    return object;
};

// High order component
export const ProductsContext = createContext();
export const ProductsController = ({ children }) => {

    // Se puede controlar el carrito desde aquí y no es necesario crear un controller separado
    const [cartState, setCartState] = useState([]);
    const [productsState, setProductsState] = useState([]);

    // Por la necesidad de traer de nuevo el valor del stock inicial al borrar cualquiér item del carrito
    const [initialProductData, setInitialProductData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialError, setIsInitialError] = useState(true);

    // Voy a dejar estos logs para poder controlarlo, pero en produccción no deben estar
    useEffect(() => {
        console.log('cartState ', cartState);
    }, [cartState]);

    useEffect(() => {
        console.log('productsState ', productsState);
    }, [productsState]);

    useEffect(() => {
        console.log('initialProductData ', initialProductData);
    }, [initialProductData]);

    useEffect(() => {
        // Nota respecto al bug de la primera compilación, no entra al primer render.

        // Una vez que recargó la página por primera vez, ya puede continuar.
        // Normalizar el arreglo
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const productsResponse = await getData('http://localhost:3000/products');
                const pricesResponse = await getData('http://localhost:3000/prices');
                const stockResponse = await getData('http://localhost:3000/stock');
                const tShirtUrl = await getIMGURL('http://localhost:3000/images/t-shirt.jpg');
                const poloShirtUrl = await getIMGURL('http://localhost:3000/images/polo-shirt.jpg');
                const buttonDownShirtUrl = await getIMGURL('http://localhost:3000/images/button-down-shirt.jpg');
                const hoodieUrl = await getIMGURL('http://localhost:3000/images/hoodie.jpg');

                // NOTA: Los precios que devuelve el servicio no respetan la lógica de (s > m > l)
                if (productsResponse && pricesResponse && stockResponse && tShirtUrl && poloShirtUrl && buttonDownShirtUrl && hoodieUrl) {
                    
                    // Nueva inicialización del carrito
                    inicializarCarrito(productsResponse, pricesResponse, stockResponse);

                    // Normalizar el arreglo de productos para poder usarlo en base a los requerimientos y los resultados del servicio
                    const normalizado = normalizadorDeArrayDeProductos(productsResponse, pricesResponse, stockResponse);

                    // A cada CODE le corresponde una imágen, por eso hago la asignación después de la normalización
                    const modelToUrlMap = {
                        't-shirt': tShirtUrl,
                        'polo shirt': poloShirtUrl,
                        'button-down shirt': buttonDownShirtUrl,
                        'hoodie': hoodieUrl
                    };

                    // Añadir urlImg a cada objeto del arreglo finalProducts
                    normalizado.forEach(product => {
                        product.urlImg = modelToUrlMap[product.model] || '';
                    });

                    setInitialProductData(normalizado);
                    setProductsState(normalizado);
                    setIsInitialError(false);
                } else {
                    setIsInitialError(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsInitialError(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const inicializarCarrito = (productsResponse, pricesResponse, stockResponse) => {

        // Ya que tenemos los productos inicializados, inicializaremos a 0 todos los stock, porque este es es carrito
        // OJO puede que después regrese para ponerle el precio en caso que lo requiera
        const normalizado = normalizadorDelCarrito(productsResponse, pricesResponse, stockResponse);
        setCartState(normalizado);
    }

    const modificarArrayDeProductos = (code, size, quantity, operation) => {

        // Con el objetivo de poder restar stock al añadir al carrito
        // Y también poder "regresar" stock al quitar del carrito
        const indexByCode = productsState.findIndex(item => item.code === code);

        // Si el producto no se encuentra, salir de la función
        if (indexByCode === -1) return;

        // Modificar un clon del arreglo
        const newProductState = [...productsState];

        // Verificar que no sea posible pasarte de la cantidad inicial obtenida por la API
        const stockTypes = {
            'S': 'sStock',
            'M': 'mStock',
            'L': 'lStock'
        };

        if (stockTypes[size]) {
            const stockType = stockTypes[size];

            // Por alguna razón, el valor de initialProductData es modificado durante esta ejecución, pero puedo hacer que su copia initialData se queda intacta
            const initialData = deepFreeze(JSON.parse(JSON.stringify(initialProductData)));

            // al sumar al carrito, resta a los productos
            if (operation === "suma") {
                newProductState[indexByCode].stocks[stockType] -= quantity;
            } else if (operation === "update") {
                newProductState[indexByCode].stocks[stockType] = initialData[indexByCode].stocks[stockType] - quantity;
            } else if (operation === "elimina") {
                // Retornar a su valor inicial
                newProductState[indexByCode].stocks[stockType] = initialData[indexByCode].stocks[stockType];
            }

            // Logré que la copia del estado se quede intacta pero el estado se modifica por algúna razón
            // Así que regreso su valor. No debería porqué pasar esto pero si paso.
            setInitialProductData(initialData);
        }
        // Actualizar el valor de productsState
        setProductsState(newProductState);
    }

    const modificarCarrito = (code, size, quantity, operation) => {
        modificarArrayDeProductos(code, size, quantity, operation);

        const newCart = [...cartState];

        // Encontrar el objeto correspondiente en el arreglo
        const index = newCart.findIndex(item => item.code === code && item.size === size);

        newCart[index].stock
        // al sumar al carrito, resta a los productos
        if (operation === "suma") {
            newCart[index].stock += quantity;
        } else if (operation === "update") {
            newCart[index].stock = quantity;
        } else if (operation === "elimina") { // Al darle a la X en el botón del elemento del carrito
            newCart[index].stock = 0;
        }
        setCartState(newCart);
    }

    return (
        <ProductsContext.Provider value={{ productsState, initialProductData, cartState, isLoading, modificarCarrito }}>
            <Header />
            {isInitialError && <IsError/>}
            {children}
        </ProductsContext.Provider>
    )
}