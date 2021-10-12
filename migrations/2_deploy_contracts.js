var DrugCounterfiet = artifacts.require("./DrugCounterfiet.sol");

module.exports = function(deployer) {
  deployer.deploy(DrugCounterfiet);
};
