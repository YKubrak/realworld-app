export default class CreateTransactionModel {
  constructor(paymentType, amount, description, senderId, recipientId) {
    this.data = {
      "transactionType": paymentType,
      "amount": amount,
      "description": description,
      "senderId": senderId,
      "receiverId": recipientId,
    };
  }
}