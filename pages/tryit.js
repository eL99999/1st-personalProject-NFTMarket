import { useState } from 'react'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001')

import {
    nftAddress, coreAddress
} from '../config.js'

import McNFTenjoyer from '../artifacts/contracts/McNFTenjoyer.sol/McNFTenjoyer.json'
import Core from '../artifacts/contracts/Core.sol/Core.json'

export default function TryIt() {
    const [fileUrl, setFileUrl] = useState(null)
    const [price, setPrice] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

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
        if (!price || !fileUrl || !name || !description) return
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

        let nftContract = new ethers.Contract(nftAddress, McNFTenjoyer.abi, signer)
        let coreContract = new ethers.Contract(coreAddress, Core.abi, signer)
        const _price = ethers.utils.parseEther(price.toString())

        await(await nftContract.mint(tokenUrl)).wait()
        await(await nftContract.setApprovalForAll(coreAddress, true)).wait()
        const tokenId = await nftContract.tokenId()
        await(await coreContract.listItem(nftAddress, tokenId, _price)).wait()

    }

    return (
        <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => setName(e.target.value)}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => setDescription(e.target.value)}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => setPrice(e.target.value )}
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