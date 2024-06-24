'use client'
import { ProductsContext } from "@/productsController";
import { useContext, useEffect, useState } from "react";
import { IsLoading } from "./isLoading";

export const ProductSingleView = ({ code }) => {

    const { productsState, isLoading } = useContext(ProductsContext);
    const [productData, setProductData] = useState();
    const [sizeData, setSizeData] = useState({});

    // Teniendo el código puedo buscar el objeto
    useEffect(() => {
        const indexItem = productsState.findIndex(item => item.code === code);
        const newProductData = productsState[indexItem];

        // Actualiza sizeData
        if (newProductData?.stocks.sStock) {
            setSizeData({
                size: 'S',
                stock: newProductData.stocks.sStock,
                price: newProductData.prices.sPrice,
            });
        } else if (newProductData?.stocks.mStock) {
            setSizeData({
                size: 'M',
                stock: newProductData.stocks.mStock,
                price: newProductData.prices.mPrice,
            });
        } else if (newProductData?.stocks.lStock) {
            setSizeData({
                size: 'L',
                stock: newProductData.stocks.lStock,
                price: newProductData.prices.lPrice,
            });
        } else {
            console.error('Error: no se encontró la disponibilidad del producto');
        }

        // Actualiza product data
        setProductData(newProductData);
    }, [productsState]);

    return (
        <div className="w-full flex flex-wrap justify-center">

            {isLoading ? <IsLoading />
                :
                <>
                    {productData && sizeData &&
                        <>
                            <img className="w-64 h-auto shadow-lg" src={productData.urlImg} alt={'Image from ' + productData.model} />
                            <div className="w-64 p-2">
                                <h3 className="font-bold">{productData.model}</h3>
                                <RenderBySizeSelected
                                    productData={productData}
                                    sizeData={sizeData}
                                    setSizeData={setSizeData} />
                            </div>
                        </>
                    }
                </>
            }
        </div>
    )
}

const RenderBySizeSelected = ({ productData, sizeData, setSizeData }) => {
    return (
        <div>
            <div>$ {sizeData.price}</div>
            <Contador productData={productData} sizeData={sizeData} setSizeData={setSizeData} />
        </div>
    )
}

// Estos son micro components
const Contador = ({ productData, sizeData, setSizeData }) => {
    const { modificarCarrito } = useContext(ProductsContext);

    // queremos que el usuario quiera comprar un producto, por eso inicio en 1.
    const [cantidad, setCantidad] = useState(1);
    const handleRestar = () => {
        if (cantidad > 1) {
            setCantidad(cantidad - 1);
        }
    }
    const handleSumar = () => {
        // mayor a la cantidad del stock correspondiente al size seleccionado
        if (cantidad < sizeData.stock) {
            setCantidad(cantidad + 1);
        }
    }

    const handleAddToCart = () => {
        // code, size, quantity, operation
        modificarCarrito(productData.code, sizeData.size, cantidad, 'suma');
        // Con eso debería actualizar todo el state
        // Reiniciar
        setCantidad(1);
    }
    return (
        <div className="mt-2 mb-2">
            {
                // con que haya alguna
                (productData.stocks.lStock || productData.stocks.mStock || productData.stocks.sStock) ?
                    <>
                        <div>
                            <span>Size: </span>
                            <SelectorDeSize productData={productData} sizeData={sizeData} setSizeData={setSizeData} />
                        </div>
                        <div className="flex items-center mt-2 mb-2">
                            <span>Qty: </span>
                            <div className="ml-4 quantitySelector">
                                <button className="p-2 border-solid border-2" onClick={handleRestar}>-</button>
                                <span className="p-2">{cantidad}</span>
                                <button className="p-2 border-solid border-2" onClick={handleSumar}>+</button>
                            </div>
                        </div>
                        <div className="w-full flex justify-center">
                            <button
                                className="mt-2 mb-2 font-semibold rounded p-2 bg-blue-500 text-white hover:bg-blue-600"
                                onClick={handleAddToCart}>
                                Add to cart
                            </button>
                        </div>
                    </>
                    :
                    <p>Ya no hay items en existencia</p>
                // No es un error
                // <IsError errorInfo={'Ya no hay en existencia'} />
            }
        </div>
    )
}
const SelectorDeSize = ({ productData, sizeData, setSizeData }) => { // no considero que sea necesario un global state para setSizeSelected
    const handleSizeChange = (size) => {
        // Es posible refactorizar este método
        // Actualiza sizeData
        switch (size) {
            case 'S':
                setSizeData({
                    size: 'S',
                    stock: productData.stocks.sStock,
                    price: productData.prices.sPrice,
                });
                break;
            case 'M':
                setSizeData({
                    size: 'M',
                    stock: productData.stocks.mStock,
                    price: productData.prices.mPrice,
                });
                break;
            case 'L':
                setSizeData({
                    size: 'L',
                    stock: productData.stocks.lStock,
                    price: productData.prices.lPrice,
                });
                break;
            default:
                break;
        }
    }

    // Tailwind css es de por sí muy dificil de leer
    return (
        <>
            {productData.stocks.sStock > 0 &&
                <button
                    className={`p-2 m-2 ${sizeData.size === 'S' && 'border-2 border-solid'}`}
                    onClick={() => handleSizeChange('S')}>
                    S
                </button>
            }
            {productData.stocks.mStock > 0 &&
                <button
                    className={`p-2 m-2 ${sizeData.size === 'M' && 'border-2 border-solid'}`}
                    onClick={() => handleSizeChange('M')}>
                    M
                </button>
            }
            {productData.stocks.lStock > 0 &&
                <button
                    className={`p-2 m-2 ${sizeData.size === 'L' && 'border-2 border-solid'}`}
                    onClick={() => handleSizeChange('L')}>
                    L
                </button>
            }

        </>
    )
}