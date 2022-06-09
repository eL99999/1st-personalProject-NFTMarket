import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import {
    exchangeAddress
} from ''

export default function McNFT() {

    const [nftsArray, setnftsArray] = useState([])

    useEffect(() => {
        loadNfts()
    })

    // auto displays everysingle monkey pic on render, hardcode this one

    // a function that triggers sc sale function 

    // a function that triggers 'buy now' function which gets array loaded & stored, then return that array on display
    function loadNfts() {
        //web 3 modal stuff, get signer to get the contract
        const web3Modal = new Web3Modal
        const instance = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(instance)

        const contract = new ethers.Contract(exchangeAddress, Exchange.abi, provider)
        const nfts = await contract.buyNow(nftContract, ??)

        const nftContract = new ethers.Contract(nftAddress, nft.abi, provider) //only need signer for signing transactions,

        //contract.buyNow

        //this map is to get it into a new struct, below map is for formatted dipslay
        // async/await is the same as promise, but promiseall is all or nothing, make sure no error

        const items = await Promise.all(nfts.map(async (i) => {
            const uri = await nftContract.tokenURI(i.tokenId)
            const meta = await axios.get(uri)
            const price = ethers.utils.formatEther(i.price)

            const item = {
                price,
                img: meta.data.image,
                name: meta.data.name,
                description: meta.data.description
            }
            return item
        }))
        setnftsArray[items]

    }

    function buyNfts() {

    }

    return (
        // returns all the monkey pics in a grid of 4 array, each with a buy button and price 
        <div>
            <h1>hello</h1>

        </div>
    )
}