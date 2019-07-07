# org1, org2 네트워크 구성

기존에 생성된 채널에 새로운 기관 추가

해당 가이드는 기존의 샘플 코드를 활용하여 진행합니다.

```bash
$ curl -sSL http://bit.ly/2ysbOFE | bash -s 1.4.0-rc2
$ cd fabric-sample
$ cd first-network
$ ./byfn.sh up
```

`byfn.sh`를 이용하여 기관별로 피어가 2개있는 기관을 2개 생성.



아래는 `eyfn.sh`의 프로세스를 나열합니다. 아래를 스킵하기 위해서는 다음 명령어를 실행합니다.



```bash
$ eyfn.sh up
```

`eyfn..sh`을 이용하면 빠르게 기존 채널에 기관을 추가할 수 있습니다. 하지만 우리는 커스텀하게 추가하기 위해서는 `eyfn.sh`가 어떻게 동작하는지 알아야 합니다. `eyfn.sh`의 프로세스를 하나하나 따라가 보겠습니다.



```bash
$ eyfn.sh down
```

만약 `eyfn.sh`를 실행했다면 down으로 해당 네트워크를 내려줍니다. `byfn.sh`로 올라간 네트워크는 유지시켜 줍니다.



# 필요한 파일 생성

* 인증서 설치

```bash
$ cd org3-artifacts
$ ../../bin/cryptogen generate --config=./org3-crypto.yaml
```



# 기존 채널

* 채널 아티팩트 설치

```bash
$ export FABRIC_CFG_PATH=$PWD
$ ../../bin/configtxgen -printOrg Org3MSP > ../channel-artifacts/org3.json
$ cd ..
$ cp -r crypto-config/ordererOrganizations org3-artifacts/crypto-config/ # org3 디렉터리로 orderer 인증서 카피
```



* 기존 cli 접속

cli로 접속하여 채널정보 업데이트 

```bash
$ docker exec -it cli bash
```



* 필요 패키지 설치

```bash
$ apt-get -y update && apt-get -y install jq
```



* 채널 설정정보 생성

```bash
# orderer node 환경변수
$ CORE_PEER_LOCALMSPID="OrdererMSP"
$ CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
$ CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/users/Admin@example.com/msp

# 필요파일 생성
$ peer channel fetch config config_block.pb -o orderer.example.com:7050 -c mychannel --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

$ configtxlator proto_decode --input config_block.pb --type common.Block | jq .data.data[0].payload.data.config >config.json
```

orderer 정보를 환경변수에 넣어준다. 해당 orderer 노드의 환경변수는 노드 실행시 설정한 환경변수를 보면 알 수 있다. 채널도 트랜잭션으로 관리되기 때문에 채널관련 정보를 transaction으로 만들어 새로 전파시켜 줘야함.



`config_block.pb` 생성 => `config.json` 생성



* org3 정보로 업데이트 된 채널정보 파일 생성

```bash
$ jq -s '.[0] * {"channel_group":{"groups":{"Application":{"groups": {"Org3MSP":.[1]}}}}}' config.json ./channel-artifacts/org3.json > modified_config.json
```



* 채널 설정정보 업데이트

채널 설정 정보를 업데이트 하기 위해 다음가 같은 절차가 필요합니다.



```bash
$ configtxlator proto_encode --input config.json --type common.Config >original_config.pb
```

`config.json`을 이용하여 `original_config.pb` 생성



```bash
$ configtxlator proto_encode --input modified_config.json --type common.Config >modified_config.pb
```

`modified_config.json`으`로 modified_config.pb` 생성



```bash
$ configtxlator compute_update --channel_id mychannel --original original_config.pb --updated modified_config.pb >config_update.pb
```

채널이름, original_coinfig.pb, modified_config.pb로 config_update.pb 생성

>  참고 no differences detected between original and updated config 에러가 발생할 수 있슴
>
>

```bash
$ configtxlator proto_decode --input config_update.pb --type common.ConfigUpdate >config_update.json
```

`config_update.pb`로 `config_update.json` 파일 생성



```bash
$ echo '{"payload":{"header":{"channel_header":{"channel_id":"mychannel", "type":2}},"data":{"config_update":'$(cat config_update.json)'}}}' | jq . >config_update_in_envelope.json
```

`config_update_in_envelope.json` 생성



```bash
$ configtxlator proto_encode --input config_update_in_envelope.json --type common.Envelope >org3_update_in_envelope.pb
```

최종적으로 `org3_update_in_envelope.pb` 생성



