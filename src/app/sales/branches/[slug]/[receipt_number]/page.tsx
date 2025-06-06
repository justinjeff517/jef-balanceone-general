"use client";
import { useParams } from "next/navigation";

export default function Page() {
    const { slug, receipt_number } = useParams();

    return (
        <div>
            <p>Receipt for {slug}</p>
            <p>Receipt Number: {receipt_number}</p>
        </div>
    )
}