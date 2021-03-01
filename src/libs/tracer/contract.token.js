import { useEffect, useState, createContext, useContext } from 'react'
import { useNetwork, useAccount } from '@libs/web3'
import { TRACER_TOKEN_ABI } from './_config'

const Context = createContext({});

const useContract = () => useContext(Context)

const Provider = 
	({
		children
	}) => {

		let { contractAddresses, web3 } = useNetwork()
		let { address } = useAccount()
		let [contract, setContract] = useState()
		const [userBalance, setUserBalance] = useState()
		const [totalSupply, setTotalSupply] = useState()

		// init contract
		useEffect(() => {
			if(contractAddresses?.tracerToken && web3){
				const _contract = new web3.eth.Contract(TRACER_TOKEN_ABI, contractAddresses?.tracerToken)
				setContract(_contract)
			}
		}, [contractAddresses?.tracerToken]) // eslint-disable-line


		useEffect(() => !!contract && !!address && fetchBalance(), [contract, address]) // eslint-disable-line
		useEffect(() => !!contract && getTotalSupply(), [contract]) // eslint-disable-line

		const fetchBalance = async () => {
			const _bal = await contract.methods.balanceOf(address).call()
			setUserBalance(_bal)
		}

		const getTotalSupply = async () => {
			const _totalSupply = await contract.methods.totalSupply().call()
			console.log(_totalSupply)
			setTotalSupply(_totalSupply)
		}

		// NOTE TO DEV: USE THIS TO ALLOW A DAO CONTRACT TO SPEND TRACER TOKENS
		const __APPROVE = async () => {
			if(!address || !contractAddresses?.tracerToken || !contractAddresses?.tracerDao) {
				console.log('Address or Contract not defined')
			}else{
				try {
					const TracerTokenContract = new web3.eth.Contract(TRACER_TOKEN_ABI, contractAddresses?.tracerToken)
					const approved = await TracerTokenContract.methods.allowance(address, contractAddresses?.tracerDao).call()

					if (approved !== '0') {
						return
					}
					const approvalAmount = await TracerTokenContract.methods.totalSupply().call()
					await TracerTokenContract.methods.approve(contractAddresses?.tracerDao, approvalAmount).send({from: address})
				} catch(e) {
					console.log(e.message)
				}
			}
		}

		return <Context.Provider 
			value={{
				address: contractAddresses?.tracerToken,
				userBalance,
				totalSupply,
				fetchBalance,
				contract,
				__APPROVE,
				// expose more methods here to interact with the contract
			}}
			>
			{children}
		</Context.Provider>
	};

export default {
	Provider,
	useContract
}