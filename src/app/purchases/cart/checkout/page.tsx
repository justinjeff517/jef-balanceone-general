"use client";
import React, { useState, useEffect, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Branch {
  data: {
    name: string;
    slug: string;
    tin: string;
    address: string;
  };
}

const branches: Branch[] = [
  {
    data: {
      name: "South Branch",
      slug: "south_branch",
      tin: "987-654-321",
      address: "456 Rizal Avenue, Quezon City",
    },
  },
  {
    data: {
      name: "North Branch",
      slug: "north_branch",
      tin: "555-123-456",
      address: "789 Ayala Boulevard, Makati",
    },
  },
  {
    data: {
      name: "West Branch",
      slug: "west_branch",
      tin: "444-777-888",
      address: "2020 Ortigas Center, Pasig",
    },
  },
  {
    data: {
      name: "Main Branch",
      slug: "main_branch",
      tin: "123-456-789",
      address: "123 Market Street, Manila",
    },
  },
  {
    data: {
      name: "East Branch",
      slug: "east_branch",
      tin: "333-222-111",
      address: "1010 Bonifacio Drive, Taguig",
    },
  },
];

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
  branchSlug: string;
  date: string;
  receiptNumber: string;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cartItems");
    if (saved) setCartItems(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Group items by supplier
  const grouped = useMemo(() => {
    return cartItems.reduce((acc: Record<string, CartItem[]>, item) => {
      (acc[item.supplierName] = acc[item.supplierName] || []).push(item);
      return acc;
    }, {});
  }, [cartItems]);

  const suppliers = useMemo(() => Object.keys(grouped), [grouped]);

  // Form state per supplier
  const [formData, setFormData] = useState<Record<string, SupplierForm>>(
    suppliers.reduce((acc, sup) => {
      acc[sup] = { branchSlug: "", date: "", receiptNumber: "" };
      return acc;
    }, {} as Record<string, SupplierForm>)
  );

  useEffect(() => {
    setFormData((prev) =>
      suppliers.reduce((acc, sup) => {
        acc[sup] = prev[sup] || { branchSlug: "", date: "", receiptNumber: "" };
        return acc;
      }, {} as Record<string, SupplierForm>)
    );
  }, [suppliers]);

  const handleFieldChange = (
    supplier: string,
    field: keyof SupplierForm,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [supplier]: { ...prev[supplier], [field]: value },
    }));
  };

  const validateForms = () => {
    const errors: string[] = [];
    suppliers.forEach((sup) => {
      const { branchSlug, date, receiptNumber } = formData[sup];
      if (!branchSlug) errors.push(`${sup}: Branch is required`);
      if (!date) errors.push(`${sup}: Date is required`);
      else if (!datePattern.test(date) || !isValid(parseISO(date)))
        errors.push(`${sup}: Date must be YYYY-MM-DD`);
      if (!receiptNumber) errors.push(`${sup}: Receipt Number is required`);
    });
    return errors;
  };

  const handlePlaceOrder = () => {
    const errors = validateForms();
    if (errors.length) {
      alert(
        "Please fix the following before placing order:\n" +
          errors.map((e) => `• ${e}`).join("\n")
      );
      return;
    }

    // Defer heavy work to avoid long tasks
    setTimeout(async () => {
      const orders = suppliers.map((sup) => {
        const { branchSlug, date, receiptNumber } = formData[sup];
        const branch = branches.find((b) => b.data.slug === branchSlug)!.data;
        const items = grouped[sup].map((item) => ({
          id: item.id,
          name: item.name,
          unit: item.unit,
          unit_price: item.price,
          quantity: item.quantity,
          total_price: +(item.price * item.quantity).toFixed(2),
          image_url: item.imageUrl,
          supplier_name: item.supplierName,
          supplier_address: item.supplierAddress,
        }));
        return {
          supplier: { name: sup, address: items[0]?.supplier_address ?? "" },
          branch: {
            slug: branch.slug,
            name: branch.name,
            tin: branch.tin,
            address: branch.address,
          },
          receipt: { date, number: receiptNumber },
          items,
          subtotal: +(items.reduce((sum, i) => sum + i.total_price, 0)).toFixed(2),
        };
      });

      const cartTotal = +orders
        .reduce((sum, o) => sum + o.subtotal, 0)
        .toFixed(2);
      const payload = { orders, cartTotal };

      try {
        const res = await fetch("/api/purchase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
        alert("Order submitted successfully");
        setCartItems([]);
        localStorage.removeItem("cartItems");
      } catch (err: any) {
        console.error(err);
        alert("Submission failed: " + err.message);
      }
    }, 0);
  };

  const canSubmit = useMemo(() => {
    return (
      cartItems.length > 0 &&
      suppliers.every(
        (sup) =>
          formData[sup].branchSlug &&
          formData[sup].date &&
          formData[sup].receiptNumber
      )
    );
  }, [cartItems, formData, suppliers]);

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      {suppliers.map((sup) => {
        const items = grouped[sup];
        const subtotal = items.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );
        const { branchSlug, date, receiptNumber } = formData[sup];
        const humanized =
          date && datePattern.test(date) && isValid(parseISO(date))
            ? format(parseISO(date), "PPP")
            : "";

        return (
          <Card key={sup}>
            <CardHeader>
              <CardTitle className="text-lg">{sup}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}× {item.name}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <div>
                <label
                  htmlFor={`branch-${sup}`}
                  className="block text-sm font-medium mb-1"
                >
                  Branch
                </label>
                <Select
                  value={branchSlug}
                  onValueChange={(value) =>
                    handleFieldChange(sup, "branchSlug", value)
                  }
                  required
                >
                  <SelectTrigger id={`branch-${sup}`}>
                    <SelectValue placeholder="— select branch —" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b.data.slug} value={b.data.slug}>
                        {b.data.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor={`date-${sup}`}
                  className="block text-sm font-medium mb-1"
                >
                  Date
                </label>
                <div className="flex space-x-4">
                  <div className="w-1/3">
                    <Input
                      id={`date-${sup}`}
                      value={date}
                      onChange={(e) =>
                        handleFieldChange(sup, "date", e.target.value)
                      }
                      placeholder="YYYY-MM-DD"
                      required
                    />
                  </div>
                  {humanized && (
                    <p className="flex items-center text-sm text-muted-foreground">
                      {humanized}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor={`receipt-${sup}`}
                  className="block text-sm font-medium mb-1"
                >
                  Receipt Number
                </label>
                <Input
                  id={`receipt-${sup}`}
                  value={receiptNumber}
                  onChange={(e) =>
                    handleFieldChange(sup, "receiptNumber", e.target.value)
                  }
                  placeholder="ABC-12345"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <span className="font-medium">Subtotal:</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </CardFooter>
          </Card>
        );
      })}

      <div className="pt-4">
        <Button
          size="lg"
          onClick={handlePlaceOrder}
          disabled={!canSubmit}
          className="w-full"
        >
          Submit Purchase
        </Button>
      </div>
    </div>
  );
}
