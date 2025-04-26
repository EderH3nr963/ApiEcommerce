const generateVerificationCode = () => 
    Math.floor(Math.random() * (999999 - 100000) + 100000);
  
export default generateVerificationCode;