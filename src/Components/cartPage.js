'use client'
// Nota de use client
// Error: (0 , react__WEBPACK_IMPORTED_MODULE_1__.useContext) is not a function
// todos los componentes que usen hooks incluyendo externos o de paquete, requieren que 
// next sepa que se va a renderizar del lado del cliente 

import React, { useContext, useEffect, useState } from 'react';
import { ProductsContext } from "@/productsController";
import { CartTotal } from './cartTotal';

export const CartPage = () => {
    const { cartState } = useContext(ProductsContext);
    return (
        <div>
            {cartState.map((el, index) => (
                <div key={index}>
                    {/* Lo estoy haciendo tal cuál lo pide los requerimientos, pero no me parece que sea el funcionamiento correcto */}
                    {el.stock > 0 &&
                        <CartItem key={index} cartData={el} />
                    }
                </div>
            ))}
            <CartTotal/>
        </div>
    )
}

const CartItem = ({ cartData }) => {
    const { modificarCarrito, initialProductData } = useContext(ProductsContext);
    const [maxDisponible, setMaxDisponible] = useState(0);
    const [url, setUrl] = useState('');

    useEffect(() => {
        // Obtener el indice del producto por su code
        const indexItem = initialProductData.findIndex(item => item.code === cartData.code);
        const product = initialProductData[indexItem];
        let maxDisponible = 0;
        switch (cartData.size) {
            case 'S':
                maxDisponible = product.stocks.sStock;
                break;
            case 'M':
                maxDisponible = product.stocks.mStock;
                break;
            case 'L':
                maxDisponible = product.stocks.lStock;;
                break;
            default:
                break;
        }
        setMaxDisponible(maxDisponible);
        setUrl(product.urlImg);
    }, []); // Sólo ocupo el máximo disponible inicial

    const handleDelete = () => {
        // Eliminar del carrito el item
        modificarCarrito(cartData.code, cartData.size, 0, "elimina");
    }

    return (
        <>
            {maxDisponible > 0 &&
                <div className='w-64 border-solid border-2'>
                    <img className='w-12' src={url} alt={'Imagen de ' + cartData.model}/>
                    <div>{cartData.model}</div>
                    <div>Large: {cartData.size}</div>
                    <div>$ {cartData.price}</div>
                    <SelectorDeCantidad cartData = {cartData} maxDisponible={maxDisponible} modificarCarrito={modificarCarrito}/>
                    {/* Borrar item del carrito */}
                    <button onClick={handleDelete}>X</button>
                </div>
            }
        </>
    )
}

const SelectorDeCantidad = ({ cartData, maxDisponible, modificarCarrito }) => {
    // En diseño se ve que quieren un selector
    // En otro caso podrían re utilizar el elemento de ProductSingleView
    const [options, setOptions] = useState([]);
    const [quantitySelected, setQuantitySelected] = useState(cartData.stock);

    useEffect(() => {
        const numbers = Array.from({ length: maxDisponible }, (_, index) => index + 1);
        setOptions(numbers);
    }, [maxDisponible]);

    const handleSelectNewQuantity = (value) => {
        setQuantitySelected(value);
        modificarCarrito(cartData.code, cartData.size, value, "update");
    }

    // Nota: 
    // Para ser sincero no tengo tanto tiempo como para resolver la incógnita de cómo modificar el estilo del dropdown en html
    // Un dropdown en select puede salirse de una pantalla y dejar de ser funcional
    // Yo recomiendo usar mejor un contador 
    // La solución sería crear un select personalizado. Si consideran que debí hacerlo, solo tuve 1 día hábil para hacer este proyecto
    // Lo cuál no refleja cómo debe trabajar un equipo eficiente y organizado, capaz de tomar decisiones durante la iteración del sprint

    return (
        <div>
            <select value={quantitySelected} onChange={(e)=>handleSelectNewQuantity(e.target.value)}>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
}