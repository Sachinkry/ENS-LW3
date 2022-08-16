import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Web3Modal from "web3modal";
import { ethers, providers } from "ethers";
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const [ens, setEns] = useState("");
  const [address, setAddress] = useState("");


  const setENSOrAddress = async (address, web3Provider) => {
    // look up the ens related to this address
    var _ens = await web3Provider.lookupAddress(address);

    // if there's an ens, set its value by using 'setEns' otherwise 'setAddress'
    if (_ens) {
      setEns(_ens);
    } else {
      setAddress(address);
    }
    console.log(ens);
  }

  const getProviderOrSigner = async () => {
    try {
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);
      const { chainId } = await web3Provider.getNetwork();

      if (chainId !== 4) {
        window.alert("CHANGE TO RINKEBY NETWORK!!");
        throw new Error("Not on rinkeby network!!");
      }

      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();
      await setENSOrAddress(address, web3Provider);
      return signer;
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false
      });
      connectWallet();
    }
  }, [walletConnected]);

  const connectWallet = async () => {
    try {
      getProviderOrSigner(true);
      setWalletConnected(true);

    } catch (error) {
      console.error(error);
    }
  }

  const renderButton = () => {
    if (walletConnected) {
      return (
        <div><b>Wallet Connected!</b></div>
      )
    } else {
      return (
        <button className={styles.button}>Connect Wallet</button>
      );
    }
  }
  return (
    <div>
      <Head>
        <title>ENS Dapp</title>
        <meta name="description" content="ENS-Dapp" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to LearnWeb3 Punks, {ens ? ens : address}!
          </h1>
          <div className={styles.description}>
            It's an NFT collection for LearnWeb3 Punks.
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./learnweb3punks.png" />
        </div>
      </div>
      <footer className={styles.footer}>
        Made with &#10084; by Sachin!
      </footer>
    </div>
  )
}
