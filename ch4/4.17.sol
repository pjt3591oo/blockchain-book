pragma solidity >=0.4.22 <0.6.0;


contract mung{
  uint public value = 10;

  function getData() public view returns(uint){
    return value;
  }

  function setData(uint _value) public{
    value = _value;
  }
}