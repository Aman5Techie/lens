'use client' 
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { client, challenge, authenticate,refreshAuthentication } from '../app';


export default function Home() {
  const [address, setAddress] = useState();
  const [token, setToken] = useState();

  useEffect(() => {
    checkConnection();
    authenticateWithRefreshToken();
    console.log("effect 1");
    
  }, []);

  async function checkConnection() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    if (accounts.length) {
      setAddress(accounts[0]);
    }
  }

  async function connect() {
    const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (account.length) {
      setAddress(account[0]);
    }
  }

  async function login() {
    try {
      const challengeInfo = await client.query({
        query: challenge,
        variables: { address },
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(challengeInfo.data.challenge.text);

      const authData = await client.mutate({
        mutation: authenticate,
        variables: { address, signature },
      });

      const { data: { authenticate: { accessToken, refreshToken } } } = authData;
      console.log(authData);
      
      setToken(accessToken);
      // Store the refresh token in local storage
      localStorage.setItem('refreshToken', refreshToken);
      console.log(['Access Token',accessToken]);
      console.log(['Refersh Token',refreshToken]);
      
      
    } catch (err) {
      console.log('Error signing in: ', err);
    }
  }

  async function authenticateWithRefreshToken() {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedRefreshToken) {
      try {
        const authData = await client.mutate({
          mutation: refreshAuthentication,
          variables: { refreshToken: storedRefreshToken },
        });

        const { data: { refreshAuthentication: { accessToken, refreshToken } } } = authData;

        setToken(accessToken);
        // Store the new refresh token in local storage
        localStorage.setItem('refreshToken', refreshToken);
      } catch (err) {
        console.log('Error refreshing token: ', err);
      
        localStorage.removeItem('refreshToken');
      }
    }
  }

  return (
    <div>
      {!address && <button onClick={connect}>Connect</button>}
      {address && !token && (
        <div onClick={login}>
          <button>Login</button>
        </div>
      )}
      {address && token && <h2>Successfully signed in!</h2>}
        

    </div>
  );
}
