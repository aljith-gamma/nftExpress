import { createContext, useContext, useRef, useState } from 'react'
import { ethers, formatEther, parseEther } from 'ethers';
import NFTExpress from 'src/contracts/NftExpress.sol/NftExpress.json'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from 'src/utils/cloudinary';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const [contract, setContract] = useState(null);
    const [userData, setUserData] = useState({
        name: '',
        account: '',
        auth: false,
        balance: 0,
        provider: ''
    })

    const [fTokens, setFTokens] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [reload, setReload] = useState(false);

    const toastId = useRef(null);
    const navigate = useNavigate();

    const handleUserData = (name, address, auth) => {
        setUserData({
            name,
            address,
            auth
        })
    }

    const connectWallet = async (name) => {
        if(window.ethereum) {
            setIsLoading(true);
            const [account] = await window.ethereum.request({ method: "eth_requestAccounts"});
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contractData = new ethers.Contract("0x2056eee99eCd7DC5aad7810b092aAe5900F89D27", NFTExpress.abi, signer);
            const balance = await provider.getBalance(account);

            if(name) {
                try {
                    await contractData.registerUser(name);
                } catch (error) {
                    console.log(error);
                    toast.dismiss(toastId.current);
                    toastId.current = toast.error(error.reason || "Something went wrong!");
                    return;
                } finally {
                    setIsLoading(false);
                }
            }

            const userName = await contractData.names(account);
            if(!userName) {
                toast.dismiss(toastId.current);
                toastId.current = toast.error("User don't have an account!");
                setIsLoading(false);
                return;
            }
            
            setContract(contractData);
            setUserData({
                ...userData,
                account,
                balance: formatEther(balance),
                auth: true,
                name: userName
            })
            toast.dismiss(toastId.current);
            toastId.current = toast.success('Successfully Connected!');
            setIsLoading(false);
            navigate('/');
        }
    }

    const removeWallet = () => {
        setUserData({
            userData,
            account: '',
            name: '',
            auth: false
        })
        toast.dismiss(toastId.current);
        toastId.current = toast.success('Logged out Successfully!');
    }

    const getTokenData = async () => {
        const FTokens = await contract.getFTokens();
        
        const allTokens = [];
        for(const token of FTokens){
            const tokenId = Number(token.tokenId);
            const name = token.name;
            const symbol = token.symbol;
            const totalSupply = Number(token.supply);
            const price = formatEther(token.price);
            const usersOwned = Number(token.usersOwned);
            const available = Number(token.available);

            const tokenData = {
                tokenId,
                name, symbol,
                totalSupply, 
                price,
                usersOwned,
                available
            }
            
            allTokens.push(tokenData);
        }
        
        setFTokens([...allTokens]);
    }

    const getNFTokenData = async () => {
        const NFTokens = await contract.getNFTokens();
        
        const allTokens = [];

        for(const token of NFTokens){
            const owner = token.owner;
            const tokenId = Number(token.tokenId);
            const timestamp = Number(token.timestamp);
            const uri = token.tokenUri;
            const price = formatEther(token.price);
            const sell = token.sell();

            const tokenData = {
                owner,
                tokenId,
                timestamp,
                uri,
                price,
                sell
            }
            
            allTokens.push(tokenData);
        }
        return allTokens;
    }

    const getSellingNfts = async () => {
        const sellingNfts = await contract.getSellingNFts();
        const allTokens = [];
        for(const token of sellingNfts){
            const owner = token.owner;
            const tokenId = Number(token.tokenId);
            const timestamp = Number(token.timestamp);
            const uri = token.tokenUri;
            const price = formatEther(token.price);

            const tokenData = {
                owner,
                tokenId,
                timestamp,
                uri,
                price
            }
            
            allTokens.push(tokenData);
        }
        return allTokens;
    }

    const sellNft = async (tokenId, price) => {
        setIsLoading(true);
        try {
            const res = await contract.sellMyNft(tokenId, price);
            console.log({ res })
        } catch (error) {
            console.log(error);
            toast.dismiss(toastId.current);
            toastId.current = toast.error(error.reason || "Something went wrong!");
            return false;
        }finally {
            setIsLoading(false);
        }
    }

    const getMyTokenCount = async (id) => {
        const tokenCount = await contract.getMyBalance(id);
        return Number(tokenCount);
    }

    const getMyNFTokenData = async () => {
        const getMyTokens = await contract.getMyNFTokens();
        const allTokens = [];
        for(const token of getMyTokens){
            const owner = token.owner;
            const tokenId = Number(token.tokenId);
            const timestamp = Number(token.timestamp);
            const uri = token.tokenUri;
            const price = formatEther(token.price);
            const sell = token.sell;

            const tokenData = {
                owner,
                tokenId,
                timestamp,
                uri,
                price,
                sell
            }
            
            allTokens.push(tokenData);
        }
        return allTokens;
    }

    const buyTokens = async (tokenId, amount, tokenPrice) => {
        setIsLoading(true);
        const amountInEther = (amount * Number(tokenPrice)).toFixed(18);
        const amountInWei = parseEther(amountInEther.toString());
        
        try {
            const response = await contract.buyToken(tokenId, amount, { value: amountInWei });
            console.log({ response })
        } catch (error) {
            console.log(error);
            toast.dismiss(toastId.current);
            toastId.current = toast.error(error.reason || "Something went wrong!");
            return false;
        }finally {
            setIsLoading(false);
        }
        setReload(!reload);
        return true;
    }

    const addNft = async (uri, price) => {
        try {
            const response = await contract.addNft(uri, price);
            console.log({ response })
        } catch (error) {
            console.log(error);
            toast.dismiss(toastId.current);
            toastId.current = toast.error(error.reason || "Something went wrong!");
            return false;
        }finally {
            setIsLoading(false);
        }
        return true;
    }

    const cancelSellNft = async (tokenId) => {
        setIsLoading(true);
        try {
            const res = await contract.cancelSellNft(tokenId);
            console.log({ res })
        } catch (error) {
            console.log(error);
            toast.dismiss(toastId.current);
            toastId.current = toast.error(error.reason || "Something went wrong!");
            return false;
        }finally {
            setIsLoading(false);
        }
    }

    const buyNft = async (tokenId, tokenPrice) => {
        setIsLoading(true);
        const amountInEther = (Number(tokenPrice)).toFixed(18);
        const amountInWei = parseEther(amountInEther.toString());

        try {
            const res = await contract.buyNft(tokenId, { value: amountInWei });
            console.log({ res })
        } catch (error) {
            console.log(error);
            toast.dismiss(toastId.current);
            toastId.current = toast.error(error.reason || "Something went wrong!");
            return false;
        }finally {
            setIsLoading(false);
        }
    }

    const sellFToken = async (tokenId, amount) => {
        setIsLoading(true);

        try {
            const res = await contract.sellFToken(tokenId, amount);
            console.log({ res })
            return res;
        } catch (error) {
            console.log(error);
            toast.dismiss(toastId.current);
            toastId.current = toast.error(error.reason || "Something went wrong!");
            return false;
        }finally {
            setIsLoading(false);
        }
    }

    const cancelSellFToken = async (tokenId) => {
        setIsLoading(true);

        try {
            const res = await contract.cancelSellFToken(tokenId);
            console.log({ res })
        } catch (error) {
            console.log(error);
            toast.dismiss(toastId.current);
            toastId.current = toast.error(error.reason || "Something went wrong!");
            return false;
        }finally {
            setIsLoading(false);
        }
    }

    const getMySellingFts = async () => {
        setIsLoading(true);

        try {
            const res = await contract.getMySellingFts();
            const allTokens = [];
            for(const token of res){
                const id = Number(token.id);
                const name = token.name;
                const owner = token.owner;
                const tokenId = Number(token.tokenId);
                const amount = Number(token.amount);
                const isBuyer = token.isBuyer;
                const buyer = token.buyer;
                const sell = token.sell;
    
                const tokenData = {
                    id,
                    owner,
                    tokenId,
                    name,
                    sell,
                    amount,
                    isBuyer,
                    buyer
                }
                
                allTokens.push(tokenData);
            }
            console.log(allTokens)
            return allTokens;
        } catch (error) {
            console.log(error);
            toast.dismiss(toastId.current);
            toastId.current = toast.error(error.reason || "Something went wrong!");
            return false;
        }finally {
            setIsLoading(false);
        }
    }

    const acceptTransaction = async (sellingFTokenIndex, isAccept) => {
        setIsLoading(true);

        try {
            const res = await contract.acceptTransaction(sellingFTokenIndex, isAccept);
            console.log({ res })
        } catch (error) {
            console.log(error);
            toast.dismiss(toastId.current);
            toastId.current = toast.error(error.reason || "Something went wrong!");
            return false;
        }finally {
            setIsLoading(false);
        }
    }

    const getTokenPrice = async (tokenId) => {
        try {
            const res = await contract.FTokens(tokenId);
            return Number(res.price);
        } catch (error) {
            console.log(error.message);
        }
    }

    const buyTokenFromSeller = async (seller, tokenId, amount) => {
        setIsLoading(true);
        
        try {
            const price = await getTokenPrice(tokenId);
            const amountInWei = formatEther(price * amount);
            const res = await contract.buyTokenFromSeller(seller, tokenId, { value: parseEther(amountInWei) });
            console.log({ res })
        } catch (error) {
            console.log(error);
            toast.dismiss(toastId.current);
            toastId.current = toast.error(error.reason || "Something went wrong!");
            return false;
        }finally {
            setIsLoading(false);
        }
    }

    const getSellingFts = async () => {
        setIsLoading(true);

        try {
            const res = await contract.getSellingFts();
            const allTokens = [];
            for(const token of res){
                const id = Number(token.id);
                const name = token.name;
                const owner = token.owner;
                const tokenId = Number(token.tokenId);
                const amount = Number(token.amount);
                const isBuyer = token.isBuyer;
                const buyer = token.buyer;
                const sell = token.sell;
    
                const tokenData = {
                    id,
                    owner,
                    tokenId,
                    name,
                    sell,
                    amount,
                    isBuyer,
                    buyer
                }
                
                allTokens.push(tokenData);
            }
            return allTokens;
        } catch (error) {
            console.log(error);
            toast.dismiss(toastId.current);
            toastId.current = toast.error(error.reason || "Something went wrong!");
            return [];
        }finally {
            setIsLoading(false);
        }
    }

    // const getAllTransactions = async () => {
    //     try {
    //         const response = await contract.getTransactions();
    //         const transactions = [];
    //         for (let transaction of response) {
    //             const id = Number(transaction.id);
    //             const from = transaction.from;
    //             const _from = transaction._from;
    //             const to = transaction.to;
    //             const _to = transaction._to;
    //             const amount = Number(transaction.amount);
    //             const date = Number(transaction.date) * 1000;
                
    //             transactions.push({
    //                 id,
    //                 from,
    //                 _from,
    //                 to,
    //                 _to,
    //                 amount,
    //                 date
    //             });
    //         }
    //         return transactions;
    //     } catch (error) {
    //         console.log(error);
    //         toast.dismiss(toastId.current);
    //         toastId.current = toast.error(error.reason || "Something went wrong!");
    //     }finally {
    //         setIsLoading(false);
    //     }
    //     return [];
    // }

    const uploadFileToClound = async (file, folderName) => {
        setIsLoading(true);
        const uri = await uploadFile(file, folderName);
        !uri && setIsLoading(false);
        return uri;
    }

    return (
        <StateContext.Provider value={{
            userData,
            handleUserData,
            isLoading,
            connectWallet,
            removeWallet,
            getTokenData,
            fTokens,
            getMyTokenCount,
            buyTokens,
            uploadFileToClound,
            addNft,
            getNFTokenData,
            getSellingNfts,
            sellNft,
            getMyNFTokenData,
            cancelSellNft,
            buyNft,
            sellFToken,
            cancelSellFToken,
            getMySellingFts,
            acceptTransaction,
            buyTokenFromSeller,
            getSellingFts
        }}>
            { children }
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);