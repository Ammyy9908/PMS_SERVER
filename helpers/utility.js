

exports.randomNumber = function (length)
{
    var text = "";
    var possible = "123456789";
    for(var i = 0; i < length ; i++)
    {
        var sup = Math.floor(Math.random() * possible.length);
        text += i > 0 && sup == i ? "0" : possible.charAt(sup);
    }
    return Number(text);
};

exports.sendWhatsAppMessage = function (message , mobile)
{
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    client.messages
        .create({
            from: 'whatsapp:+14155238886',
            body: message,
            to: mobile
        })
        .then(message => { return message });
};







