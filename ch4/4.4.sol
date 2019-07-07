pragma solidity >=0.4.22 <0.6.0;

contract mung{
  uint val = 10;

  function setVal(uint _val) public {
    val = _val;
  }

  function getVal() public view returns(uint){
    return val;
  }

}