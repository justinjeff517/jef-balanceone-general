"use client"
import { useParams } from "next/navigation"



export default function Page() {
    const params = useParams();
    const { slug, product_id } = params
    return (
        <div>
            <p>
                {slug} {product_id}
            </p>
        </div>
    )
}