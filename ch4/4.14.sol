pragma solidity >=0.4.22 <0.6.0;

contract mung {
    function () external payable{
        
    }
    
    function send1(address payable to, uint value) public {
        to.transfer(value * (10 ** 18));
    }
    
    function send2(address to, uint value) public {
        address payable convertedTo= address(uint160(to));
        convertedTo.transfer(value * (10 ** 18));
    }
    
    function send3(address to, uint value) public {
        address(uint160(to)).transfer(value * (10 ** 18));
    }

    function getBalance(address to) public view returns(uint) {
      return to.balance;
    }
}