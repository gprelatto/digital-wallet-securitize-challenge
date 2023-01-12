import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { IconButton, Button, TextField,Grid  } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Link from '../src/Link';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';

export default function DataTable() {
  const [rows, setRows] = useState([]);
  const [updateData, setUpdateData] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState(false);

  const walletAPI = axios.create({baseURL: process.env.NEXT_PUBLIC_API_URL});


  const fetchWallets = async() => {
    try {
      const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet-controller/get-wallets`)
      if(fetchResponse.status == 204){
        setRows([])
        return;
      }
      const data = await fetchResponse.json();
      setRows(data)
    } catch (error) {
      alert(error)
    }

  }

  const updateFav = async(address: string) => {
    try {
      const { data } = await walletAPI.put('/wallet-controller/fav-wallet', { address });
      setUpdateData(true)
    } catch (error) {
      alert(error)
    }

  }

  const removeWallet = async(address: string) => {
    try {
      const { data } = await walletAPI.post(`/wallet-controller/remove-wallet/${address}`);
      setUpdateData(true)
    } catch (error) {
      alert(error)
    }

  }

  const saveWallet = async() => {
    try {
      if(!walletAddress)
      {
        setError(true)
        return;
      } else {
        setError(false)
        const { data } = await walletAPI.post('/wallet-controller/save-wallet', { 'address':walletAddress });
        setUpdateData(true)      
      }
    } catch (error) {
      alert(error)
    }

  }
  
  const style = error ? "outlined-error" : "outlined-basic"
  
  useEffect(() => {
    fetchWallets()
  },[]);

  useEffect(() => {
    if(updateData){
      fetchWallets()
      setUpdateData(false)
    }
  },[updateData]);
  
  const columns: GridColDef[] = [
    {
      field: "Favs",
      headerName: "Favs",
      sortable: true, 
      flex: 0.1,
      renderCell: (params) => {
        const onClick = (e: any) => {
          updateFav(params.row.address)
        };
  
        return <IconButton aria-label="close" onClick={onClick}>
                {params.row.isFavorite?
                  <StarIcon style={{ color: 'yellow' }} /> : 
                  <StarBorderIcon />
                }
              </IconButton>
      }
    },
    { field: 'address', headerName: 'Wallet Address', width: 130, flex: 1 },
    { field: 'isOld', headerName: 'Is Old Wallet?', width: 130, flex: 0.5 },
    {
      field: "balance",
      headerName: "Balance",
      sortable: false,
      flex: 0.12,
      renderCell: (params) => {
        const link = '/' + params.row.address
        return <Link href={link} color="secondary">View</Link>
      }
    },  
    {
      field: "action",
      headerName: "Actions",
      sortable: false,
      flex: 0.12,
      renderCell: (params) => {
        const onClick = (e: any) => {
          removeWallet(params.row.address)
        };
        return <IconButton aria-label="close" onClick={onClick}>
                    <CloseIcon style={{ color: 'red' }} />
                </IconButton>
      }
    },     
  ];


  const handleTextChange = (e : any) => {
    setWalletAddress(e.target.value);
  }; 

  return (
    <Container>
        <Grid mt={3} mb={1} sx={{display: 'flex',flexDirection: 'row',flexWrap: 'nowrap',justifyContent: 'center',alignItems: 'center'}}>
          <Grid xl={4} mr={1}>
            <Typography>Insert wallet Address:</Typography>
          </Grid>
          <Grid xl={4}>
            <TextField error={error} id={style} label="Wallet Address" variant="outlined" value={walletAddress} onChange={(e) => handleTextChange(e)}></TextField>
          </Grid>
          <Grid xl={4} ml={1}>
            <Button onClick={saveWallet}>Save</Button>
          </Grid>
        </Grid>      
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[10]}
          />
        </div>
      </Box>
    </Container>
  );
}
