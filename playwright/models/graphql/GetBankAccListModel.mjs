export default class GetBankAccListModel {
  constructor() {
    this.data = {
      "operationName":"ListBankAccount",
      "query":"\n  query ListBankAccount {\n    listBankAccount {\n      id\n      uuid\n      userId\n      bankName\n      accountNumber\n      routingNumber\n      isDeleted\n      createdAt\n      modifiedAt\n    }\n  }\n"
    }
  }
};