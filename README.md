## Document Editing Logistics Technical Aid v1.3.4
<p align="center"><img src="https://i.ibb.co/2MHY6wn/D-E-L-T-A-4.jpg" alt="DELTA Logo"/></p>

---
### Content
- [Features](#Features)
- [Getting Started](#Getting Started)
- [Default Documentation](#Default Documentation)
- [Support](#Support)

---

### Features

- Command aliasing.
- Action Shortcuts:
	- Promote/demote with custom rank structure.
	- Add to numerical columns.
	- Remove member from sheet with configurable log.
- Support for custom columns.
- Route errors and bug reports to a Discord channel with a webhook.
- Get notifications when a member on the roster leaves the Discord.
- Send announcements to all Discords using the bot that have them enabled.
- Change config options directly with commands.
- Dynamic help command and command loading/handling.
- Custom prefix option for each guild instance.

### Requirements
- [A Discord Bot](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)
- [At least Node v12](https://nodejs.org/en/download/)
- This Repository

### Getting Started

##### 1. Install Dependancies via Console
```
npm install
```

##### 2. Create .env and Fill Required Info
```
TOKEN=
PREFIX_DEFAULT=
BUGREPORT_WEBHOOK_ID=
BUGREPORT_WEBHOOK_TOKEN=
```

##### 3. Make a guilds.json file in `./information` with an Empty Object

##### 4. Get a [Google Client Secret](https://developers.google.com/sheets/api/quickstart/python) and put it in `./information`

##### 5. Set up Rank Structures in `./information/ranks` if Needed

##### 6. Invite your Bot to a Server
DELTA will automatically add an instance to that server in `guilds.json`

##### 7. Run `init` with the default prefix and fill out Spreadsheet Info
That is it! It should run flawlessly; otherwise make sure you filled out the info correctly.
Run `list` and `sheets` to test.

### Default Documentation
The Documentation for the original purpose of DELTA, including commands and features, can be found [here](https://sites.google.com/view/deltadocumentation/documentation).

### Support

Find this code useful? [Buy me a coffee!](http://paypal.me/dawsonvaught1)

I have worked hard developing my skills on this project and will continue development until it is no longer needed.