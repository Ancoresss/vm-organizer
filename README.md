# vm-organizer
## Install and setup:

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
1. AVA environments are not supported.
2. Performance environments are not supported.

## Manual
1. To add a new environment, click the **Add VM** button. This will search for two instances (Database and Application) in SpotInst and add them to your VM list.
2. After clicking **Add VM**, avoid refreshing the application. Adding a VM takes about 1 minute. Please wait until the process completes.
3. To remove a VM from your list in the application (without deleting it from SpotInst), use the **Delete VM** button.
4. The **Search** field can be used to filter VMs based on any column in the table. The **Status** column provides a button for toggling the VM's state (ON or OFF) and an ENUM dropdown with options (ON, OFF, LOADING), enabling you to filter VMs by their current status.
5. 
	- ON - Both instances (Application and Database) are running. 
	- OFF - Both instances are stopped. 
	- LOADING - At least one instance is still in the process of starting/stopping.
6. To add notes for a specific VM, use the button in the **Note** column. You can document relevant information here.
7. Use the **Refresh** button in the top-right corner to update the status of each VM in your list.
8. You can click on any text in the table to copy it directly to your clipboard.

## FAQ
**Q: What if status is displayed incorrectly?**

A: The status should be checked and updated directly on SpotInst. Once updated, use the **Refresh** button to synchronize and reflect the changes in the application.

**Q: What if the VM addition process continues endlessly??**

A: 
1. Refresh the application by reloading the entire web page.
2. Check the **db.json** and **instances.json** files in the application repository located at: vm-organizer/packages/vm-organizer/src/assets.
3. If the relevant data is stored in these files, delete it.
4. Try to add the VM again. If the issue persists, it indicates that this specific VM cannot be added to the VM list.
