pragma solidity ^0.5.0;

contract DrugCounterfiet
{

    struct Manufacturer{
        string name;
		string location;
		string password;
		address manAddress;
    }
	
	struct Seller{
        string name;
		string location;
		uint manId;
		string password;
		address sellAddress;
    }

    mapping(uint => Manufacturer) public manufacturers;
	mapping(uint => Seller) public sellers;
	
    event ManufacturerCreated(
        string name,
        string location
    );
	
	event SellerCreated(
        string name,
        string location,
		uint manId
    );
    
    event Registered(
        string password,
		address manAddress
    );
    
    constructor() public{
        createManufacturer(27637,"AstraZeneca","Avinashi Road, Peelamedu, Coimbatore");
    }

    function createManufacturer(uint _regid, string memory _name, string memory _location) public{
            manufacturers[_regid]=Manufacturer(_name,_location,"",0x0000000000000000000000000000000000000000);
            emit ManufacturerCreated(_name,_location);

    }
	
	function createSeller(uint _regid, string memory _name, string memory _location, uint _manId) public{
            sellers[_regid]=Seller(_name,_location,_manId,"",0x0000000000000000000000000000000000000000);
            emit SellerCreated(_name,_location,_manId);

    }

    function registerMan(uint _regid, string memory _name, string memory _location, string memory _password) public{
        if(keccak256(bytes(manufacturers[_regid].name)) == keccak256(bytes(_name)) && keccak256(bytes(manufacturers[_regid].location)) == keccak256(bytes(_location))) {
            manufacturers[_regid].password=_password;
            manufacturers[_regid].manAddress=msg.sender;
            emit Registered(_password,msg.sender);
        }
    }

    function registerSeller(uint _regid, string memory _name, string memory _location, uint _manId, string memory _password) public{
        if(keccak256(bytes(sellers[_regid].name)) == keccak256(bytes(_name)) && keccak256(bytes(sellers[_regid].location)) == keccak256(bytes(_location)) && sellers[_regid].manId == _manId) {
            sellers[_regid].password=_password;
            sellers[_regid].sellAddress=msg.sender;
            emit Registered(_password,msg.sender);
        }
    }

    function login(uint _regid, uint _type, string memory _password) public view returns(bool){
        if(_type==1) {
            if(keccak256(bytes(manufacturers[_regid].password))==keccak256(bytes(_password)) && manufacturers[_regid].manAddress==msg.sender) {
                return true;
            }
        }
        else {
            if(keccak256(bytes(sellers[_regid].password))==keccak256(bytes(_password)) && sellers[_regid].sellAddress==msg.sender) {
                return true;
            }
        }
        return false;
    }

}