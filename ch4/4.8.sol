pragma solidity >=0.4.22 <0.6.0;

contract mung{

  uint val1;
  address owner;

  constructor(uint _v) public {
    val1 = _v;
    owner = msg.sender;
  }
  
}