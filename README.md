# Alexa Hue

## Features Re-Implemented

- [ ] Ask for Hue connection
	- [ ] On app start
	- [ ] On skill launch
- [ ] Launch Intent
	- [ ] Create and maintain session for next request
	- [ ] Stop/Cancel Intent
- [x] List Intents (send list as a card in Alexa app)
	- [x] Scenes
	- [x] Lights
	- [x] Groups
- [ ] Control Lights Intent
	- [ ] Light/Group selection 
		- [ ] If no light/group/scene specified, ask and wait for answer in same session
			- [ ] Cancel/Stop Intent 
		- [x] Substitute like(s)/light(s)
		- [ ] lights => all lights
		- [ ] Require "[name] light" or "[name] lights" or "[name] group"
		- [ ] If no match, respond with that
	- [ ] Light/Group Adjustment
		- [x] Color
			- [x] Dark/light (saturation 195, 220, 255)
			- [x] Colors = {red: 65280, pink: 56100, purple: 52180, violet: 47188, blue: 46920, turquoise: 31146, green: 25500, yellow: 12750, orange: 8618}
     	- [x] Color Temperature = {candle: 500, relax: 467, relaxing: 467, reading: 346, neutral: 300, concentrate: 231, energize: 136, energizing: 136}
		- [x] Brightness
		- [x] Saturation 
		- [ ] On/Off
		- [ ] Color loop
			- [ ] long/short alert
			- [ ] start/stop
		- [ ] Alert
			- [ ] Once (select)
			- [ ] Repeating (lselect)
			- [ ] Stop (none)
		- [ ] Reset loop/alert/schedules
	- [ ] Scenes
		- [x] Set scene
		- [x] Respond with failure if scene not found
	- [ ] Fulfill command at later time
		- [ ] Relative (in five minutes)
		- [ ] Absolute (at 9pm)
			- [ ] Prevent commands in the past
	- [ ] Save scene

## Control Hue Lights with Alexa

Well, you already can turn them on and off and dim them with Alexa. But this Alexa program gives you much more control: change colors, recall scenes, save scenes, set timers, turn on dynamic effects (color loops and alerts) and, of course, turn them on and off and dim them.

