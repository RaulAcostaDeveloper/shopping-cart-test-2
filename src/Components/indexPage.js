'use client'
import { ProductsContext } from "@/productsController";
import Link from "next/link";
import { useContext, useState } from "react"
import { IsLoading } from "./isLoading";
import { IsError } from "./isError";

export const IndexPage = () => {

    const { productsState, isLoading } = useContext(ProductsContext);

    return (
        <div className="flex justify-around flex-wrap items-end">

            {isLoading && <IsLoading />}

            {productsState.map((product, index) => (
                <div  key={index} >

                    {/* Cubrir el caso en el que no haya stock de ningun size */}
                    {(product.stocks.lStock || product.stocks.mStock || product.stocks.sStock) ?
                        <div className="w-32 m-4 shadow-lg flex flex-wrap items-end">
                            {/* Podría añadir un botón para ir a su single view pero no se si quieren que respete al 100% el diseño */}
                            {/* Por esa razón pongo el click en la imágen y el título */}
                            <Link className="pointer" href={'/' + product.code} title="Click para ir al single view">

                                {/* Un problema con NEXT y Tailwind es que next pide que usemos Image en lugar de img */}
                                {/* Y NEXT no permite urls de imágenes de localhost */}
                                {/* Y la url de la imágen viene de localhost */}
                                <img className="w-full" src={product.urlImg} alt={'img of ' + product.model} />
                                <h3 className="font-bold text-center">{product.model}</h3>
                            </Link>

                            {/* Aquí decide cuál se va a renderizar */}
                            {/* Por disponibilidad priorizando por tamaño !Importante información para entender todo el comportamiento*/}
                            <ProductInfoSelector product={product} />
                        </div>
                        :
                        // Usaba && pero arrojaba 0 en lugar de null
                        <></>
                    }
                </div>
            ))}
        </div>
    )
}

const ProductInfoSelector = ({ product }) => {
    return (
        <div className="flex flex-wrap items-end justify-center">
            {product.stocks.sStock > 0 ?
                <ProductInfo code={product.code} price={product.prices.sPrice} size={'S'} />
                :
                <>
                    {product.stocks.mStock > 0 ?
                        <ProductInfo code={product.code} price={product.prices.mPrice} size={'M'} />
                        :
                        <>
                            {product.stocks.lStock > 0 ?
                                <ProductInfo code={product.code} price={product.prices.lPrice} size={'L'} />
                                :
                                <IsError errorInfo={'Error inesperado: No hay items in stock'} />
                            }
                        </>
                    }
                </>
            }

        </div>
    )
};

const ProductInfo = ({ code, price, size }) => {

    const [isDissabled, setIsDissabled] = useState(false);
    const { modificarCarrito } = useContext(ProductsContext);

    const handleAddToCart = () => {

        // Se va a añadir un solo elemento de este tipo al carrito
        modificarCarrito(code, size, 1, 'suma');

        // Sólo puede añadir un elemento por producto en esta pantalla debido a que no hay un contador de elementos añadidos
        // y por la naturaleza de los requerimientos (yo hubiera hecho el producto diferente
        // pudiendo seleccionar el size y la cantidad desde esta pantalla)
        setIsDissabled(true);
    }
    return (
        <>
            <span>$ {price}</span>

            {/* Mostrarlo como deshabilitado una vez añadido */}
            <button className={`mt-2 mb-2 font-semibold rounded p-2
                ${isDissabled
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                onClick={handleAddToCart} disabled={isDissabled}>Add to cart</button>
        </>
    )
}