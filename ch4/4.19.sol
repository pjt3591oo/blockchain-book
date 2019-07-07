pragma solidity >=0.4.22 <0.6.0;

contract Sample1 {

    uint public t ;

    constructor() public {}
    
    event L(uint a, uint b, address c);
    
    function test(uint a, uint b) public returns(uint){
        t = a + b;
        emit L(a, b, msg.sender);
        return a + b;
    }
}

contract Sample2 {
    uint public t;
    
    constructor() public {}
    
    function callTest(address contractAddr, uint to, uint value) public returns (bool, bytes memory, address) {
        (bool success, bytes memory data) = address(contractAddr).call(abi.encodeWithSignature("test(uint256,uint256)", to, value));
        
        if(!success) {
            revert();
        }
        
        return (success, data, contractAddr);
    }
    
    function delegatecallTest(address contractAddr, uint to, uint value) public returns (bool, bytes memory, address) {
        (bool success, bytes memory data) = address(contractAddr).delegatecall(abi.encodeWithSignature("test(uint256,uint256)", to, value));
        
        if(!success) {
            revert();
        }

        return (success, data, contractAddr);
    }
}