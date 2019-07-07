pragma solidity >=0.4.22 <0.6.0;

contract mung{

  uint v = 10;
  event SetData(uint _v);

  function setData(uint _v) public{
    v  = _v;
    emit SetData(_v);
  }
  
}