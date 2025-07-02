import { Button, Modal, Box, Typography, TextField } from '@mui/material';
import { useState } from 'react';

export default function ModalButton(props: any) {
    var users = props.users;
    const setUsers = props.setUsers;
    const id = props.id;
    const [open, setOpen] = useState(false);
    const [updatedData, setUpdatedData] = useState({
        id: props.id,
        firstName: '',
        lastName: '',
    });

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:8080/${users[id].id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: updatedData.id,
                    firstName: updatedData.firstName,
                    lastName: updatedData.lastName,
                })
            });
            if (!response.ok) {
                throw new Error('Failed to update');
            }

            const updatedUsers = [...users];
            updatedUsers[id] = { ...updatedUsers[id], ...updatedData };
            alert('Data updated successfully!');
            handleClose();
        } catch (error) {
            console.error('Error updating data:', error);
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

    const handleOpen = () => {
        setUpdatedData({ ...updatedData, id: users[id].id, firstName: users[id].firstName, lastName: users[id].lastName });
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };


    return (
        <>
            <Button onClick={handleOpen}>Edit</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h6">Edit Customer</Typography>
                    <TextField
                        label="First Name"
                        value={updatedData.firstName}
                        onChange={(e) => {
                            {
                                setUpdatedData({ ...updatedData, firstName: e.target.value })
                            }
                        }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Last Name"
                        value={updatedData.lastName}
                        onChange={(e) => setUpdatedData({ ...updatedData, lastName: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <Button onClick={handleUpdate} variant="contained">Update</Button>
                </Box>
            </Modal>
        </>
    )
}