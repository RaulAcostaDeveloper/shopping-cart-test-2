'use client'
import { ProductsContext } from "@/productsController";
import { useContext, useEffect, useState } from "react";

export const ProductSingleView = ({ code }) => {
    const { productsState, isLoading } = useContext(ProductsContext);
    const [productData, setProductData] = useState();
    const [sizeData, setSizeData] = useState({});
    const [sizeSelected, setSizeSelected] = useState();

    // Teniendo el código puedo buscar el objeto
    useEffect(() => {
        const indexItem = productsState.findIndex(item => item.code === code);
        console.log('productsState se actualizó', productsState[indexItem]);
        setProductData(productsState[indexItem]);
    }, [productsState]);

    useEffect(() => {
        // También inicializar el sizeSelected dependiendo del stock disponible
        // Se supone que también cambió productState
        console.log('productData se actualizó ', productData);
        // Ojo, no está entrando
        if (productData?.stocks.sStock) {
            setSizeData({
                size: 'S',
                stock: productData.stocks.sStock,
                price:productData.prices.sPrice,
            });
            setSizeSelected('S');
        } else if (productData?.stocks.mStock) {
            setSizeData({
                size: 'M',
                stock: productData.stocks.mStock,
                price:productData.prices.mPrice,
            });
            setSizeSelected('M');
        } else if (productData?.stocks.lStock) {
            setSizeData({
                size: 'L',
                stock: productData.stocks.lStock,
                price:productData.prices.lPrice,
            });
            setSizeSelected('L');
        } else {
            console.log('Error, no se encontró la disponibilidad del producto');
        }
    }, [productData]);

    return (
        <div>
            {isLoading ? <div>Is loading...</div>
                :
                <>
                    {sizeSelected ?
                        <>
                            <img className="w-12" src={productData.urlImg} alt={'Image from ' + productData.model} />
                            <span>{productData.model}_</span>
                            <RenderBySizeSelected productData={productData} sizeSelected={sizeSelected}
                            sizeData={sizeData}
                            setSizeSelected={setSizeSelected} />
                        </>
                        :
                        <div>No se encontró disponibilidad del producto</div>
                    }
                </>
            }
        </div>
    )
}

const RenderBySizeSelected = ({ productData, sizeSelected, sizeData, setSizeSelected }) => {
    return (
        <div>
            $ {sizeData.price}
            <Contador productData={productData} sizeData={sizeData} />
        </div>
    )
}

// Estos son micro components
const Contador = ({ productData, sizeData }) => {
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
            <button onClick={handleRestar}>-</button>
            {cantidad}
            <button onClick={handleSumar}>+</button>
            <button onClick={handleAddToCart}>Add to cart</button>
        </div>
    )
}