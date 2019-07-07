pragma solidity >=0.4.22 <0.6.0;

contract mung{

  address owner;

  constructor() public {
    owner = msg.sender;
  }

  modifier ownerCheck(uint value) {
    require(value < 10);
    _;
  }

  function getData(uint _v) public pure ownerCheck(_v) returns(uint) {
    return _v * 10;
  }
  
}