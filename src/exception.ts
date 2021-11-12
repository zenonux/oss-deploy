type CustomExceptionDetail = Record<string, any> | string;
export class CustomException {
  message: CustomExceptionDetail;
  constructor(e: CustomExceptionDetail) {
    this.message = e;
  }
}
