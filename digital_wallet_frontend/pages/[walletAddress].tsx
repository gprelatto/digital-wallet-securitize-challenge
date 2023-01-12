import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Link from '../src/Link';
import { Alert, Grid, Typography } from '@mui/material';
import ExchangeRateCard from '../src/components/ExchangeRateCard';
import BalanceCard from '../src/components/BalanceCard';
import { useRouter } from 'next/router'
import axios from 'axios';


interface WalletInfo {
    id: number,
    address: string,
    isFavorite: boolean,
    isOld: boolean,
    createdAt: Date,
    deletedAt: Date,
  }
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
export default function WalletInfo() {
    const router = useRouter()
    const {walletAddress} = router.query
    const [exchangeRate, setExchangeRate] = useState(0);
    const [balance, setBalance] = useState(0);
    const [currency, setCurrency] = useState('USD');
    const [wallet, setWallet] = useState<WalletInfo>();
    const [rates, setRates] = useState<Rate[]>();
    const walletAPI = axios.create({baseURL: process.env.NEXT_PUBLIC_API_URL});

    const updateRate = async (currency:string, _rate: number) => {
        const theRate = rates!.find(x=> x.currency.description == currency);
        if(theRate){
            const rate_id = theRate.id
            const rate = Number(_rate)
            const { data } = await walletAPI.put('/rate-controller/update-rate',{rate_id, rate});
            if(data){
                await fetchRates()
                setExchangeRate(rate);
            }
        }
    }

    const fetchBalance = async(walletAddress: string) => {
        const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet-controller/get-wallet-balance/${walletAddress}`)
        const data = await fetchResponse.json();
        setBalance(data)
      }

    const fetchWalletInfo = async(walletAddress: string) => {
        const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet-controller/get-wallet-by-address/${walletAddress}`)
        const data : WalletInfo = await fetchResponse.json();
        setWallet(data)
    }

    const fetchRates = async () => {
        const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rate-controller/get-rates`)
        const data = await fetchResponse.json();
        setRates(data)
    };
    
    const changeRate = (currency: string) => {
        if(rates && rates.length > 0){
            const usdRate = rates.filter(x => x.currency.description == currency)
            setExchangeRate(usdRate[0].rate)
            setCurrency(currency)
        }
    }

    useEffect(() => {
            const fetchData = async () => {
                await fetchWalletInfo(walletAddress as string)
                await fetchBalance(walletAddress as string)
                await fetchRates()
              }
            if(walletAddress){
                // call the function
                fetchData().then(x=>{
                    changeRate('USD')
                })
                // make sure to catch any error
                .catch(console.error);
            }
      },[walletAddress]);

      useEffect(() => {
        if(currency && rates){
            changeRate(currency)
        }
      },[currency,rates]);

    return (
        wallet?
        <Container maxWidth="lg">
            <Box
                sx={{
                    my: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Link href="/" color="secondary">
                   {'<= Go Back'}
                </Link>                
                <Typography mt={5} mb={5}>
                    Convertion Rate & Balance for Wallet: {walletAddress}
                </Typography>

                {wallet.isOld?<Alert severity="error">Wallet is old!</Alert>: <></>}
                
                <Grid container mt={3}>
                    <Grid item xs={1} />
                    <Grid item xs={4.5} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center' }}>
                        <ExchangeRateCard rate={exchangeRate} currency={currency} updateRate={updateRate} refreshRates={fetchRates}/>
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={4.5} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center' }}>
                        <BalanceCard rates={rates!} rate={exchangeRate} balance={balance} changeRate={changeRate} />
                    </Grid>
                    <Grid item xs={1} />
                </Grid>

            </Box>
        </Container>
        :
        <><Typography mt={5} mb={5}>Non Existent Wallet</Typography></>
    );
}
