import Link from "next/link"

export const Header = () => {
    // Pendiente trabajar en el header
    return (
        <div className="w-full flex justify-between">
            <Link href={'/'}>
                PRODUCTS
            </Link>
            <Link href={'/cartPage'}>
                CART
            </Link>
        </div>
    )
}