# Shopping cart test

## Descripción del Proyecto
"Shopping cart test" es una aplicación de carrito de compras que corre con una API local. Permite a los usuarios navegar y seleccionar productos para añadirlos a su carrito de compras.

## Tabla de Contenidos
1. [Clonado del Proyecto](#clonado-del-proyecto)
2. [Levantar Dependencias](#levantar-dependencias)
3. [Compilación del servidor](#compilación-del-servidor)
4. [Compilación del proyecto](#compilación-del-proyecto)
5. [Uso](#uso)
6. [Características](#características)
7. [Autores](#autores)

## Clonado del Proyecto
Para clonar este repositorio, ejecuta el siguiente comando:

-bash-

git clone https://github.com/RaulAcostaDeveloper/shopping-cart-test-2

## Levantar dependencias
Para instalar las dependencias necesarias, navega al directorio del proyecto y ejecuta:

npm install

## Compilación del servidor
Antes de compilar el proyecto primero debe levantar el servidor

Clonar el proycto y seguir las instrucciones https://github.com/incfile/challenge-endpoints

Instalar las dependencias
npm install

Levantar el proyecto y asegurarse que inicie en http://localhost:3000
node index.js

Debe iniciar en http://localhost:3000, de otra manera no funcionará

## Compilación del proyecto
Para compilar y ejecutar el proyecto en modo desarrollo, utiliza el siguiente comando:
npm run dev

Para construir el proyecto para producción, ejecuta:

npm run build

Para iniciar el proyecto en modo producción, ejecuta:

npm start

## Uso
Una vez que el proyecto esté en ejecución, puedes acceder a la aplicación en http://localhost:3001.

## Características

Página Principal: Listado de productos.

http://localhost:3001


Página de Productos por Código: Información detallada de un producto específico.

http://localhost:3001/[code]


Página del Carrito de Compras: Visualización y gestión de los productos añadidos al carrito.

http://localhost:3001/cartPage


## Autores
Angel Raúl Acosta Rojas - Desarrollador Principal - [Sitio web](https://www.raulacostadeveloper.com/dev)

Si tienes alguna pregunta, puedes contactarme a través de mi [email raulacostadeveloper@outlook.com](raulacostadeveloper@outlook.com).
