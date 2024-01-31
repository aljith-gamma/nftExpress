import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useStateContext } from 'src/context';

const AddNftModal = ({ handleClose, open }) => {
    const [data, setData] = useState({
        title: '',
        description: '',
        price: ''
    })

    const [file, setFile] = useState(null);

    const { uploadFileToClound, addNft } = useStateContext();
    
    const handleChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleChangeText = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData({
            ...data,
            [name]: value
        })
    }

    const uploadNFT = async (e) => {
        e.preventDefault();

        const imageUri = await uploadFileToClound(file, "nft-images");
        if(!imageUri) return;
        const metaData = {
            ...data,
            uri: imageUri
        }
        const nftUri = await uploadFileToClound(JSON.stringify(metaData), "nfts");
        const res = await addNft(nftUri, +data.price);
        res && handleClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} >
            <Box mt={1}>
                <DialogTitle>Add your NFT</DialogTitle>
                <form onSubmit={uploadNFT}>
                    <DialogContent>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <TextField
                                label="Title"
                                type="text"
                                name="title"
                                value={data.title}
                                variant="standard"
                                onChange={handleChangeText}
                                sx={{
                                    width: "400px"
                                }}
                                required
                            />
                            <TextField
                                label="Description"
                                type="text"
                                variant="standard"
                                name="description"
                                value={data.description}
                                onChange={handleChangeText}
                                multiline
                                sx={{
                                    width: "400px"
                                }}
                                required
                            />
                            <TextField
                                label="Price"
                                type="number"
                                variant="standard"
                                name="price"
                                value={data.price}
                                onChange={handleChangeText}
                                sx={{
                                    width: "400px"
                                }}
                                required
                            />
                            <TextField
                                label="Amount"
                                type="file"
                                variant="standard"
                                onChange={handleChange}
                                sx={{
                                    width: "400px"
                                }}
                                required
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Box display="flex" gap={2} px={2} pb={2}>
                            <Button onClick={handleClose} variant='outlined' color='inherit' sx={{
                                width: "110px"
                            }}>Cancel</Button>
                            <Button type='submit' onClick={uploadNFT} variant='contained' color='success' sx={{
                                width: "110px"
                            }}>Add NFT</Button>
                        </Box>
                    </DialogActions>
                </form>
            </Box>
        </Dialog>
    )
}

export default AddNftModal