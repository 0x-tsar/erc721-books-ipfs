const Books = artifacts.require("Books");

module.exports = async function (deployer) {
  await deployer.deploy(Books);
  const books = await Books.deployed();
};
