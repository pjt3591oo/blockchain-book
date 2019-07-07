pragma solidity >=0.4.22 <0.6.0;

contract mung{

  uint public a = 10;

  function getVal1() public view returns(uint){
    return a;
  }
  
  function getVal2() private view returns(uint){
    return a;
  }
  
  function getVal3() external view returns(uint){
    return a;
  }
  
  function getVal4() internal view returns(uint){
    return a;
  }
}