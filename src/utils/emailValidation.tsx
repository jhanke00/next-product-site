export function emailValidation(email: any, regExp: any) {
  if (regExp) {
    return regExp.test(email);
  } else {
    const emailRegExp = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegExp.test(email);
  }
}
