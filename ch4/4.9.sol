pragma solidity >=0.4.22 <0.6.0;

contract mung{

  function() external payable{
    address sender = msg.sender;
    uint value = msg.value;
  }
  
}