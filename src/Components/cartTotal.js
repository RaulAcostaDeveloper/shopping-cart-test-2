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
        console.log('Limpiando el carrito ');
        cartState.forEach(element => {
            modificarCarrito(element.code, element.size, 0, "elimina");
        });
    }
    return (
        <div className="border-solid border">
            <h3>Order Summary</h3>
            <span>Subtotal: $ {total}</span>
            <Link href={'/'} onClick={handleCheckout}>
                <button>Checkout</button>
            </Link>
        </div>
    )
}