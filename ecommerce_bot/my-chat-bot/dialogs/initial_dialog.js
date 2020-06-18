const { AttachmentLayoutTypes, CardFactory } = require('botbuilder');
const { ChoicePrompt, ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog } = require('botbuilder-dialogs');
const Login_card = require('../adaptivecards/login_card.json')


const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';



class LoginDialog extends ComponentDialog {
    constructor(){
        super('LoginDialog');

        this.addDialog(new ChoicePrompt('choice'));
        this.addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG,[
            this.CardChoice.bind(this),
            this.DisplayCard.bind(this)
        ]))


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
     * @param {WaterfallStepContext} stepContext
    */

    async CardChoice(stepContext){
        console.log('CardChoice Selection')

        const options = {
            prompt :'Do you have an account? Choose one',
            retryPrompt :'Can you repeat again',
            choices: this.getChoices()
        };

        return await stepContext.prompt('Choices', options)
    }

    /**
     * @param {WaterfallStepContext} stepContext
    */

    async DisplayCard(stepContext){
        console.log('display of cards')

        switch (stepContext.result.value){
            case 'login':
                await stepContext.context.sendactivity({attachments: this.login()})
                break;
            case 'signup':
                await stepContext.context.sendactivity({attachments: this.signup()})
                break;
            default:
                await stepContext.context.sendactivity({attachments: this.signup()})
                break;
        }

        await stepContext.context.sendactivity('Fill the details');

        return await stepContext.endDialog();
    }

    getChoices(){
        const options =[
            {
                value:'login',
                synonyms: ['yes','signin']
            },
            {
                values:'signup',
                synonyms: ['no','register']
            }
        ]

        return options;
    }

    login(){
        return CardFactory.adaptiveCard(Login_card);
    }

    signup(){
        return CardFactory.adaptiveCard(Login_card);
    }
}

module.exports.LoginDialog = LoginDialog
