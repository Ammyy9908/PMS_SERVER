const { Expo } = require("expo-server-sdk");
const apiResponse = require("../helpers/apiResponse");

let messages = [];
let expo = new Expo();
exports.notify = [
  async (req, res) => {
    const { tokens, message_body } = req.body;

    for (let pushToken of tokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }

      // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
      messages.push({
        to: pushToken,
        sound: "default",
        body: `${message_body.title}\n ${message_body.subtitle}`,
        data: { withSome: "data" },
      });
    }
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (() => {
      (async () => {
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);

            tickets.push(...ticketChunk);
            // NOTE: If a ticket contains an error code in ticket.details.error, you
            // must handle it appropriately. The error codes are listed in the Expo
            // documentation:
            // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
          } catch (error) {
            console.error(error);
          }
        }
      })();
    })();

    tickets = [];
    messages = [];

    return apiResponse.successResponse(res, "Alerts sented");
  },
];
