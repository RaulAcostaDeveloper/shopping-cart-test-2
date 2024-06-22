import { ProductSingleView } from "@/Components/ProductSingleView";

export default function productPage({ params }) {
    const { productCode } = params;
    return (
        <div>
            <ProductSingleView code = {productCode}/>
        </div>
    )
}