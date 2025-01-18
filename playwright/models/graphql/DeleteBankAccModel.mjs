export default class DeleteBankAccModel {
  constructor(accountId) {
    this.data = {
      "operationName":"DeleteBankAccount",
      "query":"\n  mutation DeleteBankAccount($id: ID!) {\n    deleteBankAccount(id: $id)\n  }\n",
      "variables":{
        "id": accountId,
      }
    }
  }
}