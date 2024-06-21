// Este es el método que normaliza los resultados en un solo arreglo
// Lo hice así por el requerimiento de mostrar un solo producto de cada size
// Cada size tiene su propio precio y su propio stock, esa fue la parte más complicada de resolver.
export const normalizadorDeArrayDeProductos = (productsResponse, pricesResponse, stockResponse) => {
    // Crear un mapa a partir de un arreglo de objetos, utilizando una clave específica para mapear los ítems.
    // Mapear los ítems por su ID
    // Toma un arreglo de ítems y una clave, y retorna un mapa con el ID como clave
    const mapItemsById = (items, key) => new Map(items.map(item => [item[key], item]));

    // Proveer acceso rápido a los datos de stock y precios basados en product_id.
    // Crear mapas para el stock y los precios para acceso rápido
    const stockMap = mapItemsById(stockResponse, 'product_id');
    const pricesMap = mapItemsById(pricesResponse, 'product_id');

    // Unir los datos de productos con sus respectivos stock y precios.
    const allProducts = productsResponse.map(product => ({
        ...product,
        stock: stockMap.get(product.id)?.stock ?? 0, // Asignar stock, 0 si no se encuentra
        price: pricesMap.get(product.id)?.price // Asignar precio correspondiente, puede ser null
    }));

    // Agrupar productos por code y model
    const finalProductsMap = new Map();

    // Agrupar productos por code y model
    allProducts.forEach(product => {
        // Generar una clave única para cada combinación de code y model
        const key = `${product.code}-${product.model}`;

        // Si no existe un producto con esta clave, inicializar un nuevo objeto
        if (!finalProductsMap.has(key)) {
            finalProductsMap.set(key, {
                code: product.code,
                model: product.model,
                prices: { sPrice: null, mPrice: null, lPrice: null },
                stocks: { sStock: null, mStock: null, lStock: null }
            });
        }

        // Obtener el producto existente del mapa
        const existingProduct = finalProductsMap.get(key);

        // Asignar los precios y stocks correspondientes a cada tamaño (S, M, L) para el producto existente en el mapa.
        // Mapa de claves para los diferentes tamaños (S, M, L)
        const sizeKeyMap = {
            'S': { priceKey: 'sPrice', stockKey: 'sStock' },
            'M': { priceKey: 'mPrice', stockKey: 'mStock' },
            'L': { priceKey: 'lPrice', stockKey: 'lStock' }
        };

        // Obtener las claves de precio y stock correspondientes al tamaño del producto
        const { priceKey, stockKey } = sizeKeyMap[product.size];

        // Asignar el precio y stock al producto existente en el mapa
        existingProduct.prices[priceKey] = product.price;
        existingProduct.stocks[stockKey] = product.stock;
    });

    // Retorna el array normalizado (usó mapas para ahorrar recursos de memoria y tiempo de ejecución)
    return Array.from(finalProductsMap.values());
}