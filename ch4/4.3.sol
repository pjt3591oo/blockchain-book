pragma solidity >=0.4.22 <0.6.0;

contract mung {
  string string_val1 = "hello";
  string string_val2 = "world";
  string string_val3 = string_val1 ;
  string[] string_val4 = [string_val1, string_val2, string_val3];

  uint8 uint_val1;
  uint16 uint_val2;
  uint24 uint_val3;
  uint uint_val4 = 10;
  uint[] uint_val5 = [1, 2, 3, 4];

  address addr1 = 0xe080af2577b9889C536A4b7E4cF8f420Df13D18b;
  address payable addr2 = 0xe080af2577b9889C536A4b7E4cF8f420Df13D18b;

  bool bool_var1 = true;
  bool bool_var2 = false;

  struct struct_val1 {
    uint age;
    string name;
  }

  mapping (address => uint) mapping1 ;
  mapping (string => uint) mapping2 ;
}