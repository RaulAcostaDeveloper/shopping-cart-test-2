'use client'
import { ProductsContext } from "@/productsController";
import { useContext, useEffect, useState } from "react";

export const ProductSingleView = ({ code }) => {
    const { productsState, isLoading } = useContext(ProductsContext);
    const [productData, setProductData] = useState();
    const [sizeData, setSizeData] = useState({});

    // Teniendo el código puedo buscar el objeto
    useEffect(() => {
        const indexItem = productsState.findIndex(item => item.code === code);
        console.log('productsState se actualizó', productsState[indexItem]);
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
            console.log('Error, no se encontró la disponibilidad del producto');
        }
        // Actualiza product data
        setProductData(newProductData);
    }, [productsState]);

    return (
        <div>
            {isLoading ? <div>Is loading...</div>
                :
                <>
                    {productData && sizeData ?
                        <>
                            <img className="w-12" src={productData.urlImg} alt={'Image from ' + productData.model} />
                            <span>{productData.model}_</span>
                            <RenderBySizeSelected productData={productData}
                                sizeData={sizeData}
                                setSizeData={setSizeData} />
                        </>
                        :
                        <div>No se encontró disponibilidad del producto</div>
                    }
                </>
            }
        </div>
    )
}

const RenderBySizeSelected = ({ productData, sizeData, setSizeData }) => {
    return (
        <div>
            $ {sizeData.price}
            <Contador productData={productData} sizeData={sizeData} setSizeData={setSizeData} />
        </div>
    )
}

// Estos son micro components
const Contador = ({ productData, sizeData, setSizeData }) => {
    const { modificarCarrito } = useContext(ProductsContext);
    const [cantidad, setCantidad] = useState(1); // queremos que el usuario quiera comprar un producto, por eso inicio en 1.
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
        <div>
            {
                // con que haya alguna
                (productData.stocks.lStock || productData.stocks.mStock || productData.stocks.sStock) ?
                    <>
                        <div>
                            <span>Size: </span>
                            <SelectorDeSize productData={productData} sizeData={sizeData} setSizeData={setSizeData} />
                        </div>

                        <button onClick={handleRestar}>-</button>
                        {cantidad}
                        <button onClick={handleSumar}>+</button>
                        <button onClick={handleAddToCart}>Add to cart</button>
                    </>
                    :
                    // No quiero que arroje 0 al agotarse existencias
                    <p>
                        Ya no hay en existencia
                    </p>
            }
        </div>
    )
}
const SelectorDeSize = ({ productData, sizeData, setSizeData }) => { // no considero que sea necesario un global state para setSizeSelected
    const handleSizeChange = (size) => {
        // Mejor este método lo puedo pasar hasta arriba
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
    return (
        <>
            {productData.stocks.sStock > 0 && <button className={`${sizeData.size === 'S' && 'border-2 border-solid'}`} onClick={() => handleSizeChange('S')}>S</button>}
            {productData.stocks.mStock > 0 && <button className={`${sizeData.size === 'M' && 'border-2 border-solid'}`} onClick={() => handleSizeChange('M')}>M</button>}
            {productData.stocks.lStock > 0 && <button className={`${sizeData.size === 'L' && 'border-2 border-solid'}`} onClick={() => handleSizeChange('L')}>L</button>}

        </>
    )
}