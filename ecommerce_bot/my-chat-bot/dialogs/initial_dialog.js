// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { AttachmentLayoutTypes, CardFactory,UniversalBot,ActionTypes,ActivityTypes,dialog,MessageFactory } = require('botbuilder');
const {  ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog, TextPrompt, ConfirmPrompt, Dialog } = require('botbuilder-dialogs');
const AdaptiveCard = require('../adaptivecards/login_card.json');
const AdaptiveCard_signup = require('../adaptivecards/signup_card.json');
const Products = require('../models/products');
const Verification = require('../adaptivecards/verification.json');
var otpGenerator = require('otp-generator');
var nodemailer = require('nodemailer');
const User_info = require('../models/user_info');
const Order = require('../models/orders');
const Orders = require('../models/orders');

const MAIN_WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const Account = 'NAME_PROMPT';
const confirm = 'CHOICE_PROMPT';
var verification_code;
var user_details;
var login_details;
var order_details=[];
var details;

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
            this.address.bind(this),
            this.color.bind(this),
            this.summary.bind(this),
            this.confirmation_order.bind(this),
            

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
                const reply = MessageFactory.text('Password and confirm password didnot match');
                await step.context.sendActivity(reply);
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
        // console.log(step.context)
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
                
                const reply = MessageFactory.text('Succesfully logged in');
                await step.context.sendActivity(reply);
                console.log('2')
                login_details=user_detail
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
                if(err) throw err;
                if(docs.length==0){
                    
                    x='email_invalid'
                    

                }
                
                else{
                    if(docs[0].password === login_details.password){
                        console.log('valid')
                        x='valid';
                        
                    }
                    else{
                        console.log('invalid')
                        x='invalid';
                    }

                }
                
            })
            if(x =='invalid'){
                const reply = MessageFactory.text('invalid details');
                await step.context.sendActivity(reply);
                return await step.endDialog();
            }
            else{
                if(x=='email_invalid'){
                    const reply = MessageFactory.text('Email Id not found');
                    await step.context.sendActivity(reply);
                    return await step.endDialog();

                }
                const reply = MessageFactory.text('Succesfully logged in');
                await step.context.sendActivity(reply);
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
            buttons, { text: 'These products are available' });

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


    async address(step){
        console.log(step.result)
        order_details.push(step.result)
        return await step.prompt(Account,'Address')
    }

    async color(step){
        console.log(step.result)
        order_details.push(step.result)
        return await step.prompt(Account,'Color')

    }

    async summary(step){
        console.log(step.result)
        order_details.push(step.result)
        console.log(order_details)
        
        await Products.findById({_id:order_details[0]},function(err,docs){
            if(err) throw err;
            details = docs
            console.log(docs)
        })
        console.log(details)
        const reply = MessageFactory.text('Summary of the order');
        await step.context.sendActivity(reply);
        await step.context.sendActivity({attachments:[this.summary_card(order_details,details)]})
        return await step.prompt(confirm,'Is Everything correct?');
    }

    async confirmation_order(step){
        if(step.result){
            var order = new Orders()
            order.email = login_details.email,
            order.product = details._id,
            order.color = order_details[2],
            order.address = order_details[1]

            await order.save((err,docs)=>{
                if(err) throw err;
                console.log(docs)
                console.log('details saved')
            })
            return await step.prompt(Account,'Your order has placed')
        }
        else{
            return Dialog.endDialog();
        }
    }

    async placeorder(step){
        console.log(step)
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




    card(data){
        console.log(data.image)
        return CardFactory.heroCard(
            data.name,
            data.properties,
            CardFactory.images([data.image,]),
            CardFactory.actions([
                {
                    type: 'imBack',
                    title: 'Book now',
                    value: `${data._id}`
                }
            ])
        )
    }

    summary_card(data,data_details){
        console.log(data[0])
        return CardFactory.heroCard(
            data_details.name,
            `${data_details.properties},\n
            Address:${data[1]},
            Color:${data[2]},
            User:${login_details.email}`,
            
            CardFactory.images([data_details.image,]),
            
        )
    }


    
}

module.exports.MainDialog = MainDialog;
