import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import {
    exchangeAddress
} from ''

export default function Bayc() {

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const exchangeSC = await ethers.Contract(exchangeAddress, Exchange.abi, signer)

    // auto displays everysingle monkey pic on render, hardcode this one

    // a function that triggers sc sale function 

    // a function that triggers 'buy now' function which gets an array, then return that array on display
    return (
        // returns all the monkey pics in a grid of 4 array, each with a buy button and price 
        <div>
            <h1>hello</h1>

        </div>
    )
}