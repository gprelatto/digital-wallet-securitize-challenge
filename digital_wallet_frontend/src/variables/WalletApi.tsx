import axios from "axios";

const walletAPI = axios.create({baseURL: process.env.NEXT_PUBLIC_API_URL});
export default walletAPI