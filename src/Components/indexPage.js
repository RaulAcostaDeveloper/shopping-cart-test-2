'use client'
import { ProductsContext } from "@/productsController"
import { useContext, useEffect, useState } from "react"

export const IndexPage = () => {
    const { productsState, isLoading, isError } = useContext(ProductsContext);
    // Podría usar un array normalizado de productos para mapear sólo el más relevante pero conservando la información de cuál se está enviando

    return (
        <div>
            {isLoading && <div> Is loading...</div>}
            {isError && <div>Error!</div>}
            {productsState.map((product, index) => (
                <div key={index}>
                    {/* Cubrir el caso en el que no haya stock de ningun size */}
                    {(product.stocks.lStock || product.stocks.mStock || product.stocks.sStock) &&
                        <div>
                            <img className="w-12" src={product.urlImg} alt={'img of ' + product.model} />
                            <h3>{product.model}</h3>
                            {/* Aquí decide cuál se va a renderizar */}
                            {/* Por disponibilidad priorizando por tamaño */}
                            <ProductInfoSelector product={product} />
                        </div>
                    }
                </div>
            ))}
        </div>
    )
}
const ProductInfoSelector = ({ product }) => (
    <div>
        {product.stocks.sStock > 0 ?
            <ProductInfo price={product.prices.sPrice} size={'S'} />
            :
            <>
                {product.stocks.mStock > 0 ?
                    <ProductInfo price={product.prices.mPrice} size={'M'} />
                    :
                    <>
                        {product.stocks.mStock > 0 ?
                            <ProductInfo price={product.prices.lPrice} size={'L'} />
                            :
                            <div>Error inesperado: No hay items in stock</div>
                        }
                    </>
                }
            </>
        }

    </div>
);
const ProductInfo = ({ price, size }) => {
    const [isDissabled, setIsDissabled] = useState(false);
    const handleAddToCart = () => {
        // Se va a añadir un solo elemento de este tipo al carrito



        // Sólo puede añadir un elemento por producto en esta pantalla debido a que no hay un contador de elementos añadidos
        // y por la naturaleza de los requerimientos (yo hubiera hecho el producto diferente
        // pudiendo seleccionar el size y la cantidad desde esta pantalla)
        setIsDissabled(true);
    }
    return (
        <div>
            $ {price}
            <button onClick={handleAddToCart}>Add to cart {size}</button>
        </div>
    )
}