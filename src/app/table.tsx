'use client'
import ModalButton from './modal';
import './table.css';
import { ReactNode } from 'react';

// Generic Entity type
interface Entity {
    id: number;
    [key: string]: any;
}

// Column configuration
interface Column<T> {
    key: keyof T;
    label: string;
    format?: (value: any) => string | ReactNode;
}

// Table props
interface EntityTableProps<T> {
    entities: T[];
    setEntities: React.Dispatch<React.SetStateAction<T[]>>;
    columns: Column<T>[];
    port: number;
}

export default function Table<T extends Entity>({ entities,
    setEntities,
    columns,
    port,
}: EntityTableProps<T>) {

    return (
        <>
            <table>
                <thead>
                    <tr className="TopBar">
                        {columns.map((column) => (
                            <th key={String(column.key)}>{column.label}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {entities.length > 0 ? (
                        entities.map((entity) => (
                            <tr key={entity.id}>
                                {columns.map((column) => (
                                    <td key={String(column.key)}>
                                        {column.format
                                            ? column.format(entity[column.key])
                                            : entity[column.key]}
                                    </td>
                                ))}
                                <td>
                                    <ModalButton
                                        entity={entity}
                                        setEntities={setEntities}
                                        port={port}
                                        fields={columns.map((col) => ({
                                            key: String(col.key),
                                            label: col.label,
                                            type:
                                                col.key === 'createdAt' || col.key === 'orderDate'
                                                    ? 'datetime-local'
                                                    : col.key === 'totalAmount'
                                                        ? 'number'
                                                        : 'text',
                                            readOnly: col.key === 'id',
                                        }))}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length + 1}>No data found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}