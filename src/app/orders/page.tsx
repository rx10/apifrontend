'use client'
import { useCallback, useEffect, useState } from "react";
import Table from "../table";
import { format, parseISO } from "date-fns";
import { Button } from "@mui/material";
import Link from 'next/link';

// Generic Entity type
interface Entity {
    id: number;
}

// Define Order interface that extends Entity
interface Order extends Entity {
    custId: number;
    itemName: string;
    itemPrice: number;
    itemQty: number;
    createdAt: string;
}

interface ApiOrder {
    id: number;
    custId?: number;
    cust_id?: number;
    itemName?: string;
    item_name?: string;
    itemPrice?: number;
    item_price?: number;
    itemQty?: number;
    item_qty?: number;
    createdAt?: string;
    created_at?: string;
}

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState(Date.now());

    const orderColumns = [
        { key: 'id' as const, label: 'Order ID' },
        { key: 'custId' as const, label: 'Customer ID' },
        {
            key: 'createdAt' as const,
            label: 'Created At',
            format: (value: string) =>
                value ? format(parseISO(value), 'PPpp') : 'Invalid Date',
        },
        { key: 'itemQty' as const, label: 'Quantity' },
        { key: 'itemPrice' as const, label: 'Price' },
        { key: 'itemName' as const, label: 'Item Name' }
    ];

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch('http://localhost:8090');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data: ApiOrder[] = await response.json();
                const normalizedData: Order[] = data.map((item: ApiOrder) => ({
                    id: item.id,
                    custId: item.custId || item.cust_id || 0,
                    createdAt: item.createdAt || item.created_at || '',
                    itemPrice: item.itemPrice || item.item_price || 0,
                    itemName: item.itemName || item.item_name || '',
                    itemQty: item.itemQty || item.item_qty || 0,
                }));
                setOrders(normalizedData);
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Failed to load orders');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [lastUpdated]);

    const handleUpdate = useCallback(() => {
        setLastUpdated(Date.now());
    }, []);

    return (
        <div>
            <h1>Orders</h1>
            <h3>Go to <Link href='/'>Customers</Link></h3>
            <Button onClick={handleUpdate} variant="contained" style={{ margin: '10px' }}>
                Refresh Data
            </Button>

            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <Table
                    entities={orders}
                    setEntities={setOrders}
                    columns={orderColumns}
                    port={8090}
                />
            )}
        </div>
    )
}
