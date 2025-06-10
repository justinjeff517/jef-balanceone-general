"use client";
import React, { ChangeEvent, useState } from "react";
import { parseISO, format, isValid } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface CartItem {
  id: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  supplierName: string;
  supplierAddress: string;
  imageUrl?: string;
}

const initialCartItems: CartItem[] = [
  {
    id: "1",
    name: "Coffee Mug",
    unit: "pcs",
    price: 5.99,
    quantity: 2,
    supplierName: "OfficeSupplies Co.",
    supplierAddress: "789 Office Park, Makati",
    imageUrl: "/images/placeholder.svg",
  },
  {
    id: "2",
    name: "A4 Notebook",
    unit: "pcs",
    price: 3.49,
    quantity: 3,
    supplierName: "OfficeSupplies Co.",
    supplierAddress: "789 Office Park, Makati",
    imageUrl: "/images/placeholder.svg",
  },
  {
    id: "3",
    name: "Ballpoint Pens (Pack of 10)",
    unit: "pack",
    price: 4.25,
    quantity: 1,
    supplierName: "OfficeSupplies Co.",
    supplierAddress: "789 Office Park, Makati",
    imageUrl: "/images/placeholder.svg",
  },
  {
    id: "4",
    name: "USB-C Cable",
    unit: "pcs",
    price: 8.99,
    quantity: 2,
    supplierName: "GadgetWorld Ltd.",
    supplierAddress: "123 Tech Blvd, Quezon City",
    imageUrl: "/images/placeholder.svg",
  },
  {
    id: "5",
    name: "Wireless Mouse",
    unit: "pcs",
    price: 24.99,
    quantity: 1,
    supplierName: "GadgetWorld Ltd.",
    supplierAddress: "123 Tech Blvd, Quezon City",
    imageUrl: "/images/placeholder.svg",
  },
  {
    id: "6",
    name: "LED Desk Lamp",
    unit: "pcs",
    price: 29.99,
    quantity: 1,
    supplierName: "GadgetWorld Ltd.",
    supplierAddress: "123 Tech Blvd, Quezon City",
    imageUrl: "/images/placeholder.svg",
  },
];

interface SupplierForm {
  date: string;
  receiptNumber: string;
}

export default function CheckoutPage() {
  // group items by supplier
  const grouped = initialCartItems.reduce(
    (acc: Record<string, CartItem[]>, item) => {
      (acc[item.supplierName] = acc[item.supplierName] || []).push(item);
      return acc;
    },
    {}
  );
  const suppliers = Object.keys(grouped);

  // form data per supplier
  const [formData, setFormData] = useState<
    Record<string, SupplierForm>
  >(
    suppliers.reduce((acc, sup) => {
      acc[sup] = { date: "", receiptNumber: "" };
      return acc;
    }, {} as Record<string, SupplierForm>)
  );

  const handleDateChange = (
    supplier: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [supplier]: { ...prev[supplier], date: e.target.value },
    }));
  };

  const handleReceiptChange = (
    supplier: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [supplier]: { ...prev[supplier], receiptNumber: e.target.value },
    }));
  };

  const handlePlaceOrder = () => {
    const errors: string[] = [];
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    //console log
    

    // validate each supplier's form fields
    Object.entries(formData).forEach(([sup, { date, receiptNumber }]) => {
      if (!date) {
        errors.push(`${sup}: Date`);
      } else if (!datePattern.test(date) || !isValid(parseISO(date))) {
        errors.push(`${sup}: Date must be in YYYY-MM-DD format`);
      }

      if (!receiptNumber) {
        errors.push(`${sup}: Receipt Number`);
      }
    });

    if (errors.length > 0) {
      alert(
        "Please fix the following before placing order:\n" +
          errors.map((e) => `• ${e}`).join("\n")
      );
      return;
    }

    console.log("Order placed:", formData);
    alert("Thank you for your order!");
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      {suppliers.map((sup) => {
        const items = grouped[sup];
        const subtotal = items.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );
        const { date, receiptNumber } = formData[sup];
        let humanized = "";
        try {
          humanized = date ? format(parseISO(date), "PPP") : "";
        } catch {}

        return (
          <Card key={sup}>
            <CardHeader>
              <CardTitle className="text-lg">{sup}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.quantity}× {item.name}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

<div className="pt-4 space-y-4">
  <div>
    <label className="block text-sm font-medium mb-1">
      Date
    </label>
    <div className="flex space-x-4">
      <div className="w-1/4">
        <Input
          name={`date-${sup}`}
          value={date}
          onChange={(e) => handleDateChange(sup, e)}
          placeholder="YYYY-MM-DD"
          className="w-full"
        />
      </div>
      {humanized && (
        <p className="w-1/4 flex items-center text-sm text-muted-foreground">
          {humanized}
        </p>
      )}
    </div>
  </div>

  <div className="flex space-x-4">
    <div className="w-1/4">
      <label htmlFor="receipt" className="block text-sm font-medium mb-1">
        Receipt Number
      </label>
      <Input
        id="receipt"
        name={`receipt-${sup}`}
        value={receiptNumber}
        onChange={(e) => handleReceiptChange(sup, e)}
        placeholder="ABC-12345"
        className="w-full"
      />
    </div>
  </div>
</div>





            </CardContent>
            <CardFooter className="flex justify-between">
              <span className="font-medium">Subtotal:</span>
              <span className="font-semibold">
                ${subtotal.toFixed(2)}
              </span>
            </CardFooter>
          </Card>
        );
      })}

      <div className="pt-4">
        <Button size="lg" onClick={handlePlaceOrder} className="w-full">
          Submit Purchase
        </Button>
      </div>
    </div>
  );
}
