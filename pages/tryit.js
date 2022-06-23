import { useState } from 'react'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001')

import {
    nftAddress, coreAddress
} from '../config'

import McNFTenjoyer from '../artifacts/contracts/McNFTenjoyer.sol/McNFTenjoyer.json'
import Core from '../artifacts/contracts/Core.sol/Core.json'

export default function TryIt() {
    const [fileUrl, setFileUrl] = useState(null)
    const [input, setInput] = useState({ price: '', name: '', description: '' })

    async function onChange(event) {
        const file = event.target.files[0]
        try {
            const add = await client.add(file)
            const url = `https://ipfs.infura.io/ipfs/${add.path}`
            setFileUrl(url)
        } catch (error) {
         console.log('error uploaindg file: ', error)   
        }
    }

    async function uploadToIpfs() {
        const { price, name, description } = input
        if (!price || !fileUrl) return
        const data = JSON.stringify({
            name, description, image: fileUrl
        })
        try {
            const add = await client.add(data)
            const tokenUrl = `https://ipfs.infura.io/ipfs/${add.path}`
            return tokenUrl
        } catch (error) {
            console.log('error uploaiding file: ', error)
        }
    }

    async function mintAndList() {
        const tokenUrl = await uploadToIpfs()
        const web3Modal = new Web3Modal()
        const instance = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(instance)
        const signer = provider.getSigner()

        const nftContract = new ethers.Contract(nftAddress, McNFTenjoyer.abi, signer)
        const coreContract = new ethers.Contract(coreAddress, Core.abi, signer)
        const price = ethers.utils.parseUnits(input.price, 'ether')

        await(await nftContract.mint(tokenUrl)).wait()
        await(await nftContract.setApprovalForAll(coreContract, true)).wait()
        const tokenId = await nftContract.tokenId()
        await(await coreContract.listItem(nftAddress, tokenId, price)).wait()

    }

    return (
        <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => setInput({ name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => setInput({ description: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => setInput({ price: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <button onClick={mintAndList} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Create NFT
        </button>
      </div>
    </div>
    )
}