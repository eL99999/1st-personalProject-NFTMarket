import '../styles/globals.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'

function MyApp({ Component, pageProps }) {
  const [address, setAddress] = useState("")

  async function connectWallet() {
    const web3Modal = new Web3Modal()
    const instance = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(instance)
    const address = await provider.getSigner().getAddress()
    setAddress(address)


  }
  return (
    <div>


        <nav>
          <Link href='./'>
            <a className='absolute top-4 right-96 m-6 px-4 border-2 text-purple-500'>
              Home
            </a>
          </Link>
          <Link href='./collections'>
            <a className='absolute top-4 right-56 m-6 px-4 border-2 text-purple-600'>
              Collections
            </a>
          </Link>
          <Link href='./user'>
            <a className='absolute top-20 right-16 m-6 px-4 border-4 border-solid border-blue-200'>
              My profile
            </a>
          </Link>

        </nav>

        <button onClick={connectWallet} className='absolute top-4 right-10 m-6 border-2 px-4 border-solid border-slate-300 hover:border-indigo-300 text-purple-400'>
          Connect Wallet</button>
          <p>{address}</p>



 


    <Component {...pageProps} />
    </div>
  )
}

export default MyApp
