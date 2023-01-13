import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, IconButton, Input, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CardActions from '@mui/material/CardActions';
import { ExchangeRate } from '../interfaces/ExchangeRate';
import walletAPI from '../variables/WalletApi';

export default function ExchangeRateCard(props:ExchangeRate) {
  const [editing, setEditing] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [error, setError] = useState(false);
  

  useEffect(() => {
    if(props.rate){
      setExchangeRate(props.rate)
    }
    if(props.currency){
      setCurrency(props.currency)
    }
  },[props.rate,props.currency]);

  
  const handleUpdateExternalRates = async () => {
    const { data } = await walletAPI.put('/rate-controller/update-rate-external');
    if(data){
      await props.refreshRates()
    }
  };

  const handleEditing = () => {
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };  

  const saveEdit = () => {
    if(!exchangeRate || exchangeRate == null || exchangeRate == undefined || exchangeRate == 0)
    {
      setError(true)
      return
    } else {
      setError(false)
    }
    props.updateRate(currency,exchangeRate)
    setEditing(false);
  };  

  const handleTextChange = (e : any) => {
    setExchangeRate(e.target.value);
  };  

  const style = error ? "outlined-error" : "outlined-basic"

  return (
    <Card sx={{ minWidth: 290, minHeight:180}}>
      <CardHeader
        subheader={'Exchange Rate:'}
        action={
          editing? 
          <>
            <IconButton aria-label="close"  onClick={() => cancelEditing()}>
              <CloseIcon style={{ color: 'red' }}/>
            </IconButton>
            <IconButton aria-label="confirm" onClick={() => saveEdit()}>
              <CheckIcon style={{ color: 'green' }}/>
            </IconButton>                    
          </>
          :
          <IconButton aria-label="edit" onClick={() => handleEditing()}>
            <EditIcon/>
          </IconButton>
        }
      />
      <CardContent>
        {
          editing? 
          <>
            <TextField error={error} id={style} label="Exchange Rate" variant="outlined" value={exchangeRate} onChange={(e) => handleTextChange(e)}/>
          </> 
          : 
          <>
            <Typography align='center' fontWeight='bold'>{exchangeRate}</Typography>
          </>
        }
      </CardContent>
      <CardActions sx={{flex:1, flexDirection:'row',justifyContent:'center',alignContent:'center'}}>
        {editing? <></>: <><Button size="small" onClick={handleUpdateExternalRates}>Update Rates from CryptoCompare.com</Button></>}
      </CardActions>
    </Card>
  );
}
