import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import {
    coreAddress, nftAddress
} from '../../config'

import McNFTenjoyer from '../../artifacts/contracts/McNFTenjoyer.sol/McNFTenjoyer.json'
import Core from '../../artifacts/contracts/Core.sol/Core.json'

export default function community() {

    const [nfts, setNfts] = useState([])

    useEffect(() => {
        loadNfts()
    })

    // auto displays everysingle monkey pic on render, hardcode this one

    // a function that triggers sc sale function 

    // a function that triggers 'buy now' function which gets array loaded & stored, then return that array on display
    async function loadNfts() {
        //web 3 modal stuff, get signer to get the contract
        const provider = new ethers.providers.JsonRpcProvider()

        const contract = new ethers.Contract(coreAddress, Core.abi, provider)
        const nfts = await contract.fetchBrowse()

        const nftContract = new ethers.Contract(nftAddress, McNFTenjoyer.abi, provider) //only need signer for signing transactions,

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
        setNfts(items)
    }

    async function buyNfts(nft) {

        const web3Modal = new Web3Modal
        const instance = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(instance)
        const signer = provider.getSigner()

        const contract = new ethers.Contract(exchangeAddress, Exchange.abi, signer)
        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')

        const transaction = await contract.sale(_nftCOntract, tokenId, { value: price })
        await transaction.wait()
        loadNfts()

    }

    return (
        // returns all the monkey pics in a grid of 4 array, each with a buy button and price 
        <div className='flex justify-center'>
            <div className='px-4' style={{ maxWidth: '1600px' }}>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
                    {
                        nfts.map((nft, index) => (
                            <div key={index} className='border shadow rounded-xl overflow-hidden'>
                                <img src={nft.image} />
                                <div className='p-4'>
                                    <p style={{ height: '64px' }} className='text-2xl font-semibold'>{nft.name}</p>

                                    <div style={{ height: '70px', overflow: 'hidden' }}>
                                        <p className='text-gray-400'>{nft.description}</p>
                                    </div>
                                </div> 

                                <div className='p-4 bg-black'>
                                    <p className='text-2xl font-bold text-white'>{nft.price} ETH</p>
                                    <button className='mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded' onClick={() => buyNfts(nft)}>Buy</button>
                                </div>

                            </div>    
                        ))
                    }

                </div>

            </div>
        
        </div>
    )
}