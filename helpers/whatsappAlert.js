const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
async function sendOTPtoWhatsappAlert({ name, mobile, otp }) {
  try {
    const r = await axios.post(
      `https://graph.facebook.com/v15.0/109549668467205/messages`,
      {
        messaging_product: "whatsapp",
        to: mobile,
        type: "text",
        recipient_type: "individual",
        text: {
          body: `Hi ${name} Your one time otp for tasks is ${otp}`,
        },
      },
      {
        headers: {
          Authorization:
            "Bearer " +
            "EAAHYgM5krccBAPHfsX1CPT0zu0jkhJYCQZC60fFal9ARPrmruAPM176MMdXbpvhtDip1ZCcHrgo4yNccWr9ZCtVNjwQvDqAKLmdOgFTgEW2v1vbjcxj0cJcZB5nqUaMDX5peQeK91nRow6ZAdhNLc5PBFlBdkXsnjSIpCHtlvt3UCiM0CiK1wtu3kl75EAuQrOE9h8RrJNT5CwScBYLmq9WImOi2Em4IZD",
        },
      }
    );
  } catch (e) {
    return false;
  }
}

sendOTPtoWhatsappAlert({
  name: "Sumit",
  mobile: "917406644532",
  otp: "712345",
});
