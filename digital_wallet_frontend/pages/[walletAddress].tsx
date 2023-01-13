import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Link from '../src/Link';
import { Alert, Grid, Typography } from '@mui/material';
import ExchangeRateCard from '../src/components/ExchangeRateCard';
import BalanceCard from '../src/components/BalanceCard';
import { useRouter } from 'next/router'
import { WalletInfo } from '../src/interfaces/WalletInfo';
import { Rate } from '../src/interfaces/Rate';
import walletAPI from '../src/variables/WalletApi';

export default function WalletAddress() {
    const router = useRouter()
    const { walletAddress } = router.query
    const [exchangeRate, setExchangeRate] = useState(0);
    const [balance, setBalance] = useState(0);
    const [currency, setCurrency] = useState('USD');
    const [wallet, setWallet] = useState<WalletInfo>();
    const [rates, setRates] = useState<Rate[]>();

    const boxStyle = {
        my: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }

    const updateRate = async (currency: string, _rate: number) => {
        try {
            const theRate = rates!.find(x => x.currency.description == currency);
            if (theRate) {
                const rate_id = theRate.id
                const rate = Number(_rate)
                const { data } = await walletAPI.put('/rate-controller/update-rate', { rate_id, rate });
                if (data) {
                    await fetchRates()
                    setExchangeRate(rate);
                }
            }
        } catch (error) {
            console.error
        }

    }

    const fetchBalance = async (walletAddress: string) => {
        try {

        } catch (error) {
            console.error
        }
        const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet-controller/get-wallet-balance/${walletAddress}`)
        const data = await fetchResponse.json();
        setBalance(data)
    }

    const fetchWalletInfo = async (walletAddress: string) => {
        try {
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet-controller/get-wallet-by-address/${walletAddress}`)
            const data: WalletInfo = await fetchResponse.json();
            setWallet(data)
        } catch (error) {
            console.error
        }

    }

    const fetchRates = async () => {
        try {
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rate-controller/get-rates`)
            const data = await fetchResponse.json();
            setRates(data)
        } catch (error) {
            console.error
        }

    };

    const changeCurrency = (currency: string) => {
        try {
            if (rates && rates.length > 0) {
                const usdRate = rates.filter(x => x.currency.description == currency)
                setExchangeRate(usdRate[0].rate)
                setCurrency(currency)
            }
        } catch (error) {
            console.error
        }

    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchWalletInfo(walletAddress as string)
            await fetchBalance(walletAddress as string)
            await fetchRates()
        }
        if (walletAddress) {
            fetchData().then(x => {changeCurrency('USD')}).catch(console.error);
        }
    }, [walletAddress]);

    useEffect(() => {
        if (currency && rates) {
            changeCurrency(currency)
        }
    }, [currency, rates]);

    return (
        wallet ?
            <Container maxWidth="lg">
                <Box sx={boxStyle}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Link href="/" color="secondary">
                                {'<= Go Back'}
                            </Link>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography mt={5} mb={5} textAlign={'center'}>
                                Convertion Rate & Balance for Wallet: {walletAddress}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={1} />
                        <Grid item xs={10}>
                            {wallet.isOld ? <Alert severity="error">Wallet is old!</Alert> : <></>}
                        </Grid>
                        <Grid item xs={1} />
                    </Grid>


                    <Grid container mt={3}>
                        <Grid item xs={1} />
                        <Grid item xs={4.5} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center' }}>
                            <ExchangeRateCard rate={exchangeRate} currency={currency} updateRate={updateRate} refreshRates={fetchRates} />
                        </Grid>
                        <Grid item xs={1} />
                        <Grid item xs={4.5} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center' }}>
                            <BalanceCard rates={rates!} rate={exchangeRate} balance={balance} changeCurrency={changeCurrency} />
                        </Grid>
                        <Grid item xs={1} />
                    </Grid>

                </Box>
            </Container>
            :
            <Container maxWidth="lg">
                <Box sx={boxStyle}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Link href="/" color="secondary">
                                {'<= Go Back'}
                            </Link>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} mt={5}>
                            <Alert severity="error">Wallet does not exist!</Alert>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
    );
}
