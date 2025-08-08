'use client';

//USED LLM FOR THIS CODE (IT WAS TOO ANNOYING TO WRITE IT MYSELF)

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@mui/material';
import Table from './table';

// Specific entity types
interface Customer {
    id: number;
    firstName: string;
    lastName: string;
}

interface Order {
    id: number;
    custId: number;
    createdAt: string;
    itemQty: number;
    itemPrice: number;
    itemName: string;
}

export default function Home() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [lastUpdated, setLastUpdated] = useState(Date.now());

    // Fetch data
    const fetchData = useCallback(async (port: number, setState: any) => {
        try {
            const response = await fetch(`http://localhost:${port}`);
            if (!response.ok) throw new Error(`Failed to fetch from port: ${port}`);
            const data = await response.json();
            setState(data);
        } catch (error) {
            console.error(`Error fetching from given port: ${port}:`, error);
        }
    }, []);

    // Initial fetch and polling
    useEffect(() => {
        fetchData(8080, setCustomers);
        fetchData(8090, setOrders);

        const interval = setInterval(() => {
            fetchData(8080, setCustomers);
            fetchData(8090, setOrders);
        }, 30_000);

        return () => clearInterval(interval);
    }, [fetchData]);

    // Manual refresh
    const handleUpdate = useCallback(() => {
        setLastUpdated(Date.now());
    }, []);

    useEffect(() => {
        fetchData(8080, setCustomers);
        fetchData(8090, setOrders);
    }, [lastUpdated, fetchData]);

    // Column configurations
    const customerColumns = [
        { key: 'id' as const, label: 'ID' },
        { key: 'firstName' as const, label: 'First Name' },
        { key: 'lastName' as const, label: 'Last Name' },
    ];

    return (
        <>
            <h1>Customers</h1>
            <h3>Go to <a href='/orders'>Orders</a></h3>
            <Button onClick={handleUpdate} variant="contained" style={{ margin: '10px' }}>
                Refresh Data
            </Button>
            <Table
                entities={customers}
                setEntities={setCustomers}
                columns={customerColumns}
                port={8080}
            />
        </>
    );
}