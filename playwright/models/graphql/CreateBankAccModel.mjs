export default class CreateBankAccModel {
  constructor(userId, bankName, accountNumber, routingNumber) {
    this.data = {
      "operationName":"CreateBankAccount",
      "query":"\n  mutation CreateBankAccount($bankName: String!, $accountNumber: String!, $routingNumber: String!) {\n    createBankAccount(\n      bankName: $bankName\n      accountNumber: $accountNumber\n      routingNumber: $routingNumber\n    ) {\n      id\n      uuid\n      userId\n      bankName\n      accountNumber\n      routingNumber\n      isDeleted\n      createdAt\n    }\n  }\n",
      "variables":{
        "userId": userId,
        "bankName": bankName,
        "accountNumber": accountNumber,
        "routingNumber": routingNumber
      }
    };
  }
}