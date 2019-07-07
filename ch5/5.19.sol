pragma solidity >=0.4.22 <0.6.0;

contract mung{
  string public var1 = "Hello World";
  
  event E_SetString(string var1);

  function setString(string memory _var1) public {
    var1 = _var1;
    emit E_SetString(var1);
  }
} 