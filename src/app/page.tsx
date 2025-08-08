'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@mui/material';
import Table from './table';
import Link from 'next/link';

// Specific entity types
interface Customer {
    id: number;
    firstName: string;
    lastName: string;
}

export default function Home() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [lastUpdated, setLastUpdated] = useState(Date.now());

    // Fetch data with proper typing
    const fetchData = useCallback(async (port: number, setState: React.Dispatch<React.SetStateAction<Customer[]>>) => {
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

        const interval = setInterval(() => {
            fetchData(8080, setCustomers);
        }, 30_000);

        return () => clearInterval(interval);
    }, [fetchData]);

    // Manual refresh
    const handleUpdate = useCallback(() => {
        setLastUpdated(Date.now());
    }, []);

    useEffect(() => {
        fetchData(8080, setCustomers);
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
            <h3>Go to <Link href='/orders'>Orders</Link></h3>
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
