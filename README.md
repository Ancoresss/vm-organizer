# vm-organizer
Install and setup:

 1. install [node.js](https://nodejs.org/en)
	 - check with `node --version` and `npm --version`
 2. `git clone https://github.com/Ancoresss/vm-organizer.git`
 3. `cd vm-organizer`
 4. `npm i -y` - fetch all required dependencies
 5. `npm run start` - run the application

**npm** commands should be executed via **cmd** or **PowerShell**.

In case of a branch update, make sure to run the command `npm i -y`.


## Configuration after installation:
1. Open the file "spotinstConfig.json"
2. Go to SpotInst -> Choose R&D account (view)
3. Go to the Settings, copy the "Spot Account ID" and paste in the "account_id" field in the spotinstConfig.json file.
4. Within Settings tab, go to the API -> Permanent Tokens.
5. Create new token, copy it and paste in the "token" field in the spotinstConfig.json file.

After these steps, you can use the application.


## Limitations
Application does not support AVA environments.
