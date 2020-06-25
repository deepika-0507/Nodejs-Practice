// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { AttachmentLayoutTypes, CardFactory,UniversalBot,ActionTypes,ActivityTypes,dialog } = require('botbuilder');
const {  ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, TextPrompt, ConfirmPrompt, Dialog } = require('botbuilder-dialogs');
const AdaptiveCard = require('../adaptivecards/login_card.json');
const AdaptiveCard_signup = require('../adaptivecards/signup_card.json');
const Products = require('../models/products');
const Verification = require('../adaptivecards/verification.json');
var otpGenerator = require('otp-generator');
var nodemailer = require('nodemailer');
const User_info = require('../models/user_info');

const MAIN_WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const Account = 'NAME_PROMPT';
const confirm = 'CHOICE_PROMPT';
var verification_code;
var user_details;
var login_details;

class MainDialog extends ComponentDialog {
    constructor() {
        super('MainDialog');

        // Define the main dialog and its related components.
        this.addDialog(new TextPrompt(Account));
        this.addDialog(new ConfirmPrompt(confirm));

        this.addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
            this.nameprompt.bind(this),
            this.welcome.bind(this),
            this.confirmation.bind(this),
            this.detailsusers.bind(this),
            this.detailsverification.bind(this),
            this.displayoptions.bind(this),
            this.displayproducts.bind(this),
            

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



    async nameprompt(step){
        console.log('prompt')
        return await step.prompt(Account,'What is your name');
    }

    

    async welcome(step){
        console.log(step.result)
        return await step.prompt(confirm,`Welcome ${step.result} Do You have an account?`)
    }


    async confirmation(step){
        if(step.result){
            await step.context.sendActivity({ attachments: [this.login()] });
        }
        else{
           await step.context.sendActivity({ attachments: [this.signup()] });
        }
        return Dialog.EndOfTurn;
    }

    async detailsusers(step){
        console.log(step.context._activity.value)
        if(step.context._activity.value.name === 'Signup'){
            if(step.context._activity.value.password === step.context._activity.value.confirm_password){

                user_details=step.context._activity.value;
                verification_code=otpGenerator.generate(6, { upperCase: false, specialChars: false });
                console.log(verification_code)
                var transporter = nodemailer.createTransport({ service: "gmail", auth: { user: 'wandermate.help@gmail.com', pass: 'wandermate123' } });
                var mailOptions = { from: 'wandermate.help@gmail.com', to: step.context._activity.value.email, subject: 'Account Verification Token',
                html : `Hello,<br> Your Verification Code for email verification.<br><b>${verification_code}</b>`,}

                transporter.sendMail(mailOptions, function (err) {
                    if (err) {
                        console.log(err);
                        }
                    else{
                        console.log('mail sent');
                    }
                });

                await step.context.sendActivity({attachments:[this.verification()]});
                console.log(step.context._activity.value)
                return Dialog.EndOfTurn;
            }
            else{
                // await step.prompt(Account,`password annd confirm password didn't match`);
                return await step.endDialog(); 

            }
            
        }
        else{
            login_details = step.context._activity.value;
            // await step.prompt(Account,'Succesfully logged in')
            return step.next();
        }

        

    }

    

    async detailsverification(step){
        console.log(step.context)
        if(step.context._activity.value.name === 'verification'){
            if(step.context._activity.value.code === verification_code){
                var user_detail = new User_info()
                user_detail.email=user_details.email,
                user_detail.password=user_details.password,
                
                await user_detail.save((err,docs)=>{
                    if(err) throw err;
                    console.log(docs)
                    console.log('1')
                })
                
                await step.prompt(Account,'Succesfully Signed in')
                console.log('2')
                return step.next();
            }
            else{
                // await step.context.sendActivity({ attachments: [this.signup()] });
                // return Dialog.EndOfTurn;
                // await step.prompt(Account,`verification code invalid`);
                return await step.endDialog(); 
            }
        }
        else{
            var x;
            console.log(login_details.password)
            await User_info.find({email:login_details.email},function(err,docs){
                console.log(docs[0].password)
                if(err) throw err;
                if(docs[0].password === login_details.password){
                    console.log('valid')
                    x='valid';
                    
                }
                else{
                    console.log('invalid')
                    x='invalid';
                }
            })
            if(x =='invalid'){
                return await step.endDialog();
            }
            else{
                return step.next();
                
            }
        }
    }

    

    async displayoptions(step){
        console.log('options')
        

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
        // console.log(reply)
        await step.context.sendActivity(reply);
        return Dialog.EndOfTurn;
    }

    



  

    async displayproducts(step){
        console.log(step.result)
        const reply = {type: ActivityTypes.Message};

        const char_value = step.result
        console.log(char_value);
        var data=[];
        await Products.find({type:char_value},function(err,docs){
            if(err) throw err;
            data = docs;
            
        })
        console.log(data)
        for(var i=0; i<= data.length-1 ;i++){
            await step.context.sendActivity({attachments: [this.card(data[i])] })

        }
        return Dialog.EndOfTurn;
    }


     



    

    

    async data(step){
        console.log('data')
        await step.prompt(Account,'What is it?')
        return await step.endDialog(); 
    }

    login() {
        return CardFactory.adaptiveCard(AdaptiveCard);
    }
    signup() {
        return CardFactory.adaptiveCard(AdaptiveCard_signup);
    }

    verification(){
        return CardFactory.adaptiveCard(Verification)
    }

    proceesubmit(session,value){
        session.send(JSON.stringify(value))
    }



    card(data){
        console.log(data.name)
        return CardFactory.heroCard(
            data.name,
            CardFactory.images(['https://www.cleverfiles.com/howto/wp-content/uploads/2018/03/minion.jpg',]),
            CardFactory.actions([
                {
                    type: 'ImBack',
                    title: 'Book now',
                    value: 'Yes'
                }
            ])
        )
    }


    
}

module.exports.MainDialog = MainDialog;
