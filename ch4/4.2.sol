pragma solidity >=0.4.22 <0.6.0;

contract mung{
  string val1 = "hello world";
  uint val2 = 10;

  function Getdata() public view returns( string memory, uint) {
    return (val1, val2);
  }

  function setVal1(string memory _val1) public {
    val1 = _val1;
  }

  function setVal2(uint _val2) public {
    val2 = _val2;
  }
}