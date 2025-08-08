import { Button, Modal, Box, Typography, TextField } from '@mui/material';
import { useState } from 'react';

// Generic Entity type
interface Entity {
    id: number;
    [key: string]: any;
}

// Interface for field configuration
interface ModalField {
    key: string;
    label: string;
    type: 'text' | 'number' | 'datetime-local';
    readOnly?: boolean;
}

// Props for the reusable modal
interface ModalButtonProps<T extends Entity> {
    entity: T;
    setEntities: React.Dispatch<React.SetStateAction<T[]>>;
    fields: ModalField[];
    port: number;
    onUpdate?: (updatedData: T) => Promise<void>;
    onClose?: () => void;
}

export default function ModalButton<T extends Entity>({
    entity,
    setEntities,
    fields,
    port,
    onUpdate,
    onClose,
}: ModalButtonProps<T>) {
    const [open, setOpen] = useState(false);
    const [updatedData, setUpdatedData] = useState<{ [key: string]: any }>({ ...entity });
    const [loading, setLoading] = useState(false);

    const handleOpen = () => {
        setUpdatedData(entity);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        if (onClose) onClose();
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            // Format datetime-local fields to ISO 8601 without milliseconds
            const formattedData = { ...updatedData };
            fields.forEach((field) => {
                if (field.type === 'datetime-local' && formattedData[field.key]) {
                    try {
                        formattedData[field.key] = parseISO(formattedData[field.key]).toISOString().split('.')[0];
                    } catch (error) {
                        console.error(`Invalid date for ${field.key}:`, formattedData[field.key]);
                    }
                }
            });

            // Use onUpdate if provided, otherwise default to fetch
            if (onUpdate) {
                await onUpdate(formattedData as T);
            } else {
                const response = await fetch(`http://localhost:${port}/${entity.id}`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formattedData),
                });

                if (!response.ok) {
                    throw new Error(`Failed to update with given port: ${port}`);
                }

                // Cast the API response to type T
                const updatedEntity = await response.json() as T;
                setEntities((prev) =>
                    prev.map((item) => (item.id === entity.id ? updatedEntity : item))
                );
            }

            alert('Data updated successfully!');
            handleClose();
        } catch (error) {
            console.error(`Error updating with given port: ${port}`, error);
            alert('Failed to update data');
        } finally {
            setLoading(false);
        }
    };
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
    };

    return (
        <>
            <Button onClick={handleOpen} variant="contained">Edit</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">Edit Element</Typography>
                    {fields.map((field) => (
                        <TextField
                            key={field.key}
                            label={field.label}
                            type={field.type}
                            value={field.type === 'datetime-local' && updatedData[field.key] ? format(parseISO(updatedData[field.key]), 'yyyy-MM-dd\'T\'HH:mm') : updatedData[field.key] || ''}
                            onChange={(e) =>
                                setUpdatedData({ ...updatedData, [field.key]: e.target.value })
                            }
                            fullWidth
                            margin="normal"
                            disabled={field.readOnly || loading}
                            InputLabelProps={
                                field.type === 'datetime-local' && updatedData[field.key]
                                    ? {
                                        shrink: true
                                    }
                                    : undefined
                            }
                        />
                    ))}
                    <Button onClick={handleUpdate} variant="contained" disabled={loading}>
                        {loading ? 'Updating...' : 'Update'}
                    </Button>
                </Box>
            </Modal>
        </>
    )
}