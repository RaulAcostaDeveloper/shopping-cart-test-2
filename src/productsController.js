'use client'
import { createContext, useEffect, useState } from "react"
import { getData, getIMGURL } from "./ApiCalls/GetData";

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
            console.log('productsResponse ', productsResponse);
            console.log('pricesResponse ', pricesResponse);
            console.log('stockResponse ', stockResponse);
            console.log('tShirtUrl ', tShirtUrl);
            console.log('poloShirtUrl ', poloShirtUrl);
            console.log('buttonDownShirtUrl ', buttonDownShirtUrl);
            console.log('hoodieUrl ', hoodieUrl);
            if (productsResponse && pricesResponse && stockResponse && tShirtUrl && poloShirtUrl && buttonDownShirtUrl && hoodieUrl) {
                setIsError(false);
                
            } else {
                setIsError(true);
            }
            setIsLoading(false);
        })();
        
    }, []);
    return (
        <ProductsContext.Provider value={{ productsState, isLoading, isError }}>
            {children}
        </ProductsContext.Provider>
    )
}