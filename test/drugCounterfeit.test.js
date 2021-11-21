const { assert } = require("chai")

const DrugCounterfeit = artifacts.require('./DrugCounterfiet.sol')

contract('drugCounterfeit', (accounts) => {
  before(async () => {
    this.drugCounterfeit = await DrugCounterfeit.deployed()
  })

  it('Successfully Deployed', async () => {
    const address = await this.drugCounterfeit.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

  it('Manufacturer Added', async () => {
    const result = await this.drugCounterfeit.createManufacturer(12345,'100310040509','TestMan','TestManAdd')
    const event = result.logs[0].args
    assert.equal(event.verificationId, '100310040509')
    assert.equal(event.name, 'TestMan')
    assert.equal(event.location, 'TestManAdd')
  })

  it('Manufacturer Registered', async () => {
    const result = await this.drugCounterfeit.registerMan(12345, 'TestPass')
    const event = result.logs[0].args
    assert.equal(event.password, 'TestPass')
  })

  it('Manufacturer Record Created', async () => {
    const manufacturer = await this.drugCounterfeit.manufacturers(12345)
    assert.equal(manufacturer.verificationId, '100310040509')
    assert.equal(manufacturer.name, 'TestMan')
    assert.equal(manufacturer.location, 'TestManAdd')
    assert.equal(manufacturer.password, 'TestPass')
  })

  it('Seller Added', async () => {
    const result = await this.drugCounterfeit.createSeller(23456,'TestSell','TestSellAdd',12345)
    const event = result.logs[0].args
    assert.equal(event.name, 'TestSell')
    assert.equal(event.location, 'TestSellAdd')
    assert.equal(event.manId, '12345')
  })

  it('Seller Registered', async () => {
    const result = await this.drugCounterfeit.registerSeller(23456, 'TestSPass')
    const event = result.logs[0].args
    assert.equal(event.password, 'TestSPass')
  })

  it('Seller Record Created', async () => {
    const seller = await this.drugCounterfeit.sellers(23456)
    assert.equal(seller.name, 'TestSell')
    assert.equal(seller.location, 'TestSellAdd')
    assert.equal(seller.password, 'TestSPass')
    assert.equal(seller.manId, 12345)
  })

  it('Drug Added', async () => {
      const result = await this.drugCounterfeit.addDrugs(12345,'TestDrug','TestPrice');
      const event = result.logs[0].args
      assert.equal(event.drugName, 'TestDrug')
      assert.equal(event.price, 'TestPrice')
  })

  it('Drug Created', async () => {
      var drugCount = await this.drugCounterfeit.viewDrugsLength(12345)
      var drugCount = drugCount.toNumber()
      const drug = await this.drugCounterfeit.viewDrugs(12345,0)
      const price = await this.drugCounterfeit.viewPrice(12345,0)
      assert.equal(drugCount, 1)
      assert.equal(drug, 'TestDrug')
      assert.equal(price, 'TestPrice')
  })

  it('Order Placed', async() => {
      const result = await this.drugCounterfeit.createOrder(76767,'TestDrug','10','Created',12345,23456)
      const event = result.logs[0].args
      assert.equal(event.name, 'TestDrug')
      assert.equal(event.quantity, '10')
      assert.equal(event.status, 'Created')
      assert.equal(event.manId, 12345)
      assert.equal(event.sellId, 23456)
  })

  it('Order Created', async() => {
      const countM = await this.drugCounterfeit.viewOngOrdersLength(12345,1)
      var ongOrderCountM=countM.toNumber()
      const idM = await this.drugCounterfeit.viewOngOrders(12345,0,1)
      var orderIdM=idM.toNumber();
      assert.equal(ongOrderCountM,1)
      assert.equal(orderIdM,76767)
      const countS = await this.drugCounterfeit.viewOngOrdersLength(23456,2)
      var ongOrderCountS=countS.toNumber();
      const idS = await this.drugCounterfeit.viewOngOrders(23456,0,2)
      var orderIdS=idS.toNumber();
      assert.equal(ongOrderCountS,1)
      assert.equal(orderIdS,76767)
      const order = await this.drugCounterfeit.orders(orderIdM)
      assert.equal(order.drugName, 'TestDrug')
      assert.equal(order.quantity, '10')
      assert.equal(order.orderStatus, 'Created')
      assert.equal(order.manName, 'TestMan')
      assert.equal(order.sellName, 'TestSell')
  })

  it('Order Placed', async() => {
    const result = await this.drugCounterfeit.createOrder(76867,'TestDrug','15','Created',12345,23456)
    const event = result.logs[0].args
    assert.equal(event.name, 'TestDrug')
    assert.equal(event.quantity, '15')
    assert.equal(event.status, 'Created')
    assert.equal(event.manId, 12345)
    assert.equal(event.sellId, 23456)
  })

  it('Order Created', async() => {
    const countM = await this.drugCounterfeit.viewOngOrdersLength(12345,1)
    var ongOrderCountM=countM.toNumber()
    const idM = await this.drugCounterfeit.viewOngOrders(12345,1,1)
    var orderIdM=idM.toNumber();
    assert.equal(ongOrderCountM,2)
    assert.equal(orderIdM,76867)
    const countS = await this.drugCounterfeit.viewOngOrdersLength(23456,2)
    var ongOrderCountS=countS.toNumber();
    const idS = await this.drugCounterfeit.viewOngOrders(23456,1,2)
    var orderIdS=idS.toNumber();
    assert.equal(ongOrderCountS,2)
    assert.equal(orderIdS,76867)
    const order = await this.drugCounterfeit.orders(orderIdM)
    assert.equal(order.drugName, 'TestDrug')
    assert.equal(order.quantity, '15')
    assert.equal(order.orderStatus, 'Created')
    assert.equal(order.manName, 'TestMan')
    assert.equal(order.sellName, 'TestSell')
  })

  it('Order Accepted', async() => {
      const result = await this.drugCounterfeit.acceptOrder(76767,'TestManDate','Accepted')
      const event = result.logs[0].args
      assert.equal(event.date, 'TestManDate')
      assert.equal(event.status, 'Accepted')
  })

  it('Order Updated', async() => {
      const order = await this.drugCounterfeit.orders(76767)
      assert.equal(order.orderStatus, 'Accepted')
      assert.equal(order.orderManuDate, 'TestManDate')
  })

  it('Order Rejected', async() => {
      const result = await this.drugCounterfeit.rejectOrder(76867,'Rejected',1,12345)
      const event = result.logs[0].args
      assert.equal(event.status, 'Rejected')
  })

  it('Order Updated', async() => {
      const order = await this.drugCounterfeit.orders(76867)
      assert.equal(order.orderStatus, 'Rejected')
      const countM = await this.drugCounterfeit.viewOngOrdersLength(12345,1)
      var ongOrderCountM=countM.toNumber()
      assert.equal(ongOrderCountM,1)
  })
  
  it('Order Removed', async() => {
      const result = await this.drugCounterfeit.removeOrder(23456,1,2)
      const countS = await this.drugCounterfeit.viewOngOrdersLength(23456,2)
      var ongOrderCountS=countS.toNumber()
      assert.equal(ongOrderCountS,1)
  })
  
  it('Order Delivered', async() => {  
      const result = await this.drugCounterfeit.orderDelivered(0,76767,'TestDelDate','Delivered',23456)
      const event = result.logs[0].args
      assert.equal(event.status, 'Delivered')
      assert.equal(event.date, 'TestDelDate')
  })

  it('Order Updated', async() => {
    const order = await this.drugCounterfeit.orders(76767)
    assert.equal(order.orderStatus, 'Delivered')
    assert.equal(order.orderDelvDate, 'TestDelDate')
  })

})