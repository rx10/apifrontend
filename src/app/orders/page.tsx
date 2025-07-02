'use client'
import { useEffect, useState } from "react";
import Table from "../table";

// Define User interface for type safety
interface Order {
    id: number;
    custId: number;
    itemName: string;
    itemPrice: number;
    itemQty: number;
    createdAt: string;
}


export default function Orders() {
    // Initialize users as an empty array with User type
    const [orders, setOrders] = useState<Order[]>([]);
    // Add loading state to handle async fetch
    const [isLoading, setIsLoading] = useState(true);
    // Add error state for API failures
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:8090');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                // Normalize API data to ensure firstName and lastName
                const normalizedData: Order[] = data.map((item: any) => ({
                    id: item.id,
                    custId: item.custId || item.cust_id || '', // Handle API key variations
                    createdAt: item.createdAt || item.created_at || '',
                    itemPrice: item.itemPrice || item.item_price || '',
                    itemName: item.itemName || item.item_name || '',
                    itemQty: item.itemQty || item.item_qty || '',
                }));
                setOrders(normalizedData);
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Failed to load users');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div>
            <h1>Orders</h1>
            <h3>Go to <a href='/'>Customers</a></h3>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <Table arr={orders} setArr={setOrders} />
            )}
        </div>
    )
}