pragma solidity ^0.5.0;

contract DrugCounterfiet
{
    struct Manufacturer{
        string verificationId;
        string name;
		string location;
		string password;
		address manAddress;
        uint[] ongoingOrders;
        string[] drugNames;
        string[] prices;
    }
	
	struct Seller{
        string name;
		string location;
		uint manId;
		string password;
		address sellAddress;
        uint[] ongoingOrders;
    }
    
     struct Order{
        string drugName;
        string quantity;
        string orderStatus;
        string orderManuDate;
        string orderDelvDate;
        string manName;
        string sellName;
    }

    mapping(uint => Manufacturer) public manufacturers;
	mapping(uint => Seller) public sellers;
	mapping(uint => Order) public orders;
	
    event ManufacturerCreated(
        string verificationId,
        string name,
        string location
    );
	
	event SellerCreated(
        string name,
        string location,
		uint manId
    );

    event OrderCreated(
        string name,
        string quantity,
        string status,
        uint manId,
        uint sellId
    );
    
    event Registered(
        string password,
		address manAddress
    );

    event DrugCreated(
        string drugName,
		string price
    );

    function createManufacturer(uint _regid, string memory _verificationId, string memory _name, string memory _location) public{
        manufacturers[_regid].verificationId=_verificationId;
        manufacturers[_regid].name=_name;
        manufacturers[_regid].location=_location;
        emit ManufacturerCreated(_verificationId,_name,_location);

    }

    function viewOngOrdersLength(uint _regid, uint _type) public view returns (uint){
        if(_type==1) {
            return manufacturers[_regid].ongoingOrders.length;
        }
        else {
            return sellers[_regid].ongoingOrders.length;
        }
    }

    function viewOngOrders(uint _regid, uint index, uint _type) public view returns (uint){
        if(_type==1) {
            return manufacturers[_regid].ongoingOrders[index];
        }
        else {
            return sellers[_regid].ongoingOrders[index];
        }
    }

    function createOrder(uint _regid, string memory _name, string memory _quant, string memory _status, uint _manId, uint _sellId) public{
        orders[_regid].drugName=_name;
        orders[_regid].quantity=_quant;
        orders[_regid].orderStatus=_status;
        manufacturers[_manId].ongoingOrders.push(_regid);
        sellers[_sellId].ongoingOrders.push(_regid);
        orders[_regid].manName=manufacturers[_manId].name;
        orders[_regid].sellName=sellers[_sellId].name;
        emit OrderCreated(_name,_quant,_status,_manId,_sellId);

    }
	
	function createSeller(uint _regid, string memory _name, string memory _location, uint _manId) public{
        sellers[_regid].name=_name;
        sellers[_regid].location=_location;
        sellers[_regid].manId=_manId;
        emit SellerCreated(_name,_location,_manId);

    }

    function registerMan(uint _regid, string memory _password) public{
        manufacturers[_regid].password=_password;
        manufacturers[_regid].manAddress=msg.sender;
        emit Registered(_password,msg.sender);
    }

    function registerSeller(uint _regid, string memory _password) public{
        sellers[_regid].password=_password;
        sellers[_regid].sellAddress=msg.sender;
        emit Registered(_password,msg.sender);
    }

    function addDrugs(uint _regid, string memory _drug, string memory _price) public{
        manufacturers[_regid].drugNames.push(_drug);
        manufacturers[_regid].prices.push(_price);
        emit DrugCreated(_drug,_price);
    }

    function viewDrugsLength(uint _regid) public view returns (uint){
        return manufacturers[_regid].drugNames.length;
    }

    function viewDrugs(uint _regid, uint index) public view returns (string memory){
        return manufacturers[_regid].drugNames[index];
    }

}