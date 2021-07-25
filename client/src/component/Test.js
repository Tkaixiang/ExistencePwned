// const { Api, TelegramClient } = require("telegram");
// const { StringSession } = require("telegram/sessions");
// const input = require("input"); // npm i input
// require('dotenv').config();

// const stringSession = new StringSession(process.env.STRING_SESSION); // fill this later with the value from session.save()

// // (async () => {
// //     console.log("Loading interactive example...");
// //     const client = new TelegramClient(stringSession, parseInt(process.env.API_ID), process.env.API_HASH, {
// //         connectionRetries: 5,
// //     });
// //     await client.start({
// //         phoneNumber: async () => await input.text("number ?"),
// //         password: async () => await input.text("password?"),
// //         phoneCode: async () => await input.text("Code ?"),
// //         onError: (err) => console.log(err),
// //     });
// //     console.log("You should now be connected.");
// //     console.log(client.session.save()); // Save this string to avoid logging in again
// //     // await client.sendMessage("me", { message: "Hello!" });
// //     // const msgs = await client.getMessages("me", {
// //     //     limit: 10,
// //     // });
// //     // console.log("the total number of msgs are", msgs.total);
// //     // console.log("what we got is ", msgs.length);
// //     // for (const msg of msgs) {
// //     //     //console.log("msg is",msg); // this line is very verbose but helpful for debugging
// //     //     console.log("msg text is : ", msg.text);
// //     //     console.log("msg is from chat: ", msg.peerId);
// //     //     console.log("msg is from sender: ", msg.senderId);
// //     // };
// //     const chats = await client.invoke(
// //         new Api.messages.GetAllChats({
// //             exceptIds: []
// //         })
// //     );
// //     const data = chats.chats.map(obj => obj.title)
// //     console.log("all chats:", data)
// // })();

// async function loadTLClient() {
//     console.log("Loading interactive example...");
//     const client = new TelegramClient(stringSession, parseInt(process.env.API_ID), process.env.API_HASH, {
//         connectionRetries: 5,
//     });
//     await client.start({
//         phoneNumber: async () => await input.text("number ?"),
//         password: async () => await input.text("password?"),
//         phoneCode: async () => await input.text("Code ?"),
//         onError: (err) => console.log(err),
//     });
//     console.log("You should now be connected.");
//     console.log(client.session.save()); // Save this string to avoid logging in again
//     // await client.sendMessage("me", { message: "Hello!" });
//     // const msgs = await client.getMessages("me", {
//     //     limit: 10,
//     // });
//     // console.log("the total number of msgs are", msgs.total);
//     // console.log("what we got is ", msgs.length);
//     // for (const msg of msgs) {
//     //     //console.log("msg is",msg); // this line is very verbose but helpful for debugging
//     //     console.log("msg text is : ", msg.text);
//     //     console.log("msg is from chat: ", msg.peerId);
//     //     console.log("msg is from sender: ", msg.senderId);
//     // };
//     const chats = await client.invoke(
//         new Api.messages.GetAllChats({
//             exceptIds: []
//         })
//     );
//     const data = chats.chats.map(obj => obj.title)
//     console.log("all chats:", data)
// };

// export default loadTLClient;
var msg = new SpeechSynthesisUtterance();
msg.text = 'Saying something'
window.speechSynthesis.speak(msg)
