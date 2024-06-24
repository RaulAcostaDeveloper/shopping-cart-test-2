'use client'
import { ProductsContext } from "@/productsController"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"

export const CartTotal = () => {
    const [total, setTotal] = useState(0)
    const { cartState, modificarCarrito } = useContext(ProductsContext)
    useEffect(() => {
        let contador = 0;
        cartState.forEach(element => {
            contador += element.price * element.stock;
        });
        setTotal(contador.toFixed(2));
    }, [cartState]);

    const handleCheckout = () => {
        // Supongo que el comportamiento que se espera es limpiar el carrito y regresar a index
        cartState.forEach(element => {
            modificarCarrito(element.code, element.size, 0, "elimina");
        });
    }
    return (
        <div className="w-64 shadow-lg bg-gray-100">
            <h3 className="font-bold">Order Summary</h3>
            <span>Subtotal: $ {total}</span>
            <div className="w-full flex justify-center mt-4 mb-4">
                <Link href={'/'} onClick={handleCheckout}>
                    <button className="mt-2 mb-2 font-semibold rounded p-2 bg-blue-500 text-white hover:bg-blue-600">Checkout</button>
                </Link>
            </div>
        </div>
    )
}