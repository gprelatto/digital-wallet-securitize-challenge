import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


interface Currency {
  id: number,
  description: string,
  createdAt: Date,
  deletedAt: Date,
}

interface Rate {
  id: number,
  rate: number,
  currency: Currency,
  createdAt: Date,
  deletedAt: Date
}


interface Balance {
  rates: Rate[],
  rate: number,
  balance: number,
  changeRate: (currency: string) => void
}



export default function BalanceCard(props: Balance) {
  const [editing, setEditing] = React.useState(false);
  const [exchangeRate, setExchangeRate] = React.useState(0);
  const [balance, setBalance] = React.useState(0);
  const [convertedBalance, setConvertedBalance] = React.useState(0);
  const [error, setError] = React.useState(false);
  const [currency, setCurrency] = React.useState('USD');
  const [rates, setRates] = React.useState<Rate[]>();

  useEffect(() => {
    if(props.rate || props.balance || props.rates){
      setExchangeRate(props.rate);
      setBalance(Number(props.balance.toFixed(2)));
      const converted = props.rate * props.balance;
      setConvertedBalance(Number(converted.toFixed(2)))
      setRates(props.rates)
    }
  },[props.rate, props.balance,props.rates]);

  const handleChange = (event: any) => {
    setCurrency(event.target.value);
    props.changeRate(event.target.value)
  };

  const handleTextChange = (e : any) => {
    setExchangeRate(e.target.value);
  };  

  const style = error ? "outlined-error" : "outlined-basic"

  return (
    rates? 
    <Card sx={{ minWidth: 275 }}>
      <CardHeader sx={{ flex:1, flexDirection: 'row',alignItems: 'flex-end'}}
        subheader={
          <Typography mr={2}>{balance} ETH to: </Typography>
        }   
        action={
          <FormControl variant="standard" sx={{ minWidth: 120 }}>
            <InputLabel id="currency-select-label"></InputLabel>
            <Select
              labelId="currency-select-label"
              id="currency-select-label"
              value={currency}
              label="Age"
              onChange={handleChange}
            >
              {props.rates.map((element,index) => {
                return <MenuItem key={index} value={element.currency.description}>{element.currency.description}</MenuItem>
              })}
            </Select>
          </FormControl>
        }
      />
      <CardContent>
        {
          <>
            <Typography align='center' fontWeight='bold'>{convertedBalance}</Typography>
          </>
        }
      </CardContent>
    </Card>
    : <></>
  );
}
