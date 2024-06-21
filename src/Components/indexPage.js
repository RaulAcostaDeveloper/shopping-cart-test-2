'use client'
import { ProductsContext } from "@/productsController"
import { useContext, useEffect } from "react"

export const IndexPage = () => {
    const { productsState, isLoading, isError } = useContext(ProductsContext);
    // Podría usar un array normalizado de productos para mapear sólo el más relevante pero conservando la información de cuál se está enviando
    
    return (
        <div>
            Index page
            {isLoading && <div> Is loading...</div>}
            {isError && <div>Error!</div>}
        </div>
    )
}