Demo here: [https://youtu.be/JBZlaAQtOXQ](https://youtu.be/JBZlaAQtOXQ)

Since Amazon does not give 3rd party developers a way to access your local network, we need a bit of a workaround. This skill has three components:

1. An Amazon Alexa Lambda function -- thanks to [Matt Kruse](https://forums.developer.amazon.com/forums/profile.jspa?userID=13686) -- on AWS that just receives requests from....
2. An Alexa "skill" that you set up in the Amazon Developer's portal and passes commands onto...
3. A server on your local network that does have access your Hue Bridge.

> Please note that Alexa-Hue requires a server running all the time (or all the time you want to control your lights with Alexa.)*

First, [download the .zip file](https://github.com/sarkonovich/Alexa-Hue/archive/master.zip) of this repo, and unzip it in a folder that's easy to get to.

### 1. Creating the Lambda Function
For information on how to set up the Lambda function, look at the tutorial [here.](https://developer.amazon.com/public/community/post/TxDJWS16KUPVKO/New-Alexa-Skills-Kit-Template-Build-a-Trivia-Skill-in-under-an-Hour)

- Set up your developer account by following step #1.
- Go through the instructions under step #2.
	- When you get to Step #2 5., you'll be copying and pasting in the text from `lambda_passthrough.js` that you downloaded from the repo. It's in the `lambda` subfolder. Add your code as Node.js. Just copy and paste lambda_passthrough.js in the code editor.
- Continue through Step #2 12.
- When you Step #3, follow the instructions under 1. and 2. to set up a new skill. Then follow my instructions below (though the pictures in Step #3 of the tutorial are relevant and might still be helpful.)

### 2. Creating the Skill

To create your new skill, go to the [Amazon developer portal](https://developer.amazon.com/edw/home.html#/skills), and click on the "Add New Skill" button, up there in the top right.

1. For "Skill Type" just leave the default "Custom Interaction "Model"
2. For "Name" pick anything you want.
3. For "Invocation Name" pick anything you want. This is the name you'll use to open the skill (e.g., "Alexa, tell house lighting to....")
4. For "Version Number"...anything. How about 0.0.1?
5. For "Endpoint" select 'Lambda ARN' and point it to your Lambda function by filling in the field with the proper resource name. Just go to your Lambda Function in the AWS Console. The ARN will look something like this:  arn:aws:lambda:us-east-1:123456789805:function:my_function
6. On the next page fill in the interaction model, custom slot values, and utterance samples by copying and pasting the info from intent_schema.txt, sample_utterances.txt and custom_slots.txt onto the appropriate form fields. 
7. Create custom slots first. In the "custom slot type" section, you'll see a button "Add Slot Type." Click on that. Add the slot name in the "Enter Type" box.  The name will be one of the all caps names from the custom_slots.txt, e.g., LIGHTS or ATTRIBUTE. Then paste in the values (they appear just below that all caps name in the custom_slots.txt), one value per line, in the "Enter Values" box. Then click  "OK."  In the end you're going to create 7 different custom slots. 
8. Copy/paste the contents of intent_schema.txt into the "Intent Schema" box.
9. Copy/paste the contents of utterance_samples.txt into the "Sample Utterances" box.

> Now, for the custom slot values "LIGHTS" and "SCENES" substitute in the appropriate values for your lights and scenes. 

> **IMPORTANT NOTE:** When filling in the LIGHTS custom slot, single bulbs should be indicated by 'light' (e.g, "kitchen light") and groups with 'lights' (e.g., "living room lights.) This means that you *don't* want the actual name of your lights to be something like "Kitchen lights" or "Bedroom light," because then you'll have to say things like "Turn on the kitchen lights lights!" The name of the group/lights should just be "Kitchen" or "bedroom," and in the LIGHTS custom slot you'll enter "Kitchen lights" or "Bedroom light."

### 3. Installing the Server
Okay, now we're done with the "cloud" side of things. We need to set things up on your local network. You need some way to expose the server to the internets. I like to use an [ngrok](https://ngrok.com/) tunnel.

Download the appropriate version of the program, open up a **new** terminal window, and start it up like this:

````./ngrok http 4567````

Andd you can add a bit of security by requiring basic auth credentials

````./ngrok http -auth="username:password" 4567````

If using ngrok, you'll end up looking at something like this, which is the public IP address of the tunnel to your local server.
                                                                                    
````Forwarding  http://bb1bde4a.ngrok.io -> localhost:4567````
   
Finally, head back to the lambda function on aws and replace the application_id and url with the application_id of your skill (found in the developer portal) and the ip address of your server (e.g., the ip address of your ngrok tunnel.) So, line 9 (or so) of the Lambda function might look something like this:

```` 'amzn1.echo-sdk-ams.app.3be28e92-xxxx-xxxx-xxxx-xxxxxxxxxxxx':'http://username:password@bb1bde4a.ngrok.io/lights' ````

(If you end up using this a lot, it would probably make sense to pay ngrok $5 and get a reserved address for you tunnel. That way you won't have to change the lambda function everytime you restart the ngrok tunnel.)

If you've added some basic auth to the tunnel, use the following format to specify the route to your local server in the lambda function:

    http://username:password@bb1bde4a.ngrok.io/

Head back to the lambda function on aws and replace the application_id and url with the application_id of your skill (found in the developer portal) and the ip address of your server (e.g., the ip address of your ngrok tunnel.) So, line 9 (or so) of the Lambda function might look something like this:

```` 'amzn1.echo-sdk-ams.app.3be28e92-xxxx-xxxx-xxxx-xxxxxxxxxxxx':'http://2a52d01e.ngrok.io/' ````


### Connect to Hue bridge

Before you can use the skill, you'll need to give it access to your Hue bridge. Press the link button on your bridge and launch the skill (within, I think, 30 seconds or so.)

If you don't do this step, Alexa will remind you.

## All Done!

## Available Commands

At this point the skill should be available to you. You can say things like:

*"Alexa, tell [invocation name] to turn the kitchen lights blue."*

*"Alexa, ask [invocation name] for blue kitchen lights."*

*"Alexa, ask [invocation name] for a dark red bedside light."*

*"Alexa, ask [invocation name] to set romantic scene."*

*"Alexa, ask [invocation name] for romantic scene."*

*"Alexa, ask [invocation name] for a green bedside light."*

*"Alexa, tell [invocation name] to turn the bedroom lights dark red."*

*"Alexa, tell...set the floor light to saturation ten and brightness five"*

*"Alexa, tell...schedule dinner scene at 8:30 pm"*

*"Alexa, tell...change the table light to the color relax"*

*"Alexa, tell...turn off the bedroom lights in 5 minutes"*

*"Alexa, tell...turn on the lights at eight forty five p.m."*

*"Alexa, tell...set dinner scene in one hour"*

*"Alexa, tell...start color loop on the bedside light"*

*"Alexa, tell...stop color loop on the bedside light"*

*"Alexa, tell...start long alert on the kitchen lights in forty five seconds"*

Preprogrammed colors include pink, orange, green, red, turqoise, blue, purple, and violet. All these colors accept the modifiers "dark" and "light" (e.g., "dark blue", "light pink."). You can also specify the following mired colors: candle, relax, reading, neutral, concentrate, and energize.

## Groups and Scenes

Alexa Hue gets information about groups and scenes from your Hue Bridge. You can get information about what groups, scenes, and lights you have on the bridge just by asking. The relevant information will be sent to a card in your Alexa app:

*"Alexa, ask....what groups do I have?"*

*"Alexa, ask....what lights do I have?"*

*"Alexa, launch....what are my scenes?"*

There are a few things to keep in mind. First, the Alexa app stores groups locally, in the app, not on the bridge. So any scenes you created in the Alexa app will have to be recreated on the bridge. Second, you'll only be able to recall groups and scenes that are stored on the bridge with pronounceable names. Even when an application stores the scenes on the bridge, it may append alphanumeric strings to your scene and groups names --  "living room" becomes "living room on 45hdjsldfk4", for example -- so you wouldn't be able to recall that just by asking.

There are two solutions.

The first is to find an app that a) stores the scene on the bridge and b) doesn't mess with the name. I recommend "All 4 Hue" available for [Android](https://play.google.com/store/apps/details?id=de.renewahl.all4hue&hl=en), but I assume many others will work as well. (Note: the official hue app is **not** one of the them.)

Create a scene in an app that meets requirements a) and b) and then add the scene name as a value in the SCENES custom slot.
(You can tell if the application stored the scene correctly on the bridge by asking the skill for your scenes, and making sure that the scene shows up with the name you expect.)

The second solution is to save scenes from within the skill. Just set up the lights the way you'd like. Then you can say, for example:

*"Alexa, tell....to save scene as dinner"*

Or, to save the scene for just a group:

*"Alexa, tell....to save scene as romantic on the kitchen lights."*

This method is probably not as reliable as the first, but it works. It will work a lot better if you add the name of the scene you are creating to the SCENES custom slot values *before* you save the scene.

**Why do I have to keep adding the names of the scenes/groups in the developer's portal?** I have not included lots and lots of sample utterances or custom slot values. Because of this, the voice recognition for arbitrary words will not be very good. However, the recognition for the supplied values will be very, very good. (It's a trade off.) Since you you using this to control just your lights, there's no need for the program to recognize just anything you say. *Remember*, even if you add scenes with an app, recognition will be much better if you add the scene (and group, and light) names as values in the relevant custom slot.

**Alexa keeps saying she can't find a group (light, or scene) named "Marks Room" even though I know it exists?**  This is likely a voice recognitions problem. Look in the settings tab of the Alexa app, under history. There you can see exactly what Alexa heard for everthing you say. Perhaps she heard "Marcs room"? This shouldn't happen if you've added the name of the light/group/scene as a value in the relevant custom slot, but who knows? Alexa is not constrained to recognize only those values

**Alexa keeps asking me to specify a light or lights, but I did.** Again, this is likely a recognition problem. Check that she heard what you correctly. For example, she might be hearing "recipe like" instead of "recipe light." I've taken care of a couple common mistakes in the app (you can say "turn on the bedroom like" and it will still work), but there might be others. In the history section of the app you can give feedback and tell Alexa that she misheard. If you do this a few times, she usually corrects the error.