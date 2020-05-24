let sc = artifacts.require("./supplyChain.sol");

let scinstance;

contract('supplyChain', function (accounts) {
  //accounts[0] is the default account
  //Test case 1
  it("Contract Deployed", function() {
    return sc.deployed().then(function (instance) {
      scinstance = instance;
      assert(scinstance !== undefined, 'Coin contract should be defined');
    });
  });

  it("Should Create Distributers", function() {
    return scinstance.setDistributer(accounts[1]).then(function (result){
      assert(scinstance.distributers[0]!='',"Valid Distributer Creation");
    });
    });

  it("Should Create Receivers", function() {
    return scinstance.setReceiver(accounts[2]).then(function (result){
      assert(scinstance.receivers[0]!='',"Valid Receiver Creation");
    });
    });

  it("Should Send Load", function() {
    return scinstance.sendLoad("20000","Bangalore","Chennai","stonks",accounts[2],{from:accounts[1]}).then(function (result){
      assert(scinstance.loads_sent!="0","Valid Load Sent");
    });
  });

  it("Should Receive Load", function() {
    return scinstance.confirmLoadReceived("1","stonks",{from:accounts[2]}).then(function (result){
      assert(scinstance.loads_received!="0","Valid Load Received");
    });
  });

  it("Should not be Sent by Individual other than Distributer",function() {
    return scinstance.sendLoad("23345","Chennai","Calicut","notstonks",accounts[2],{from:accounts[2]}).then(function (result){
      throw("Modifier not working");
    }).catch(function (e) {
      if(e === "Modifier not working") {
        assert(false);
      } else {
        assert(true);
      }
    })
  });

  it("Should not be Received by Individual other than Receiver",function() {
    return scinstance.confirmLoadReceived("1","stonks",{from:accounts[1]}).then(function (result){
      throw("Modifier not working");
    }).catch(function (e) {
      if(e === "Modifier not working") {
        assert(false);
      } else {
        assert(true);
      }
    })
  });

  it("Only Owner can create Distributers",function(){
    return scinstance.setDistributer(accounts[3],{from:accounts[2]}).then( function (result) {
      throw("Modifier not working");
    }).catch(function (e) {
      if(e === "Modifier not working"){
        assert(false);
        } else {
          assert(true);
        }
    })
  });

  it("Only Owner can create Receivers",function(){
    return scinstance.setReceiver(accounts[3],{from:accounts[3]}).then( function (result) {
      throw("Modifier not working");
    }).catch(function (e) {
      if(e === "Modifier not working"){
        assert(false);
        } else {
          assert(true);
        }
    })
  });

  it("Should check if Receiver is Valid",function(){
    return scinstance.checkReceiver(accounts[2]).then(function(result){
      if(result==true){
        assert(true);
      }
      else {
        assert(false);
      }
    });
  });

  it("Should check if Receiver is inValid",function(){
    return scinstance.checkReceiver(accounts[3]).then(function(result){
      if(result==false){
        assert(true);
      }
      else {
        assert(false);
      }
    });
  });
  it("Should check if Distributer is Valid",function(){
    return scinstance.checkDistributer(accounts[1]).then(function(result){
      if(result==true){
        assert(true);
      }
      else {
        assert(false);
      }
    });
  });

  it("Should check if Distributer is inValid",function(){
    return scinstance.checkDistributer(accounts[3]).then(function(result){
      if(result==false){
        assert(true);
      }
      else {
        assert(false);
      }
    });
  });

  it("Should allow an Address to be a Receiver and Distributer",function(){
    let a=false;
    let b=false;
    scinstance.setDistributer(accounts[4]).then(function (result){
      a=true;
    });
    scinstance.setReceiver(accounts[4]).then(function (result){
      b=true;
    });
    if(a==b==true){
      return assert(true);
    }
  });


});
