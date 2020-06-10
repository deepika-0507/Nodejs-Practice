// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory, ActivityTypes } = require('botbuilder');

class EchoBot extends ActivityHandler {
    
    constructor() {
        super();
        
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        
        this.onMessage(async (context, next) => {
            
            if(context.activity.text === 'Hello'){
                await context.sendActivity(`Hello there`)
            }
            else{
                await context.sendActivity(`you said '${ context.activity.text }'`)
            }
            if(context.activity.text === 'wait'){
                
            }
            // if (context.activity.text === 'wait') {
            //     await context.sendActivities([
            //         { type: ActivityTypes.Typing },
            //         { type: 'delay', value: 3000 },
            //         { type: ActivityTypes.Message, text: 'Finished typing' }
            //     ]);
            // } else {
            //     await context.sendActivity(`You said '${ context.activity.text }'. Say "wait" to watch me type.`);
            // }
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome!';
            
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('Welcome');
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.EchoBot = EchoBot;
