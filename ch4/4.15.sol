pragma solidity >=0.4.22 <0.6.0;

contract mung {
    
    function condition(uint _value) public pure returns(uint) {
      if(_value < 10) {
        return _value * 10;
      } else if (_value < 20) {
        return _value * 20;
      } else {
        return _value;
      }
    }

    function loop(uint _value) public pure returns(uint) {
      uint sum = 0;

      for(uint i = 0 ; i <= _value; i++){
        sum += i;
      }

      return sum;
    }

}