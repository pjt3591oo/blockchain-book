pragma solidity >=0.4.22 <0.6.0;

contract mung{

  uint public a = 10;

  function setData() public{
    a = 20;
    require(false);
    a = 30;
  }
  
}