import Image from "next/image"
import Link from "next/link"

export const Header = () => {
    return (
        <div className="w-full flex justify-between p-4">
            <Link href={'/'} className="flex">
                <span>PRODUCTS</span>
                <Image className="ml-2" src={'/icons/hogar.png'} alt="Shopping cart image" width={20} height={20} />
            </Link>
            <Link href={'/cartPage'} className="flex">
                <span>CART</span>
                <Image className="ml-2" src={'/icons/carrito-de-compras.png'} alt="Shopping cart image" width={20} height={20} />
            </Link>
        </div>
    )
}