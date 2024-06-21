'use client'
import { ProductsContext } from "@/productsController"
import { useContext, useEffect } from "react"

export const IndexPage = () => {
    const { productsState, isLoading, isError } = useContext(ProductsContext);
    useEffect(()=>{
        console.log('productsState ', productsState);
    },[productsState]);
    return (
        <div>
            Index page
            {isLoading && <div> Is loading...</div>}
            {isError && <div>Error!</div>}
        </div>
    )
}