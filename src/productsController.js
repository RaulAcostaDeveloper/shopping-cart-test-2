'use client'
import { createContext, useEffect, useState } from "react"
import { getData, getIMGURL } from "./ApiCalls/GetData";
import { normalizadorDeArrayDeProductos } from "./Utilities/normalizadorDeProductos";

export const ProductsContext = createContext();
export const ProductsController = ({ children }) => {
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
                setProductsState(normalizado);
                setIsError(false);
            } else {
                setIsError(true);
            }
            setIsLoading(false);
        })();
    }, []);

    useEffect(()=>{
        // Ocupo ir viendo que se actualice bien el estado de los productos
        console.log('productsState ', productsState);
    },[productsState]);
    return (
        <ProductsContext.Provider value={{ productsState, isLoading, isError }}>
            {children}
        </ProductsContext.Provider>
    )
}