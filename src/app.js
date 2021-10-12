App={
    contracts:{},
      load: async()=>{
          await App.loadWeb3()
          await App.loadContract()
          await App.render()
      },
      loadWeb3: async () => {
          if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
          } else {
            window.alert("Please connect to Metamask.")
          }
          // Modern dapp browsers...
          if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
              // Request account access if needed
              await ethereum.enable()
              // Acccounts now exposed
              web3.eth.sendTransaction({/* ... */})
            } catch (error) {
              // User denied account access...
            }
          }
          // Legacy dapp browsers...
          else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */})
          }
          // Non-dapp browsers...
          else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
          }
        },
        loadContract: async ()=>{
          const DrugCounterfiet= await $.getJSON('DrugCounterfiet.json')
          App.contracts.DrugCounterfiet = TruffleContract(DrugCounterfiet)
          App.contracts.DrugCounterfiet.setProvider(App.web3Provider)
      
          // Hydrate the smart contract with values from the blockchain
          App.DrugCounterfiet = await App.contracts.DrugCounterfiet.deployed()
        },
        render:async()=>{
          web3.eth.getCoinbase(function(err, account) {
            if(err === null) {
              App.account = account;
              $('#account').html(App.account)
            }
          });
        },
      }
      $(()=>{
          $(window).load(()=>{
              App.load()
          })
      })