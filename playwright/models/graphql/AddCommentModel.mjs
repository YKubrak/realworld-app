export default class AddCommentModel {
  constructor(transactionId, comment) {
    this.data = {
      "transactionId":transactionId,
      "content": comment
    };
  }
}