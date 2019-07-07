pragma solidity >=0.4.22 <0.6.0;

interface otherContract {
  function getData() external view returns(uint);
  function value() external view returns(uint);
  function setData(uint _value) external;
}

contract mung {
  otherContract oc ;
  
  constructor(address o) public {
    oc = otherContract(o);
  }

  function g1() public view returns(uint){
    return oc.getData();
  }

  function g2() public view returns(uint){
    return oc.value();
  }

  function s(uint _value) public{
    oc.setData(_value);
  }

}