// ==UserScript==
// @name         Twitch Redeem -> TTS for SillyTavern
// @namespace    http://sillytavern.ai/
// @version      0.1
// @description  Makes SillyTavern talk using TTS when a Twitch channel point is redeemed.
// @author       Deer
// ==/UserScript==

// REQUIRED: You'll need your TWITCH CHANNEL NAME and an OAuth token for the bot/user listening.
// See instructions below.

const tmi = require('tmi.js'); // make sure tmi.js is available in node_modules

const TWITCH_CHANNEL = 'your_channel_here'; // replace with YOUR twitch channel name (lowercase)
const OAUTH_TOKEN = 'oauth:xxxxxxxxxxxxxxxxxxxxxx'; // get this from https://twitchapps.com/tmi/

module.exports = {
    name: 'Twitch Redeem TTS',
    async onEnable(api) {
        const client = new tmi.Client({
            options: { debug: false },
            identity: {
                username: TWITCH_CHANNEL,
                password: OAUTH_TOKEN
            },
            channels: [TWITCH_CHANNEL]
        });

        client.connect();

        client.on('message', (channel, tags, message, self) => {
            if(self) return;

            // Check for channel point redeem
            if(tags['msg-id'] === 'highlighted-message' || tags['custom-reward-id']) {
                // Format whatever you want spoken aloud
                let ttsMessage = `${tags.username} just used channel points!`;

                if(tags['custom-reward-id']) {
                    ttsMessage = `${tags.username} redeemed ${tags['display-name']}: "${message}"`;
                }

                // Send this to SillyTavern's TTS API or frontend action!
                api.TTS.speak(ttsMessage); // Adjust based on exact TTS function in your setup
            }
        });api.log("Twitch Redeem TTS extension enabled.");
    },
    onDisable(api) {
        // Clean up logic if needed.
        api.log("Twitch Redeem TTS extension disabled.");
    }
};
