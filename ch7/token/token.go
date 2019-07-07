package main

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

type Token struct {
}

type Info struct {
	Name        string `json:"name"`
	Symbol      string `json:"symbol"`
	TotalSupply int    `json:"totalsupply"`
}

type BalanceOf struct {
	Value int `json:"value"`
}

func (t *Token) Init(stub shim.ChaincodeStubInterface) peer.Response {
	args := stub.GetStringArgs()

	if len(args) != 3 {
		return shim.Error("Incorrect arguments. Expecting a key and a value")
	}

	name := args[0]
	symbol := args[1]
	totalSupply, err := strconv.Atoi(args[2])

	if err != nil {
		return shim.Error(err.Error())
	}

	info := Info{Name: name, Symbol: symbol, TotalSupply: totalSupply}
	infoAsBytes, err := json.Marshal(info)

	balanceOf := BalanceOf{Value: totalSupply}
	balanceOfAsBytes, err := json.Marshal(balanceOf)

	if err != nil {
		return shim.Error(err.Error())
	}

	err_token := stub.PutState("TOKEN_"+name, []byte(infoAsBytes))
	err_balance := stub.PutState("BALANCE_ADMIN", []byte(balanceOfAsBytes))

	if err_token != nil {
		return shim.Error(err.Error())
	}

	if err_balance != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

func (t *Token) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	fn, args := stub.GetFunctionAndParameters()

	var result string
	var err error

	if fn == "getBalanceOf" {
		result, err = getBalanceOf(stub, args)
	} else if fn == "getTokenInfo" {
		result, err = getTokenInfo(stub, args)
	} else if fn == "transfer" {
		result, err = transfer(stub, args)
	} else if fn == "burn" {
		result, err = burn(stub, args)
	} else {
		return shim.Error("what!")
	}

	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success([]byte(result))
}

func burn(stub shim.ChaincodeStubInterface, args []string) (string, error) {
	if len(args) != 2 {
		return "", fmt.Errorf("Incorrect arguments. Expecting a key and a value")
	}

	tokenPrefix := "TOKEN_"
	balancePrefix := "BALANCE_"

	name := args[0]
	value, _ := strconv.Atoi(args[1])

	tokenInfoAsBytes, err := stub.GetState(tokenPrefix + name)

	if err != nil {
		return "", fmt.Errorf("Failed to get asset: %s with error: %s", name, err)
	}
	if tokenInfoAsBytes == nil {
		return "", fmt.Errorf("Asset not found: %s", name)
	}

	tokenInfo := Info{}
	err = json.Unmarshal(tokenInfoAsBytes, &tokenInfo)

	balanceOfAsBytes, err := stub.GetState(balancePrefix + "ADMIN")

	if err != nil {
		return "", fmt.Errorf("Failed to get asset: %s with error: %s", "ADMIN", err)
	}
	if balanceOfAsBytes == nil {
		return "", fmt.Errorf("Asset not found: %s", "ADMIN")
	}

	balanceOf := BalanceOf{}
	err = json.Unmarshal(balanceOfAsBytes, &balanceOf)

	tokenInfo.TotalSupply -= value
	balanceOf.Value -= value

	tokenInfoAsBytes, _ = json.Marshal(tokenInfo)
	balanceOfAsBytes, _ = json.Marshal(balanceOf)

	_ = stub.PutState(tokenPrefix+name, tokenInfoAsBytes)
	_ = stub.PutState(balancePrefix+"ADMIN", balanceOfAsBytes)

	return string(tokenInfoAsBytes), nil
}

func transfer(stub shim.ChaincodeStubInterface, args []string) (string, error) {
	if len(args) != 3 {
		return "", fmt.Errorf("Incorrect arguments. Expecting a key and a value")
	}

	prefix := "BALANCE_"

	from := args[0]
	to := args[1]
	value, _ := strconv.Atoi(args[2])

	fromBalanceAsBytes, err := stub.GetState(prefix + from)

	if err != nil {
		return "", fmt.Errorf("Failed to get asset: %s with error: %s", from, err)
	}
	if fromBalanceAsBytes == nil {
		return "", fmt.Errorf("Asset not found: %s", from)
	}

	fromBalance := BalanceOf{}
	err = json.Unmarshal(fromBalanceAsBytes, &fromBalance)

	if fromBalance.Value < value {
		return "", fmt.Errorf("Insufficient hold tokens")
	}
	toBalanceAsBytes, err := stub.GetState(prefix + to)

	if err != nil {
		return "", fmt.Errorf("Failed to get asset: %s with error: %s", to, err)
	}

	toBalance := BalanceOf{}

	if toBalanceAsBytes == nil {
		toBalance = BalanceOf{Value: 0}
	} else {
		err = json.Unmarshal(toBalanceAsBytes, &toBalance)
	}

	fromBalance.Value -= value
	toBalance.Value += value

	fromBalanceAsBytes, _ = json.Marshal(fromBalance)
	toBalanceAsBytes, _ = json.Marshal(toBalance)

	_ = stub.PutState(prefix+from, fromBalanceAsBytes)
	_ = stub.PutState(prefix+to, toBalanceAsBytes)

	return string(fromBalanceAsBytes), nil
}

func getBalanceOf(stub shim.ChaincodeStubInterface, args []string) (string, error) {
	if len(args) != 1 {
		return "", fmt.Errorf("Incorrect arguments. Expecting a key and a value")
	}

	balanceOf, err := stub.GetState("BALANCE_" + args[0])
	if err != nil {
		return "", fmt.Errorf("Failed to get asset: %s with error: %s", args[0], err)
	}
	if balanceOf == nil {
		return "", fmt.Errorf("Asset not found: %s", args[0])
	}
	return string(balanceOf), nil
}
func getTokenInfo(stub shim.ChaincodeStubInterface, args []string) (string, error) {
	if len(args) != 1 {
		return "", fmt.Errorf("Incorrect arguments. Expecting a key and a value")
	}

	tokenInfo, err := stub.GetState("TOKEN_" + args[0])
	if err != nil {
		return "", fmt.Errorf("Failed to get asset: %s with error: %s", args[0], err)
	}
	if tokenInfo == nil {
		return "", fmt.Errorf("Asset not found: %s", args[0])
	}
	return string(tokenInfo), nil
}

func main() {
	if err := shim.Start(new(Token)); err != nil {
		fmt.Printf("Error starting Token chaincode: %s", err)
	}
}