* org3이 추가된 네트워크 생성을 위한 트랜잭션 설정(endorsing 하기)

```bash
$ CORE_PEER_LOCALMSPID="Org1MSP"
$ CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
$ CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
$ CORE_PEER_ADDRESS=peer0.org1.example.com:7051
```

환경변수를 peer0.org1의 정보로 설정한다.



```bash
$ peer channel signconfigtx -f org3_update_in_envelope.pb
```

org3_update_in_envelope.pb를 이용하여 mychannel에 org3가 추가된 트랜잭션을 서명하여 peer0.org1에게 endorsing 함.



* submit

```bash
$ CORE_PEER_LOCALMSPID="Org2MSP"
$ CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
$ CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
$ CORE_PEER_ADDRESS=peer0.org2.example.com:7051
```



```bash
$ peer channel update -f org3_update_in_envelope.pb -c mychannel -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
```



#  채널정보 패치하기

* Org3 peer 생성

```bash
$ docker-compose -f docker-compose-org3.yaml up -d
$ docker exec -it Org3cli bash
```



* channel.block으로 패치

```bash
$ peer channel fetch 0 mychannel.block -o orderer.example.com:7050 -c mychannel --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
```



* 피어 채널참가(peer0.org3)

```bash
$ CORE_PEER_LOCALMSPID="Org3MSP"
$ CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt
$ CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp
$ CORE_PEER_ADDRESS=peer0.org3.example.com:7051

$ peer channel join -b mychannel.block
```



* 피어 채널참가(peer1.org3)

```bash
$ CORE_PEER_LOCALMSPID="Org3MSP"
$ CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt
$ CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp

$ CORE_PEER_ADDRESS=peer1.org3.example.com:7051

$ peer channel join -b mychannel.block
```



* 체인코드 설치(peer0.org3)

```bash
$ peer chaincode install -n mycc -v 2.0 -p github.com/chaincode/chaincode_example02/go/
```



* 체인코드 설치(peer0.org1)

```bash
$ CORE_PEER_LOCALMSPID="Org1MSP"
$ CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
$ CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp

$ CORE_PEER_ADDRESS=peer0.org1.example.com:7051

$ peer chaincode install -n mycc -v 2.0 -p github.com/chaincode/chaincode_example02/go/
```



* 체인코드 설치(peer0.org2)

```bash
$ CORE_PEER_LOCALMSPID="Org2MSP"
$ CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
$ CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp

$ CORE_PEER_ADDRESS=peer0.org2.example.com:7051

$ peer chaincode install -n mycc -v 2.0 -p github.com/chaincode/chaincode_example02/go/
```

체인코드의 버전을 2로 올려서 전체 기관에 재배포 한다.



* 체인코드 업데이트

```bash
$ CORE_PEER_LOCALMSPID="Org1MSP"
$ CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
$ CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp

$ CORE_PEER_ADDRESS=peer0.org1.example.com:7051

$ peer chaincode upgrade -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n mycc -v 2.0 -c '{"Args":["init","a","90","b","210"]}' -P "AND ('Org1MSP.peer','Org2MSP.peer','Org3MSP.peer')"
```

각 피어에 설치된 버전2 체인코드의 정책을 바꿔서 인스턴트화 시킨다. org1에서만 인스턴트화 해도 해당 채널에 참가된 모든 피어에 체인코드가 설치됨.



`--cafile`은 orderer 인증서를 넣어주면됨



# 체인코드 설치확인

체인코드 설치확인을 하기 위해서는 확인하고자 하는 피어 정보로 환경변수를 셋팅해줘야 함.



* org1

```bash
$ CORE_PEER_LOCALMSPID="Org1MSP"
$ CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
$ CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp

$ CORE_PEER_ADDRESS=peer0.org1.example.com:7051

$ peer chaincode list --installed
$ peer chaincode list --instantiated -C mychannel
```



* org2

```bash
$ CORE_PEER_LOCALMSPID="Org2MSP"
$ CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
$ CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp

$ CORE_PEER_ADDRESS=peer0.org2.example.com:7051

$ peer chaincode list --installed
$ peer chaincode list --instantiated -C mychannel
```



* Org3

```bash
$ CORE_PEER_LOCALMSPID="Org3MSP"
$ CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt
$ CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp

$ CORE_PEER_ADDRESS=peer0.org3.example.com:7051

$ peer chaincode list --installed
$ peer chaincode list --instantiated -C mychannel
```

org3은 버전 2만 isntall 했기 때문에 버전 2만 설치됬다고 표시됨.

