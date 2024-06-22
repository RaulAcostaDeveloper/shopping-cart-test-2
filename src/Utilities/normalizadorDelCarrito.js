export const normalizadorDelCarrito = (productsResponse, pricesResponse) => {
    console.log('Inicializar el carrito con ', productsResponse, pricesResponse);
    // En el nuevo arreglo, cada objeto debe contener las propiedades del objeto 
    // correspondiente de productsResponse y además las propiedades price 
    // (del objeto correspondiente de pricesResponse) y stock (inicialmente 0).

    // Cada objeto en pricesResponse tiene una propiedad product_id que se 
    // utiliza para vincularlo con un objeto en productsResponse.

    const normalizedCart = [];

    pricesResponse.forEach(priceObj => {
        // Encontrar el objeto correspondiente en productsResponse
        const productObj = productsResponse.find(product => product.id === priceObj.product_id);

        // Si se encuentra un objeto correspondiente
        if (productObj) {
            // Crear un nuevo objeto combinando propiedades
            const normalizedObj = {
                ...productObj,         // Propiedades del objeto de productsResponse
                id: priceObj.product_id, // Sobrescribir el id con product_id de pricesResponse
                price: priceObj.price, // Agregar la propiedad price
                stock: 0               // Inicializar stock en 0
            };

            // Agregar el nuevo objeto al arreglo normalizado
            normalizedCart.push(normalizedObj);
        }
    });
    return normalizedCart;
}