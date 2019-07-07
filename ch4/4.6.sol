pragma solidity >=0.4.22 <0.6.0;

contract mung{

  uint a = 10;

  function getVal1() public view returns(uint){
    a = 20;
    return a;
  }

}