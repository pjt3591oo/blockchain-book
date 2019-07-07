pragma solidity >=0.4.22 <0.6.0;

contract mung{

  address owner;

  constructor() public {
    owner = msg.sender;
  }

  modifier ownerCheck() {
    require(msg.sender == owner);
    _;
  }

  function getData() public view ownerCheck() returns(uint) {
    return 10;
  }
  
}