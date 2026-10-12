const axios = require("axios");
const xml2js = require("xml2js");

const sendOtpSms = async (mobile, otp) => {
  try {
    // Prepare message
    const message = `Dear User, ${otp} is the OTP for your login at https://99magics.com. Pls do not share with anyone.`;

    // Send SMS via GET request
    const response = await axios.get("http://sms.smsmenow.in/sendsms.jsp", {
      params: {
        user: "99magics",
        password: "17e4616db8XX",
        senderid: "99MGCS",
        mobiles: mobile.replace("+", ""), // remove '+' if present
        sms: message,
        tempid: "1707176664476837984"
        // entityid: "1701176603888174629" // optional, remove if not required
      },
      timeout: 10000
    });

    // Parse XML response
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(response.data);

    const sms = result?.smslist?.sms;

    console.log("SMS RESPONSE:", sms);

    if (sms && sms.status === "success" && sms.code === "000") {
      return { success: true };
    }

    return { success: false, reason: sms?.reason || "Unknown SMS error" };

  } catch (error) {
    console.error("SMS ERROR:", error.message);
    return { success: false, reason: error.message };
  }
};

module.exports = sendOtpSms;
