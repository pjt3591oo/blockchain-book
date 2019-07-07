pragma solidity >=0.4.22 <0.6.0;

contract mung1 {
  function g1(uint _value) public pure returns(uint) {
    return _value + 1;
  }
  function g2(uint _value) internal pure returns(uint) {
    return _value + 1;
  }
}

contract mung2 is mung1{
  function getData1(uint _value) public pure returns(uint) {
    return g1(_value);
  }
  function getData2(uint _value) public pure returns(uint) {
    return g2(_value);
  }
}