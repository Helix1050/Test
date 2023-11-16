/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const SKILL_NAME = "Lock and Key"


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        var sessionAttributes={
            "studentName":'',
            "studentID":'',
            "studentAddress":'',
            "studentHomeNum":'',
            "studentCellNum":'',
            "currentUser":'',
            "state":false
        };
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        
        var AWS = require("aws-sdk");

        var ddb = new AWS.DynamoDB.DocumentClient();
        var results="";
        var speakOutput;
        var params = {
            TableName : "Lockers",
        };
        
        
        await ddb.scan(params,function(err,data){
            if(err){
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2)); 
                console.log(data.Count);
                results=30-parseInt(data.Count);
            }
            if (results)
                speakOutput="Welcome student, this is the digital locker service. There are currently " + results+ " lockers available. Would you like to sign in or sign up?";
            else
                speakOutput="Error occured";
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
            
        }).catch((error) => {
       console.error("Unable to query. Error:", JSON.stringify(error, null, 2));
        });
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const SignInIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SignInIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'What are your student ID and locker PIN? To enter your Student ID and locker PIN say "My student ID is" followed by your student ID "and my locker PIN is" followed by your locker PIN';
        
        return handlerInput.responseBuilder
        
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const askLockerNumIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'askLockerNumIntent';
    },
    handle(handlerInput) {
        var AWS = require('aws-sdk');
        var ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});
        AWS.config.update({region: 'us-east-1'});
        
        var locker_num=handlerInput.requestEnvelope.request.intent.slots.locker_ID.value;
        var sessionAttributes=handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.currentUser=locker_num;
        
        
        var result="";
        
        var params ={
            TableName: 'Lockers',
            KeyConditionExpression: "id = :v1",
            ExpressionAttributeValues: { ":v1": { S : locker_num }}
        };
        return ddb.query(params,function(err,data){
            var speakOutput = 'test';
            if(err){
                console.log(err,err.stack);
            }else{
                console.log("sucess");
                console.log(data.Count);
                result=data.Count;
            }
            if(result==1){
                console.log("sucess 2")
                var studentID=handlerInput.requestEnvelope.request.intent.slots.student_id.value;
                speakOutput="Welcome student #" + studentID +" If you would like to cancel your locker say \"cancel locker\". Otherwise say \"quit\" ";
            }else    
                speakOutput="Login Credentials Incorrect.";
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
        }).catch((error) => {
       console.error("Unable to query. Error:", JSON.stringify(error, null, 2));
        });
    }
};

const cancelLockerHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'cancelLockerIntent';
    },
    handle(handlerInput) {
        var AWS = require('aws-sdk');
        var ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});
        AWS.config.update({region: 'us-east-1'});
        var sessionAttributes=handlerInput.attributesManager.getSessionAttributes();
        
        var params ={
            TableName:"Lockers",
            Key:{
                id:{
                    S : sessionAttributes.currentUser
                }
            }
        }
        ddb.deleteItem(params,function(err,data){
            if(err)
                console.log(err,err.stack)
            else
                console.log("sucesss")
        });
        const speakOutput = 'Locker canceled';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const terms = "By using this skill you agree to the following terms and conditions. All entered information will be used strictly for locker rental purposes. No one who does not strictly need access to your information will be granted access. Locker rentals remain valid until the end of the current semester. For any further assistance, contact the Faculty of Science Office."

const SignUpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SignUpIntent';
    },
    async handle(handlerInput) {
        var AWS = require("aws-sdk");

        var ddb = new AWS.DynamoDB.DocumentClient();
        var results="";
        var speakOutput;
        var params = {
            TableName : "Lockers",
        };
        await ddb.scan(params,function(err,data){
            if(err){
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2)); 
                console.log(data.Count);
                results=30-parseInt(data.Count);
            }
            if (results==0){
                speakOutput="There are currently no lockers avaiable. We apologise for this inconvenience";
            }
            else if(results>0){
                speakOutput = terms + ' What is your name? To enter your name say "My name is" followed by your name';
            }
            else{
                speakOutput="Error occured";
            }
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
            
        }).catch((error) => {
       console.error("Unable to query. Error:", JSON.stringify(error, null, 2));
        });
        
        
    }
};

const checkIDIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'checkIDIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Would you like to cancel your locker rental';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
    
};

const askIDIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'askIDIntent';
    },
    handle(handlerInput) {
        var studentID=handlerInput.requestEnvelope.request.intent.slots.studentID.value;
        
        var sessionAttributes=handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.studentID=studentID;
        
        const speakOutput = 'What is your home phone number? Enter your home number by saying "My Home Number is" followed by your home number. ';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
    
};

const askHomeNumIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'askHomeNumIntent';
    },
    handle(handlerInput) {
        var studentHomeNum=handlerInput.requestEnvelope.request.intent.slots.studentHomeNum.value;
        
        var sessionAttributes=handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.studentHomeNum=studentHomeNum;
        const speakOutput = 'What is your cell phone number? Enter your cell number by saying "My Cell Number is" followed by your cell number. ';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
    
};

const askCellNumIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'askCellNumIntent';
    },
    handle(handlerInput) {
        var studentCellNum=handlerInput.requestEnvelope.request.intent.slots.studentCellNum.value;
        
        var sessionAttributes=handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.studentCellNum=studentCellNum;
        const speakOutput = 'What is your address? Enter your address by saying "My Address is" followed by your address. ';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
    
};
const testIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'testIntent';
    },
    handle(handlerInput) {
        //increaseCount();
        const speakOutput = 'test complete'
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
    
};

const askEmailIntent = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'askEmailIntent';
    },
    handle(handlerInput) {
        var studentEmail=handlerInput.requestEnvelope.request.intent.slots.studentEmail.value;
        
        var sessionAttributes=handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.studentEmail=studentEmail;
        const speakOutput = 'What is your address ' + sessionAttributes.studentName;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
    
};

const askNameIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'askNameIntent';
    },
    handle(handlerInput) {
        var studentName=handlerInput.requestEnvelope.request.intent.slots.studentName.value;
        
        var sessionAttributes=handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.studentName=studentName;
        
        const speakOutput = "Welcome " +studentName+". What is your student ID? To enter your student ID say \"My ID is\" followed by your ID ";
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const confirmationIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'confirmationIntent';
    },
    handle(handlerInput) {
        var studentAddress=handlerInput.requestEnvelope.request.intent.slots.studentAddress.value;
        
        var sessionAttributes=handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.studentAddress=studentAddress;
        
        const speakOutput = "Is this information correct? \nName:"+sessionAttributes.studentName+"\nStudent ID:"+sessionAttributes.studentID+"\nHome Number:"+sessionAttributes.studentHomeNum+"\nCell Number:"+sessionAttributes.studentCellNum+"\nAddress:"+sessionAttributes.studentAddress+"\nSay \"Confirm\" if this information is correct and say \"Quit\" otherwise";
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const storeStudentIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'storeStudentIntent';
    },	
    handle(handlerInput) {

        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();  			//get the session variables
        var studentName = sessionAttributes.studentName;  
        
        
        var lockNum;
        do{
            lockNum=String(1000000 + Math.floor(Math.random() * 9000000));
        }while(!idChecker(lockNum))
        
        const speakOutput = "Your locker has been registered " + studentName + ". Your Locker Number is " + lockNum +".";
        //idChecker(lockNum);
        //idChecker(0000000);
        //dynamodb
        var AWS = require('aws-sdk');
        var ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});
        AWS.config.update({region: 'us-east-1'});
       
        var params = {
            TableName: 'Lockers', //place the correct table name associaded with your alexa hosted skill here as was demonstrated in the video demonstration.
            Item: {
             'id':{S : lockNum},
             'student id' : {S : sessionAttributes.studentID},
             'name' : {S : sessionAttributes.studentName},
             'address' : {S: sessionAttributes.studentAddress},
             'home num' : {N: sessionAttributes.studentHomeNum},
             'cell num' : {N: sessionAttributes.studentCellNum},
             
            }
        };
       
        ddb.putItem(params, function(err, data){
         if(err){
           console.log(err);
         } else{
           console.log('Success');
         }
       });
        
        //ddb.putItem(para)
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt(speakOutput)
            //.withSimpleCard(SKILL_NAME, speakOutput)   //added to generate video output.
            .getResponse();
        }
};

function idChecker(lockNum){
    if(lockNum.length!==7) {
        return false;
    }
    var AWS = require('aws-sdk');
    var ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});
    AWS.config.update({region: 'us-east-1'});
    console.log(lockNum);
    var params ={
        TableName: 'Lockers',
        KeyConditionExpression: "id = :v1",
        ExpressionAttributeValues: { ":v1": { S : lockNum }},
    };
    return ddb.query(params,function(err,data){
        if(err){
            console.log(err,err.stack)
        }else{
            console.log(JSON.stringify(data.Items));
            if(data.Items.length===0){
                console.log("empty")
                return true;
            }
            return false;
        }
        
    });
}


/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        testIntent,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        askLockerNumIntentHandler,
        confirmationIntentHandler,
        cancelLockerHandler,
        askCellNumIntent,
        askHomeNumIntent,
        checkIDIntent,
        askIDIntent,
        SignInIntentHandler,
        SignUpIntentHandler,
        askNameIntentHandler,
        storeStudentIntentHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();