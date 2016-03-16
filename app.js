console.log('Starting Password Manager');

var crypto = require('crypto-js');
var storage = require('node-persist');
 // comes in default with node.js
//lets us access the module you have installed.
//this is the way we include the third party modules in our files

storage.initSync(); //this gets your computer ready	to start wiriting and saving variables.

//account is gonna have account.name (facebook),
// account.username(user12!) and account.password(123!)

//create command to create an account
//        --name (accountname)
//        --username
//        --password (all required)

//get 
//         --name

var argv = require('yargs')
	.command('create','Helps in creating an account',function(yargs){
		yargs.options({
			name : {
				demand : true,
				alias : 'n',
				description : 'Account name (e.g. twitter, facebook)',
				type : 'string'
			},
			username : {
				demand : true,
				alias : 'u',
				description : 'account username or email',
				type : 'string'
			},
			password : {
				demand : true,
				alias : 'p',
				description :'Account password goes here',
				type : 'string'
			},
			masterPassword :{
				demand : true,
				alias : 'm',
				description : 'Master password goes here',
				type: 'string'
			}

		}).help('help');
	})
	.command('get','Helps in getting an account',function(yargs){
		yargs.options({
			name : {
				demand : true,
				alias : 'n',
				description :'enter Account name for results',
				type : 'string' 
			},
			masterPassword : {
				demand : true,
				alias : 'm',
				description : 'Master Password should be given to etch account',
				type : 'string'
			}
		}).help('help');
	})
	.help('help')
	.argv;

var command = argv._[0];

function getAccounts (masterPassword){
	//use getItemSync to fetch account
	//decrypt and then return accounts array

	var encryptedAccounts = storage.getItemSync('accounts');
	var accounts =[];

	if(typeof encryptedAccounts !== 'undefined') {
		var bytes = crypto.AES.decrypt(encryptedAccounts,masterPassword);

		var accounts = JSON.parse(bytes.toString(crypto.enc.Utf8)); //inside the brackets is string
	}
	

	return accounts;
}

function saveAccounts (accounts, masterPassword){
	//encrypt accounts 
	//use setItemSync to save encrypted accounts
	//return accounts

	var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts)	,masterPassword);

	storage.setItemSync('accounts',encryptedAccounts.toString());

	return accounts;

}

function createAccount (account,masterPassword){
	//create a new variable called accounts
	//var accounts = storage.getItemSync('accounts');

	//if accounts is undefined (use typeof)
	//set accounts=[]
	//if(typeof accounts === 'undefined'){
	//	accounts = [];
	//}

	var accounts = getAccounts(masterPassword);


	//push on new account
	accounts.push(account);

	//storage.setItemSync('accounts',accounts);

	saveAccounts(accounts,masterPassword);
	return account;

	/*first,  we check the already existing accounts (if any) and push them accounts variables
	if accounts array is empty,  we create a new empty accounts array
	Next we push the new account into the accounts array
	Next, the accounts item is updated using setItemSync */
}

function getAccount (accountName,masterPassword){
	//var accounts, use getItemSync() to load all the accounts which exist
	var accounts = getAccounts(masterPassword);
	//var accounts = storage.getItemSync('accounts');
	var matchedAccount;

	/*for(var i=0;i<accounts.length;i++){
		if(accounts[i].name === accountName){
			matchedAccount = accounts[i];
		}
	} */

	accounts.forEach(function (account) {
		if (account.name === accountName) {
			matchedAccount = account;
		}
	});

	return matchedAccount;
	//return matching account, else undefined

}

/*createAccount({
	name : 'facebook',
	username : 'somemail@gmail.com',
	password : 'password123!'
}); */

/*var facebookAccount = getAccount('facebook');
console.log(facebookAccount);*/

if(command === 'create'){
	var createdAccount = createAccount({
		name : argv.name,
		username : argv.username,
		password : argv.password,
	}, argv.masterPassword);
	console.log('Account created successfully');
	console.log(createdAccount);
	console.log('Account added into the database');
	console.log('Use get command along with the account name to fetch the data');
}
else if(command === 'get'){
	var fetchedAccount = getAccount(argv.name, argv.masterPassword);

	if(typeof fetchedAccount === 'undefined'){
	console.log('Account not found');
	}
	else {
		console.log('Account found');
		console.log(fetchedAccount);
	}

}
else console.log('invalid command');

