// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { AttachmentLayoutTypes, CardFactory,UniversalBot,ActionTypes,ActivityTypes,dialog } = require('botbuilder');
const {  ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, TextPrompt, ConfirmPrompt, Dialog } = require('botbuilder-dialogs');
const AdaptiveCard = require('../adaptivecards/login_card.json');
const AdaptiveCard_signup = require('../adaptivecards/signup_card.json');
const Products = require('../models/products');


const MAIN_WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const Account = 'NAME_PROMPT';
const confirm = 'CHOICE_PROMPT';

class MainDialog extends ComponentDialog {
    constructor() {
        super('MainDialog');

        // Define the main dialog and its related components.
        this.addDialog(new TextPrompt(Account));
        this.addDialog(new ConfirmPrompt(confirm));

        this.addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
            this.nameprompt.bind(this),
            this.welcome.bind(this),
            this.displayoptions.bind(this),
            this.displayproducts.bind(this),
            this.confirmation.bind(this),
            



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

    /**
     * Send a Rich Card response to the user based on their choice.
     * This method is only called when a valid prompt response is parsed from the user's response to the ChoicePrompt.
     * @param {WaterfallStepContext} step
     */

    async nameprompt(step){
        console.log('prompt')
        return await step.prompt(Account,'What is your name');
    }

    /**
     * Send a Rich Card response to the user based on their choice.
     * This method is only called when a valid prompt response is parsed from the user's response to the ChoicePrompt.
     * @param {WaterfallStepContext} step
     */

    async welcome(step){
        console.log(step.result)
        return await step.prompt(confirm,`Welcome ${step.result} Do You have an account?`)
    }

    

    async displayoptions(step){
        console.log('options')
        // await step.prompt(Account,'Options are')
        // return await step.endDialog()

        const reply = { type: ActivityTypes.Message };

        // Note that some channels require different values to be used in order to get buttons to display text.
        // In this code the emulator is accounted for with the 'title' parameter, but in other channels you may
        // need to provide a value for other parameters like 'text' or 'displayText'.
        const buttons = [
            { type: ActionTypes.ImBack, title: '1. Cycle', value: 'cycle' },
            { type: ActionTypes.ImBack, title: '2. Bike', value: 'bike' },
            { type: ActionTypes.ImBack, title: '3. Car', value: 'car' }
        ];

        const card = CardFactory.heroCard('', undefined,
            buttons, { text: 'You can upload an image or select one of the following choices.' });

        reply.attachments = [card];
        console.log(reply)
        await step.context.sendActivity(reply);
        return Dialog.EndOfTurn;
    }




    /**
     * Send a Rich Card response to the user based on their choice.
     * This method is only called when a valid prompt response is parsed from the user's response to the ChoicePrompt.
     * @param {Object} step
     */


    async displayproducts(step){
        console.log(step.result)
        const reply = {type: ActivityTypes.Message};

        const char_value = step.result
        console.log(char_value);
        Products.find({type:char_value},function(err,docs){
            if(err) throw err;
            for(var i in docs){
                await step.context.sendActivity({attachments: [this.card()] })
            }
        })
        return Dialog.EndOfTurn;
    }


        /**
     * Send a Rich Card response to the user based on their choice.
     * This method is only called when a valid prompt response is parsed from the user's response to the ChoicePrompt.
     * @param {WaterfallStepContext} step
     */

    async confirmation(step){
        if(step.result){
            await step.context.sendActivity({ attachments: [this.login()] });
        }
        else{
           await step.context.sendActivity({ attachments: [this.signup()] });
        }
        return await step.endDialog()
    }

    /**
     * Send a Rich Card response to the user based on their choice.
     * This method is only called when a valid prompt response is parsed from the user's response to the ChoicePrompt.
     * @param {WaterfallStepContext} step
     */

    

    async data(step){
        console.log('data')
        await step.prompt(Account,'What is it?')
        return await step.endDialog(); 
    }

    login() {
        return CardFactory.adaptiveCard(AdaptiveCard);
    }
    signup() {
        return CardFactory.adaptiveCard(AdaptiveCard);
    }

    products(char_value){
        console.log('data')
        console.log(char_value)
        Products.find({type:char_value},function(err,doc){
            if(err) throw err;
            console.log(doc)
            console.log(doc[0].name)
            console.log(doc[0]['name'])
            return CardFactory.heroCard(+
                'Bot',
                CardFactory.images(['https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fdawn&psig=AOvVaw2MhJhoCJxYLXoaXdA4FltB&ust=1592921482084000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCJieqorNleoCFQAAAAAdAAAAABAI',]),
                CardFactory.actions([
                    {
                        type: 'openUrl',
                        title: 'view more',
                        value: 'https://docs.microsoft.com/en-us/azure/bot-service/'
                    }
                ])
            )
            
        })

    }

    card(){
        return CardFactory.heroCard(
            'Bot',
            CardFactory.images(['https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fdawn&psig=AOvVaw2MhJhoCJxYLXoaXdA4FltB&ust=1592921482084000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCJieqorNleoCFQAAAAAdAAAAABAI',]),
            CardFactory.actions([
                {
                    type: 'openUrl',
                    title: 'view more',
                    value: 'https://docs.microsoft.com/en-us/azure/bot-service/'
                }
            ])
        )
    }


    
}

module.exports.MainDialog = MainDialog;
