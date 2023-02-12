const { Expo } = require("expo-server-sdk");
const Alert = require("../models/Alerts");
const { Users } = require("../models/Users");
const apiResponse = require("../helpers/apiResponse");

let messages = [];
let expo = new Expo();
exports.notify = [
  async (req, res) => {
    const {
      tokens,
      message_body,
      generated_by,
      users,
      path,
      start_date,
      end_date,
    } = req.body;
    for (let i = 0; i < tokens.length; i++) {
      console.log(tokens[i]);
      if (!Expo.isExpoPushToken(tokens[i])) {
        console.error(`Push token ${tokens[i]} is not a valid Expo push token`);
        continue;
      }

      // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
      messages.push({
        to: tokens[i],
        sound: "default",
        body: `${message_body.title}\n ${message_body.subtitle}`,
        data: {
          generated_by: generated_by,
          title: `${message_body.title}\n ${message_body.subtitle}`,
          description: message_body.subtitle,
          generated_to: users[i],
          path: path,
          start_date,
          end_date,
        },
      });

      let newAlert = new Alert({
        generated_by: generated_by,
        title: `${message_body.title}\n ${message_body.subtitle}`,
        description: message_body.subtitle,
        generated_to: users[i],
        path: path,
        start_date,
        end_date,
      });

      await newAlert.save();
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

module.exports.fetchTokens = [
  async (req, res) => {
    const { users } = req.body;

    const tokens = await Users.find({ _id: { $in: users } }, { deviceId: 1 });
    if (!tokens) {
      return apiResponse.errorResponse(res, "No Tokens retrieved");
    }
    return apiResponse.successResponseWithData(res, "Tokens retrieved", tokens);
  },
];
