pragma solidity >=0.4.22 <0.6.0;

contract mung{

  uint a = 10;

  function getVal1() public view returns(uint){
    return a;
  }

  function getVal2() public pure returns(uint){
    return 1;
  }

}