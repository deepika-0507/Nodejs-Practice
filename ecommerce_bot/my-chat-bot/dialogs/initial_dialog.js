// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { AttachmentLayoutTypes, CardFactory } = require('botbuilder');
const {  ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, TextPrompt } = require('botbuilder-dialogs');
const AdaptiveCard = require('../adaptivecards/login_card.json');
const AdaptiveCard_signup = require('../adaptivecards/signup_card.json');


const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';
const Account = 'NAME_PROMPT';

class MainDialog extends ComponentDialog {
    constructor() {
        super('MainDialog');

        // Define the main dialog and its related components.
        this.addDialog(new TextPrompt(Account));
        this.addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
            this.account.bind(this),
            this.carddisplay.bind(this),
            this.getdata.bind(this)

        ]));

        // The initial child Dialog to run.
        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }


    

    async account(step){
        console.log('prompt')
        return await step.prompt(Account,'Do you have an account?');
    }

    async carddisplay(step){
        console.log(step.result)
        switch(step.result){
            case 'yes':
                await step.context.sendActivity({ attachments: [this.login()] });
                break;
            case 'no' :
                await step.context.sendActivity({ attachments: [this.signup()] });
                break;
            default:
                await step.context.sendActivity({ attachments: [this.signup()] });
                break;
        }
        console.log(step.Activity)
        return await step.prompt(Account,'Data');
    }

    async getdata(step){
        console.log('getdata')
        if(step.Activity.Value!=null){
            console.log('activity',step.Activity.Value)
        }
        else{
            console.log('no activity')
        }
        return await step.endDialog();
    }


  
    // ======================================
    // Helper functions used to create cards.
    // ======================================

    login() {
        return CardFactory.adaptiveCard(AdaptiveCard);
    }
    signup() {
        return CardFactory.adaptiveCard(AdaptiveCard_signup);
    }

    

    
}

module.exports.MainDialog = MainDialog;
