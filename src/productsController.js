'use client'
import { createContext, useEffect, useState } from "react"
import { getData, getIMGURL } from "./ApiCalls/GetData";
import { normalizadorDeArrayDeProductos } from "./Utilities/normalizadorDeProductos";

// High order component
export const ProductsContext = createContext();
export const ProductsController = ({ children }) => {

    // Se puede controlar el carrito desde aquí y no es necesario crear un controller separado
    const [cartState, setCartState] = useState([]);
    const [productsState, setProductsState] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        // Normalizar el arreglo
        (async () => {
            setIsLoading(true);
            const productsResponse = await getData('http://localhost:3000/products');
            const pricesResponse = await getData('http://localhost:3000/prices');
            const stockResponse = await getData('http://localhost:3000/stock');
            const tShirtUrl = await getIMGURL('http://localhost:3000/images/t-shirt.jpg');
            const poloShirtUrl = await getIMGURL('http://localhost:3000/images/polo-shirt.jpg');
            const buttonDownShirtUrl = await getIMGURL('http://localhost:3000/images/button-down-shirt.jpg');
            const hoodieUrl = await getIMGURL('http://localhost:3000/images/hoodie.jpg');

            // NOTA: Los precios que devuelve el servicio no respetan la lógica de (s > m > l)
            if (productsResponse && pricesResponse && stockResponse && tShirtUrl && poloShirtUrl && buttonDownShirtUrl && hoodieUrl) {

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

                // Inicialización del carrito
                inicializarCarrito(normalizado);
                setProductsState(normalizado);
                setIsError(false);
            } else {
                setIsError(true);
            }
            setIsLoading(false);
        })();
    }, []);

    // Ocupo ir viendo que se actualice bien el estado del carrito y los productos
    useEffect(() => {
        console.log('productsState update ', productsState);
    }, [productsState]);

    useEffect(()=>{
        console.log('cartState update ', cartState);
    },[cartState]);

    const modificarCarrito = (code, size, quantity, operation) => {

        // Con el objetivo de poder restar stock al añadir al carrito
        // Y también poder "regresar" stock al quitar del carrito
        // El carrito y los productos comparten index por su code
        const indexProducto = productsState.findIndex(item => item.code === code);

        // Si el producto no se encuentra, salir de la función
        if (indexProducto === -1) return;

        // Modificar un clon del arreglo
        const newProductState = [...productsState];
        const newCart = [...cartState];

        // Habrá que tener cuidado de que no sea posible pasarte de la cantidad inicial obtenida por la API
        const stockTypes = {
            'S': 'sStock',
            'M': 'mStock',
            'L': 'lStock'
        };

        if (stockTypes[size]) {
            const stockType = stockTypes[size];

            // al sumar al carrito, resta a los productos
            if (operation === "suma") {
                newProductState[indexProducto].stocks[stockType] -= quantity;
                newCart[indexProducto].stocks[stockType] += quantity;
            } else if (operation === "resta") {
                newProductState[indexProducto].stocks[stockType] += quantity;
                newCart[indexProducto].stocks[stockType] -= quantity;
            }
        }

        // Actualizar el valor de productsState
        setProductsState(newProductState);

        // Actualizar el valor del carrito
        setCartState(newCart);
    }

    const inicializarCarrito = (array) => {
        // Ya que tenemos los productos inicializados, inicializaremos a 0 todos los stock, porque este es es carrito
        // OJO puede que después regrese para ponerle el precio en caso que lo requiera
        const newArray = array.map(item => ({
        code: item.code,
        stocks: {
            sStock: 0,
            mStock: 0,
            lStock: 0
        }
    }));
        setCartState(newArray);
    }
    return (
        <ProductsContext.Provider value={{ productsState, cartState, isLoading, isError, modificarCarrito}}>
            {children}
        </ProductsContext.Provider>
    )
}