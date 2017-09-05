// No need to modify these dependencies and variables below
var steem = require('steem');
var fs = require('fs');
require('events')._setMaxListeners = 0;
var prompt = require('prompt');
var colors = require('colors');
var version = "@Tippy ALPHA v0.0.13";

steem.config.set('websocket', 'wss://gtg.steem.house:8090');

//----- Start the tippy engine
console.log("╔══════════════════════════════════════════════════════════════════╗".blue);
console.log("╟".blue + "╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌".blue.bold + "╢".blue);
console.log("║ ".blue + version + " is now " + "ONLINE".green.bold + " - Listening to".white + " STEEM".blue.bold + " Network! ".white + "║".blue);
console.log("╟".blue + "╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌".blue.bold + "╢".blue);
console.log("╠══════════════════════════════════════════════════════════════════╣".blue);
// console.log("╟".blue + "╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌".bold.blue + "╢".blue);
//console.log("║".blue + " @Tippy Text to Tip STEEM & SBD Tip Bot Engine | A Node.js Script ".white + "║".blue);
//console.log("║".blue + " Developed by @KLYE ".white + "|".blue.bold + " Idea by @steemitqa".white + " |".blue.bold + " Free Code Open Sourced ".white + "║".blue);
console.log("╟".blue + "╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌".blue + "|".blue + "§".blue.bold + "|".blue + "╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌".blue + "╢".blue);
console.log("╠══════════════════════════════════════════════════════════════════╣".blue);
console.log("║".blue + "** ".blue.bold + "LOADING:".green.bold + " Config Settings & Blockdata... - Please Wait " + "       **║".blue);
console.log("╠══════════════════════════════════════════════════════════════════╣".blue);

// engine config Variable Declarations - DO NOT FILL OUT
var firstrun;
var devmode;
var uptimeinfo;
var debugmode;
var tipfee;
var tippy;
var attippy;
var owner;
var wif;
var bank;
var memopubkey;
var profilepic;
var setup;
var devmsg;
var showlogo;
var logo;
var spacer;
var devmsg;
var tippyfooter = "<center><sub>🤖 @Tippy - <b>STEEM & SBD Text-to-Tip Service - </b> by @KLYE 🤖<br>( click reply & type @tippy help for commands )</sub></center>";
var autosaveblock;
var showtime;
var jsonMetadata = {
	"app": "Tippy/0.0.13"
};
var protype;
var profee;
var offline;
var savedblock;
var newfile;
var stattype;
var to;
var sender;
var info;
var tipmemo;
var commentwait = false;
var totalblocks = 0;
var totalvote = 0;
var totalcomment = 0;
var count = 20;
var logo = "";
var time = "";

if (showtime == true){
 var tnsecs = new Date().getUTCSeconds();
 if (tnsecs == 1){
	 tnsecs = String("0" + tnsecs);
 }
 if (tnsecs >= 10 && tnsecs.length < 2){
	 tnsecs = String(tnsecs + "0");
 }
 var tnmins = new Date().getUTCMinutes();
 if (tnmins <= 10){
	 tnmins = String("0" + tnmins);
 }
 var tnhours = new Date().getUTCHours();
 time = tnhours + ":" + tnmins + ":" + tnsecs + " │ ".blue;
};//END  if (showtime == true)

// stats
var last_block = 0;
var current_block = 0;
var new_current_block = 0;
var synced = 0;
var headstreamblock;
var safestreamblock;

var parentAuthor;
var parentPermlink;
var permlink;
var reciever;
var steembalance;
var steembalanceafter
var sbdbalance;
var sbdbalanceafter;
var fee;

var blockdataread = false;

//----- Define some Queues to get around posting limits and 3 second rule

// set up our tipQueue function
function tipQueue() {
	this.elements = [];
	};

	// enqueue a new thingy
	tipQueue.prototype.enqueue = function (e) {
		console.log("tipQueue Enqueue");
		this.elements.push(e);
	};

	// remove an element from the front of the queue
	tipQueue.prototype.dequeue = function () {
		return this.elements.shift();
	};

	// check if the queue is empty
	tipQueue.prototype.isEmpty = function () {
		return this.elements.length == 0;
	};

	// get the element at the front of the queue
	tipQueue.prototype.peek = function () {
		return !this.isEmpty() ? this.elements[0] : undefined;
	};

	var qt = new tipQueue();

	// while tipQueue has items, call/fire them!
	while (tipQueue.length) {
	tipQueue.shift().call();
	};

function voteQueue() {
	this.elements = [];
	};

	// enqueue a new thingy
	voteQueue.prototype.enqueue = function (e) {
		if (debugmode == true){
		console.log("voteQueue enqueue");
	}
		this.elements.push(e);
	};

	// remove an element from the front of the queue
	voteQueue.prototype.dequeue = function () {
		return this.elements.shift();
	};

	// check if the queue is empty
	voteQueue.prototype.isEmpty = function () {
		return this.elements.length == 0;
	};

	// get the element at the front of the queue
	voteQueue.prototype.peek = function () {
		return !this.isEmpty() ? this.elements[0] : undefined;
	};

	var qv = new voteQueue();

	// while tipQueue has items, call/fire them!
	while (voteQueue.length) {
		voteQueue.shift().call();
	};
		/*

          setInterval(function(){
          console.log("3 seconds");
          }, 3000);
						*/

function commentQueue() {
	this.elements = [];
		};

		// enqueue a new thingy
		commentQueue.prototype.enqueue = function (e) {
			this.elements.push(e);
		};

		// remove an element from the front of the queue
		commentQueue.prototype.dequeue = function () {
			return this.elements.shift();
		};

		// check if the queue is empty
		commentQueue.prototype.isEmpty = function () {
			return this.elements.length == 0;
		};

		// get the element at the front of the queue
		commentQueue.prototype.peek = function () {
			return !this.isEmpty() ? this.elements[0] : undefined;
		};

		var qc = new commentQueue();

		var cr;

	var timetimetime = 1000;

function countdown() {

					count = 19;
					if (count >= 0){
	var timerId = setInterval(function() {
				console.log("║".blue + logo + " W ".blue.dim + "WAIT".grey.dim + " │ ".blue + count + "s on Post Limiter");
		count--;
		if(count <= 0) {
				// your code goes here
				clearInterval(timerId);
				count = 0;
				commentwait = false;
				 timetimetime = 1000;
		}
	}, timetimetime);
};
}

var counttime = parseFloat(count + "000");
// counttime = (count * 1000);

//----- Profile Updater / Stop Script function
function profileupdate(protype, profee, problock) {
	if (debugmode == true) {
		console.log("║".blue + logo + " ~ DBUG".magenta.dim + " │ ".blue + "function ".magenta.dim + "profileupdate".blue.bold + "(".white.dim + protype + "," + profee + "," + problock + ")".white.dim);
	};
	var profeepercent = parseFloat((1 - profee) * 100).toFixed(2);

	if (protype == "feeupdate") {

		var savefee = {
			firstrun: firstrun,
			devmode: devmode,
			debugmode: debugmode,
			uptimeinfo: uptimeinfo,
			version: version,
			tipfee: profee,
			tippy: tippy,
			owner: owner,
			wif: wif,
			bank: bank,
			memopubkey: memopubkey,
			profilepic: profilepic,
			showlogo: showlogo,
			autosaveblock: autosaveblock,
			jsonMetadata: jsonMetadata,
			showtime: showtime,
			setup: setup
		};

		fs.writeFile(__dirname + "/db/engine/config", JSON.stringify(savefee), function (err, win) {
			if (err) {
				console.log("ERROR: Unable to Write Block Data File!");
			};
			//console.log("║".blue + logo + " O".green.bold + " DISK".green.bold + " │".blue + " Saved New Tipping Fee " + profeepercent + "%");
		});

		var proupdate = {
			'profile': {
				'profile_image': profilepic,
				'name': 'Tippy ©',
				'about': 'STEEM Text to Tip Bot 🤖 Type "@' + tippy + ' help" for Commands 🤑 Low ' + profeepercent + '% Tipping Fee! 😘 Just the Tip..?',
				'location': '✔️ONLINE (Alpha v0.0.13)',
				'website': 'https://steemit.com/@tippy'
			}
		};
		steem.broadcast.accountUpdate(bank, tippy, undefined, undefined, undefined, memopubkey, proupdate, function (err, result) {
			if (err) {
				console.log("ERROR: Failed to Update Profile")
				if (debugmode == true) {
					console.log("║".blue + logo + "~~~DBUG ".magenta.dim + " │ ".blue + err);
				};
			};
			if (result) {
				console.log("║".blue + logo + " > ".green.bold + "SEND".white.bold.underline + " │ ".blue + "Profile on ".white.dim + "@".green + tippy.green.bold + " Updated Fee to ".white.dim + profeepercent.white.bold + "%".white.bold);
				if (debugmode == true) {
					console.log("║".blue + logo + " ~ DBUG".magenta.dim + " │ ".blue + "method ".green.dim + "steem.broadcast.account Update was Success!");
				}; //END debug
			} //END if(result)
		}); //END accountUpdate
	}; //END if feeupdate

	if (protype == "offline") {
		var tippyofflineprofile = {
			'profile': {
				'profile_image': profilepic,
				'name': 'Tippy ©',
				'about': 'STEEM Text to Tip Bot 🤖 is Under Development & OFFLINE! Hopefully Will Be Online Soon! 😘 Just the Tip..?',
				'location': '❌OFFLINE (Coming Soon!)',
				'website': 'https://steemit.com/@tippy'
			}
		};
		steem.broadcast.accountUpdate(bank, tippy, undefined, undefined, undefined, memopubkey, tippyofflineprofile, function (err, result) {
			if (err) {
				console.log("ERROR: Failed to Update Profile")
				if (debugmode == true) {
					console.log("║".blue + logo + "~~~DBUG ".magenta.dim + " │ ".blue + err);
				};
			};// END if(err)
			if (result) {
				console.log("║".blue + logo + " > ".green.bold + "SEND".white.bold.underline + " │ ".blue + "Profile Updated to OFFLINE Mode");
				console.log("║".blue + logo + " X".red.bold + " EXIT".red.bold.underline + " │ ".blue + "Shutting Down Now, Goodbye!");
				process.exit();
				if (debugmode == true) {
					console.log("║".blue + logo + " ~ DBUG ".magenta.dim + " │ ".blue + "Account Update Broadcast to Network Success!");
				}; //END if (debugmode == true)
			} //END if(result)
		}); // END steem.broadcast.accountUpdate
	}; //END if(protype == "offline")

	if (protype == "blocksave") {

		profeepercent = parseFloat((1 - profee) * 100).toFixed(2);

		var proupdate = {
			'profile': {
				'profile_image': profilepic,
				'name': 'Tippy ©',
				'about': 'STEEM Text-to-Tip Service ❔ Type "@' + tippy + ' help" for Commands Low ' + profeepercent + '% Tipping Fee! 💲 Last Scanned Block: #' + problock + "",
				'location': '✔️ONLINE (Alpha v0.0.13)',
				'website': 'https://steemit.com/@tippy'
			}
		};
		steem.broadcast.accountUpdate(bank, tippy, undefined, undefined, undefined, memopubkey, proupdate, function (err, result) {
			if (err) {
				console.log("ERROR: Failed to Update Profile")
				if (debugmode == true) {
					console.log("║".blue + logo + "~~~DBUG ".magenta.dim + " │ ".blue + err);
				};
			};
			if (result) {
				console.log("║".blue + logo + " > ".green.bold + "SEND".white.bold.underline + " │ ".blue + "Profile on ".white.dim + "@".green + tippy.green.bold + " Updated Last Saved Block to #".white.dim + problock);
				if (debugmode == true) {
					console.log("║".blue + logo + " ~ DBUG".magenta.dim + " │ ".blue + "method ".green.dim + "steem.broadcast.account Update was Success!");
				}; //END debug
			} //END if(result)
		}); //END accountUpdate
	}; //END if blocksave

}; //END function profileupdate();

//----- Reply to comment function
var replycomment = function (wif, parentAuthor, parentPermlink, tippy, permlink, title, content, metadata, block) {
		if (debugmode == true) {
			console.log("║".blue + logo + " ~ DBUG".magenta.dim + " │ ".blue + "function ".magenta.dim + "replycomment".blue.bold + "(".white.dim + wif + "," + parentAuthor + "," + parentPermlink + "," + tippy + "," + permlink + "," + title + "," + content + "," + metadata + "," + block + ")".white.dim);
		};
		if(commentwait == false){
			steem.broadcast.comment(wif, parentAuthor, parentPermlink, tippy, permlink, title, content, metadata, function (commentfailz, commentwinz) {
				if (commentfailz) {
					if (debugmode == true) {
						console.log(commentfailz);
					};
					console.log("║".blue + logo + " W ".yellow.dim + "WAIT".yellow + " │ ".blue + "Waiting on Comment Limiter to F**k Off!");

						setTimeout(function() {
							// Load first op without removing
						steem.broadcast.comment(wif, parentAuthor, parentPermlink, tippy, permlink, title, content, metadata, function (errqc, winqc) {
							if(errqc){

							}
							if(winqc){
								console.log("║".blue + logo + " > ".green.bold + "SEND".green.bold + " │ ".blue + time + "@" + parentAuthor + "'s Response Sent on Block #" + headstreamblock);
								countdown();
							}
						});
						}, counttime)
		}; //END  if (commentfailz)
		if (commentwinz) {
			console.log("║".blue + logo + " > ".green.bold + "SEND".green.bold + " │ ".blue + time + "@" + parentAuthor + "'s Response Sent on Block #" + headstreamblock);
			if (debugmode == true) {
				console.log(commentwinz);
			};
				countdown();
		}
	});
	} else {
		console.log("║".blue + logo + " W ".yellow.dim + "WAIT".yellow + " │ ".blue + "Waiting on Comment Limiter to F**k Off!");
		setTimeout(function() {
			// Load first op without removing
			console.log("║".blue + logo + " > ".yellow.dim + "SEND".yellow.dim + " │ ".blue + "@" + parentAuthor + "'s Queued Response is Broadcasting");

			steem.broadcast.comment(wif, parentAuthor, parentPermlink, tippy, permlink, title, content, metadata, function (errqc, winqc) {
				if(errqc){

				}
				if(winqc){
					console.log("║".blue + logo + " > ".green.bold + "SEND".green.bold + " │ ".blue + "@" + parentAuthor + "'s Response Sent on Block #" + headstreamblock);
					countdown();
				};

			});

		}, counttime)
		};
};//END replycomment

//----- Stat updater
var updatestat = function (stattype, statamount, newfile) {
	if (debugmode == true) {
		console.log("║".blue + logo + " ~ DBUG".magenta.dim + " │ ".blue + "function ".magenta.dim + "updatestat".blue.bold + "(".white.dim + stattype + "," + statamount + "," + newfile + ")".white.dim);
	};
	if (newfile == true) {
		var newstattype
		if (stattype == "balances") {
			newstattype = {
				balances: statamount
			};
		}; //END stattype == balances
		if (stattype == "helps") {
			newstattype = {
				helps: statamount
			};
		}; //END stattype == helps
		if (stattype == "infos") {
			newstattype = {
				infos: statamount
			};
		}; //END stattype == infos
		if (stattype == "pings") {
			newstattype = {
				pings: statamount
			};
		}; //END stattype == pings
		if (stattype == "tips") {
			newstattype = {
				tips: statamount
			};
		}; //END stattype == tips
		if (stattype == "sbdtipped") {
			newstattype = {
				sbdtipped: statamount
			};
		}; //END stattype == sbdtipped
		if (stattype == "steemtipped") {
			newstattype = {
				steemtipped: statamount
			};
		}; //END stattype == steemtipped
		if (stattype == "steemdepo") {
			newstattype = {
				steemdepo: statamount
			};
		}; //END stattype == steemtipped
		if (stattype == "sbddepo") {
			newstattype = {
				sbddepo: statamount
			};
		}; //END stattype == sbddepo
		console.log("║".blue + logo + " + ".green.bold + "DATA".gray.dim + " │".blue + ' Creating New ' + stattype + ' File...');
		fs.writeFile(__dirname + "/db/stats/" + stattype, JSON.stringify(newstattype), function (updatestaterr, updatestatwin) {
			if (updatestaterr) return console.log('Save error', null);
			if (stattype == "balances") {
				steem.broadcast.comment(wif, parentAuthor, parentPermlink, "tippy", permlink, "@Tippy Account Error:", "<b>@tippy - Account: ERROR - </b>Steemit Tip Bot<hr>You didn't have a @tippy account or balance so one was created!<hr><sub>@Tippy - Steemit Text-to-Tip Service - Tip Without Ever Leaving The Page!<br>" + devmsg + "</sub>", version, function (err, result) {});
			}
			console.log("║".blue + logo + " + ".green.bold + "DATA".gray.dim + " │".blue + ' Completed New ' + stattype + ' File Creation!');
		});
	}; //END if newfile == true
	if (newfile == null) {
		if (debugmode == true) {
			console.log("║".blue + logo + " ~ DBUG".magenta.dim + " │ ".blue + "newfile == undefined!".white.dim);
		};
		var statupdate;
		fs.readFile(__dirname + "/db/stats/" + stattype, function (updatestatreaderror, updatestatread) {
			if (updatestatreaderror) return console.log(stattype + ' File Not Found', null);
			if (updatestatread) {
				if (debugmode == true) {
					console.log("║".blue + logo + " ~ DBUG".magenta.dim + " │ ".blue + "Success on Stats File Read of ".white.dim + stattype);
				};
				var statdata = JSON.parse(updatestatread);
				if (stattype == "balances") {
					statupdate = statdata.balances;
				}; //END stattype == balances
				if (stattype == "helps") {
					statupdate = statdata.helps;
				}; //END stattype == helps
				if (stattype == "infos") {
					statupdate = statdata.infos;
				}; //END stattype == infos
				if (stattype == "pings") {
					statupdate = statdata.pings;
				};
				if (stattype == "tips") {
					statupdate = statdata.tips;
				};
				if (stattype == "sbdtipped") {
					statupdate = statdata.sbdtipped;
				};
				if (stattype == "steemtipped") {
					statupdate = statdata.steemtipped;
				};
				if (stattype == "steemdepo") {
					statupdate = statdata.steemdepo;
				};
				if (stattype == "sbddepo") {
					statupdate = statdata.sbddepo;
				};

				var newstatupdate = statupdate + statamount;

				var writestat;
				if (stattype == "balances") {
					writestat = {
						balances: newstatupdate
					};
				}; //END stattype == balances
				if (stattype == "helps") {
					writestat = {
						helps: newstatupdate
					};
				}; //END stattype == helps
				if (stattype == "infos") {
					writestat = {
						infos: newstatupdate
					};
				}; //END stattype == infos
				if (stattype == "pings") {
					writestat = {
						pings: newstatupdate
					};
				}; //END stattype == pings
				if (stattype == "tips") {
					writestat = {
						tips: newstatupdate
					};
				}; //END stattype == pings
				if (stattype == "sbdtipped") {
					writestat = {
						sbdtipped: newstatupdate
					};
				}; //END stattype == sbdtipped
				if (stattype == "steemtipped") {
					writestat = {
						steemtipped: newstatupdate
					};
				}; //END stattype == steemtipped
				if (stattype == "steemdepo") {
					writestat = {
						steemdepo: newstatupdate
					};
				}; //END stattype == steemdepo
				if (stattype == "sbddepo") {
					writestat = {
						sbddepo: newstatupdate
					};
				}; //END stattype == sbddepo
				fs.writeFile(__dirname + "/db/stats/" + stattype, JSON.stringify(writestat), function (writestaterr, writestatdata) {
					if (writestaterr) return console.log('Save error', null);

					console.log("║".blue + logo + " + ".green.bold + "STAT ".cyan.bold.underline + "│".blue + " Stat Increased: " + stattype + " +" + statamount);

				});
			};
		});

	} //END newfile == true
}; //END function updatestat

//----- Tips/Transfer function
var transfertip = function (bankwif, tippy, to, from, amount, currency, message, block, newbalval) {

	fs.readFile(__dirname + "/db/balances/" + from, function (err, details) {
		if (err) {
			console.log("Oh shit error!");
		}
		if (details) {
			var info = JSON.parse(details);
			// Read & Store Current STEEM/SBD Balances
			steembalance = info.steem;
			sbdbalance = info.sbd;
			console.log("steembalance: " + steembalance);
			console.log("sbdbalance: " + sbdbalance);
		};
	});

	steem.broadcast.transfer(bankwif, tippy, to, amount, message, function (fuckeduptransfer, senttransfer) {
		if (fuckeduptransfer) {
			console.log("transfer fucked up " + fuckeduptransfer);
		};
		if (senttransfer) {
			// Save out blockheight!
			saveblockdataheight(block);

			if (currency == "STEEM") {
				// Prepare the Users STEEM Balance to be Saved After Adjusting Above
				info = {
					user: from,
					steem: newbalval,
					sbd: sbdbalance
				};
				amount = parseFloat(amount);
				stattype = "steemtipped";
				updatestat(stattype, amount, null);
			};

			if (currency == "SBD") {
				// Prepare the Users SBD Balance to be Saved After Adjusting Above
				info = {
					user: from,
					steem: steembalance,
					sbd: newbalval
				};
				amount = parseFloat(amount);
				stattype = "sbdtipped";
				updatestat(stattype, amount, null);
			};
			// Write Sending Users New Balance to Balances File
			fs.writeFile(__dirname + "/db/balances/" + from, JSON.stringify(info), function (err, d) {
				// If User Balance Save to File Fails
				if (err) {
					console.log("║".blue + logo + " ! ".red.bold.underline + "WARN".red.bold.underline + " │".blue + 'Save error');
				};
				stattype = "tips";
				updatestat(stattype, 1, null);
				console.log("║".blue + logo + " O".green.bold + " DISK".green.bold + " │".blue + " @" + from + " Balance Updated");
			}); // End writefile / balance save
		}; //END senttransfer
	}); //END steem.broadcast.transfer
}; //END transfertip function

//----- Confirmation via upvotes
var confirmvote = function (parentAuthor, permlink, weight, type) {
	if (debugmode == true) {
		console.log("║".blue + logo + " ~ DBUG".magenta.dim + " │ ".blue + "function ".magenta.dim + "confirmvote".blue.bold + "(".white.dim + parentAuthor + "," + permlink + "," + weight + "," + type + ")".white.dim);
	};
	steem.broadcast.vote(
		wif,
		tippy,
		parentAuthor,
		permlink,
		weight,
		function (err, result) {
			if (debugmode == true) {
				if (err) {
					console.log("║".blue + logo + "~~~DBUG ".magenta.dim + " │ ".blue + " " + type + " Confirmation Vote FAILED");
					console.log(err);
				};
				if (result) {
					console.log("║".blue + logo + "~~~DBUG ".magenta.dim + " │ ".blue + " " + type + " Confirmation Vote Success!");
					console.log(result);
				};
			} else {

				if (err) {
					console.log("║ ".blue + logo + "!".red + " WARN".red.bold + " " + type + " Confirmation Upvote FAILED");
				};
				if (result) {
					console.log("║ ".blue + logo + "^".white.bold.bgBlue + " VOTE".blue.bold + " │ ".blue + type + " Confirmation Vote SUCCESS!");
				};
			};
		});
};

//----- Grab Blockchain Data
function blockdatainit() {
	if (debugmode == true) {
		console.log("║".blue + logo + "~~ DEBUG: ".magenta.dim + "function ".magenta.dim + "blockdatainit".blue.bold + "(".white.dim + ")".white.dim + "                              **║".blue);
	};
	fs.exists(__dirname + "/db/stats/blockdata", function (exists) {

		// if not exist then create new config file
		if (!exists) {
			var newblockdata = {
				last_block: 0
			};

			console.log("Notice".white.bold.underline.bgYellow + "No Block Data File Found! Creating Now!");
			fs.writeFile(__dirname + "/db/stats/blockdata", JSON.stringify(newblockdata), function (err, win) {
				if (err) {
					console.log("ERROR: Unable to Save Block Data to Disk!");
				};
				if (win) {
					console.log("SUCCESS:".green.bold.underline.dim + " Created New Blockdata File!");
				};
			}); // END /db/engine/config writeFile
		} else {
			console.log("║** ".blue + "SYSTEM:".gray.dim + " Found Block Data..! Loading Last Scanned Block" + "       **║".blue);
			fs.readFile(__dirname + "/db/stats/blockdata", function (err, data) {
				if (err) {
					console.log("ERROR: Unable to Read Block Data File!");
				};
				if (data) {
					var bd = JSON.parse(data);
					last_block = bd.last_block;
					console.log("║** ".blue + "SUCCESS:".green.bold.underline.dim + " Found Block Data - Last Block: #" + last_block + "            **║".blue);
					console.log("╠══════════════════════════════════════════════════════════════════╣".blue);
					console.log("║".blue + "** ".blue.bold + "LOADING:".green.bold + " Current STEEM Block Height For Sync... Please Wait " + " **║".blue);
					if (logo == true) {
						console.log("╠══════════════════════════════════════════════════════════════════╝".blue);
					};
					if (logo == false) {
						console.log("╠══════════════════════════════════════════════════════════════════╝".blue);
					};
				};
			});
		}; //END else statment
	}); //END !exists db/engine
	console.log("║** ".blue + "NOTICE: ".yellow.bold.underline + "Bot Account ".white + "(".white + "@".green.dim + tippy.green.bold + ") Needs Sync to Block #".white + current_block + "   **║".blue);
	if (logo == true) {
		console.log("╠══════════════╤═══════════════════════════════════════════════════╝".blue);
	};
	if (logo == false) {
		console.log("╠════════╤═════════════════════════════════════════════════════════╝".blue);
	};
	steem.api.getDynamicGlobalProperties(function (err, props) {
		if (props) {
			current_block = props["last_irreversible_block_num"];
			//check to see if we need to catch up to current block height
			if (current_block > last_block) {
				prompt.start();

				prompt.message = "";

				prompt.get([{
					name: 'asksyncinput',
					description: "║".blue.dim + ' Fetch Blocks Missed While Offline?'.white.dim + '(true / false)',
					required: true,
				  validator: /t[rue]*|f[alse]?/,
					default: true
				}], function (err, result) {
				//	if (err) {
					//	console.log("ERROR: Sync Input Failed! Please Restart")
				//	};
					if (result) {
						var	syncinput = result.asksyncinput;
						if ( syncinput.toString() == "true" ) {
							synced == 0;
							current();
						} else {
							synced == 1;
							startsplash();
						};//END syncinput == true
					}; //END if (result)
				}); // END Setup Prompt
			};
		}
		if (err) {
			console.log("ERROR: Failed to Get Current Block!");
		}
	});
}; //END function blockdatainit();

//----- Create some motherfucking folders if they ain't existin'
function createdb() {
	// Debug Stuff
	if (debugmode == true) {
		console.log("║".blue + logo + "~~ DEBUG: ".magenta.dim + "function ".magenta.dim + "createdb".blue.bold + "( ".white.dim + ")".white.dim);
	};

	if (!fs.existsSync(__dirname + "/db")) {
		fs.mkdirSync(__dirname + "/db");
		console.log("NOTICE:".yellow.bold.underline + "No Database Directory Found.. Creating /db Folder");
	};
	if (!fs.existsSync(__dirname + "/db/balances")) {
		console.log("NOTICE:".yellow.bold.underline + "No Balance Directory Found.. Creating /db/balances Folder");
		fs.mkdirSync(__dirname + "/db/balances");
	};
	if (!fs.existsSync(__dirname + "/db/stats")) {
		console.log("NOTICE:".yellow.bold.underline + "No Stats Directory Found.. Creating /db/stats Folder");
		fs.mkdirSync(__dirname + "/db/stats");
	};
	if (!fs.existsSync(__dirname + "/db/engine")) {
		console.log("NOTICE:".yellow.bold.underline + "No Engine Directory Found.. Creating /db/engine Folder");
		fs.mkdirSync(__dirname + "/db/engine");
	};
}; // END function createdb();

//----- first run & setup functionality
function firsttime() {
	if (debugmode == true) {
		console.log("║".blue + logo + "~~ DEBUG: ".magenta.dim + "function ".magenta.dim + "firsttime".blue.bold + "( ".white.dim + ")".white.dim);
	};
	console.log("Notice".white.bold.underline.bgYellow + ": First Run Detected! Please Configure Tip Bot Engine to Continue!".white);

	prompt.start();

	prompt.message = "";

	prompt.get([{
		name: 'tippyinput',
		description: 'Bot Account Name? (No @)',
		required: true
	}, {
		name: 'bankinput',
		description: "Bot Account Active Private Key?",
		required: true,
		replace: '*',
		hidden: true
	}, {
		name: 'wifinput',
		description: "Bot Account Posting Private Key?",
		required: true,
		replace: '*',
		hidden: true
	}, {
		name: 'memopubkeyinput',
		description: "Bot Account Memo Public Key?",
		required: true
	}, {
		name: 'tipfeeinput',
		description: "Fee to Charge on Tips? (As a Percentage - 1.00%)",
		required: true
	}, {
		name: 'profilepicinput',
		description: 'Enter URL to Profile Picture: (http://site.com/picture.png)',
		required: true
	}, {
		name: 'devmodeinput',
		description: 'Enable Developer Mode / Show Warning Footer ( true or false )',
		required: true,
		validator: /t[rue]*|f[alse]?/,
		warning: 'Must respond true or false!',
		default: 'false'
	}, {
		name: 'debugmodeinput',
		description: 'Enable Debug Output in Console? ( true or false )',
		required: true,
		validator: /t[rue]*|f[alse]?/,
		warning: 'Must respond true or false!',
		default: 'false'
	}, {
		name: 'uptimeinfoinput',
		description: 'Show Uptime Info in Console? ( true or false )',
		required: true,
		validator: /t[rue]*|f[alse]?/,
		warning: 'Must respond true or false!',
		default: 'false'
	}, {
		name: 'showlogoinput',
		description: 'Show Logo in Console? ( true or false )',
		required: true,
		validator: /t[rue]*|f[alse]?/,
		warning: 'Must respond true or false!',
		default: 'false'
	}, {
		name: 'autosaveblockinput',
		description: 'Number of Blocks Between Autosaves?',
		required: true,
		default: 10
	}, {
		name: 'showtimeinput',
		description: 'Show Time on Console Output?  ( true or false )',
		validator: /t[rue]*|f[alse]?/,
		warning: 'Must respond true or false!',
		default: 'false'
	}, {
		name: 'ownerinput',
		description: "Owner Account Name? (No @) ",
		required: true
	}], function (err, result) {

		if (err) {
			console.log("ERROR: Something Went Wrong During Config.. Please Restart Service! (ctrl + c to exit)")
		};

		if (result) {

			var newconfig = {
				firstrun: false,
				devmode: result.devmodeinput,
				debugmode: result.debugmodeinput,
				uptimeinfo: result.uptimeinfoinput,
				version: version,
				tipfee: result.tipfeeinput,
				tippy: result.tippyinput,
				owner: result.ownerinput,
				wif: result.wifinput,
				bank: result.bankinput,
				memopubkey: result.memopubkeyinput,
				profilepic: result.profilepicinput,
				showlogo: result.showlogoinput,
				autosaveblock: result.autosaveblockinput,
				showtime: result.showtimeinput,
				jsonMetadata: jsonMetadata,
				setup: false
			};

			console.log("SYSTEM:".bold.purple + " You Completed The Configuration - Saving");

			fs.writeFile(__dirname + "/db/engine/config", JSON.stringify(newconfig), function (err, win) {
				if (err) {
					console.log("ERROR: Unable to Save Config to Disk!");
				};
				if (win) {
					console.log("SUCCESS:".green.bold.underline.dim + " New Configuration Input Saved");
				};
			}); // END /db/engine/config writeFile
			blockdatainit();
		}; //END if (result)
	}); // END Setup Prompt
}; //END function firstrun();

//----- Configuration file exists? load it.
function configexists() {
	if (debugmode == true) {
		console.log("║".blue + logo + "~~ DEBUG: ".magenta.dim + "function ".magenta.dim + "configexists".blue.bold + "( ".white.dim + ")".white.dim);
	};
	fs.readFile(__dirname + "/db/engine/config", function (configexistserror, configexistsdata) {

		if (configexistserror) {
			console.log("ERROR: Unable to Read Config File!")
		};

		if (configexistsdata) {
			console.log("║** ".blue + "SUCCESS:".green.bold.underline.dim + " Fetched & Parsed Config File Data!" + "                  **║".blue)
			var configdata = JSON.parse(configexistsdata);
			debugmode = configdata.debugmode;

			if (debugmode == true) {
				console.log("║".blue + logo + "~~~DBUG ".magenta.dim + " configdata: ".bold + configdata);
			}

			firstrun = false;
			devmode = configdata.devmode;
			debugmode = configdata.debugmode;
			uptimeinfo = configdata.uptimeinfo;
			version = version;
			tipfee = configdata.tipfee;
			tippy = configdata.tippy;
			owner = configdata.owner;
			wif = configdata.wif;
			bank = configdata.bank;
			memopubkey = configdata.memopubkey;
			profilepic = configdata.profilepic;
			showlogo = configdata.showlogo;
			autosaveblock = configdata.autosaveblock;
			showtime = configdata.showtime;
			jsonMetadata = configdata.jsonMetadata;
				setup = false;

			protype = "feeupdate";
			profileupdate(protype, tipfee);

			// Set the logo on or off here
			if (showlogo == true) {
				logo = (" -".blue.dim + "|".blue + "§".blue.bold + "|".blue + "-".blue.dim);
				spacer = "";
			};
			if (showlogo == false) {
				logo = "";
				spacer = "     ";
			};

			// Set the logo on or off here
			if (showtime == true) {
								var tnhours = new Date().getUTCHours();
								var tnmins = new Date().getUTCMinutes();
				var tnsecs = new Date().getUTCSeconds();
				if (tnsecs == 0){
				 tnsecs = String("00");
				}
				if (tnsecs == 1){
				 tnsecs = String("0" + tnsecs);
				}
				if (tnsecs < 10 && tnsecs > 1){
				 tnsecs = String(tnsecs + "0");
				}
				if (tnsecs == 10){
					tnsecs = 10;
				}
				var tnmins = new Date().getUTCMinutes();
				if (tnmins <= 10){
				 tnmins = String("0" + tnmins);
				}
				if (tnmins == 10){
					tnmins = 10;
				}
				var tnhours = new Date().getUTCHours();
			 time = tnhours + ":" + tnmins + ":" + tnsecs + " │ ".blue;
			};
			if (showtime == false) {
				time = "";
			};

			// Set the devmsg variable below to appear in Footer
			if (devmode == true) {
				devmsg = "(<b>NOTICE:</b> This Service is Currently Undergoing Development!)";
			} else {
				devmsg = "";
			};

			attippy = String("@" + tippy);
			blockdatainit();

		}; // END if(data)
	}); // END readFile /db/engine/config
}; //END function configexists();

//----- Check for Config File & Create it if Missing and detects 1st run
function configcheck() {
	if (debugmode == true) {
		console.log("║".blue + logo + " ~ DBUG ".magenta.dim + "│ ".blue + "function ".magenta.dim + "configcheck".blue.bold + "( ".white.dim + ")".white.dim);
	};

	fs.exists(__dirname + "/db/engine/config", function (exists) {
		// if not exist then create new config file
		if (!exists) {
			console.log("║** ".blue + "SYSTEM:".gray.dim + " No Config File Found! Creating One Now!");
			firsttime();
		} else {
			console.log("║** ".blue + "SYSTEM:".gray.dim + " Found Config File! Loading Settings Now!" + "             **║".blue);
			configexists();
		}; //END else statment
	}); //END !exists db/engine
}; //END function configcheck();
configcheck();

//----- Create a new user
var create_user = function (newuser) {
	//  var parentAuthor = op["author"];
	//  var parentPermlink = op["parent_permlink"];
	//  var permlink = op["permlink"];
	//  var reciever = op["body"];
	if (debugmode == true) {
		console.log("║".blue + logo + " ~ DBUG ".magenta.dim + "│ ".blue + "function ".magenta.dim + "create_user(".blue.bold + newuser + ")".blue.bold);
	};
	var info = {
		user: newuser,
		steem: 0.000,
		sbd: 0.000
	};
	//create DB file for user
	console.log("║".blue + logo + " + SAVE ".green.dim + "│ ".blue + 'Creating New User Account ' + newuser);
	fs.writeFile(__dirname + "/db/balances/" + newuser, JSON.stringify(info), function (err, d) {
		if (err) return console.log('Save error', null);
		if (d) {
			console.log("║".blue + logo + " + SAVE ".green.dim + "│ ".blue + "@" + newuser + " User Account Made!");
		}
		//  steem.broadcast.comment(wif, newuser, parentPermlink, tippy, permlink, "@Tippy Account Error:", "<b>@tippy - Account: ERROR - </b>Steemit Tip Bot<hr>You didn't have a @tippy account or balance so one was created!<hr><sub>@Tippy - Steemit Text-to-Tip Service - Tip Without Ever Leaving The Page!<br>" + devmsg + "</sub>", jsonMetadata, function (err, result) {

	}); //END fs.writefile
}; // END create_user

//----- Save Block Height to file
function saveblockdataheight(blockheight) {
	if (blockheight == undefined) {
					console.log("║".blue + logo + " O".red.bold + " DISK".red.bold + " │".blue + " Chain Height Save ERROR! Block Height is 'undefined'");
		process.exit();
	};
	savedblock = false;
	if (debugmode == true) {
		console.log("║".blue + logo + "~~ DBUG ".magenta.dim + "│ ".blue + "function ".magenta.dim + "saveblockdataheight(".blue.bold + blockheight + ")".blue.bold);
	};
	var savenewblockdata = {
		last_block: blockheight
	};
	console.log("║".blue + logo + " O".green.bold + " DISK".yellow.bold + " │".blue + " Saving Chain Height at Block #" + blockheight);

	fs.writeFile(__dirname + "/db/stats/blockdata", JSON.stringify(savenewblockdata), function (err, win) {
		savedblock = true;
		if (err) {
			console.log("║".blue + logo + " O".red.bold + " DISK".red.bold + " │".blue + " Chain Height Save ERROR!");
		};
		console.log("║".blue + logo + " O".green.bold + " DISK".green.bold + " │".blue + " Chain Height Save Succesful!");
		profileupdate("blocksave", tipfee, blockheight);
	});
};

//----- process_comment is WHERE THE COMMAND MAGIC HAPPENS
var process_comment = function (op, blockprocesscommnum) {
	var parentAuthor = op["author"];
	var parentPermlink = op["permlink"];
	var permlink = op["permlink"];
	var reciever = op["body"];
	var newzero = parseFloat(0.000);
	var author = op["author"];
	var blockprocesscommnum = blockprocesscommnum;
	totalcomment++
	if (debugmode == true) {
		console.log("║".blue + logo + " ~ DBUG".magenta.dim + " │ ".blue + "function ".magenta.dim + "process_comment".blue.bold + "(".white.dim + blockprocesscommnum + ")".white.dim);
	};
	// Any commands that check op["author"] == owner are admin / owner commands and cannot be used by normal users
	if (op["author"] != tippy) {
		// COnvert the body of the comment to a String
		var commentstring = op["body"].toString();
		// Check if comment contains @tippy
		if (commentstring.toLowerCase().indexOf("@tippy") >= 0) {
			// Grab the command if it does and store it in commandparsed variable
			var commandparsed = getcommand(commentstring.slice(commentstring.indexOf(attippy) + attippy.length));
			if (debugmode == true) {
				console.log("║".blue + logo + " ~ DEBUG: ".magenta.dim + "var".magenta + " commandparsed = " + commandparsed);
			};
			// Scrape everything between " " in commandparsed to get memo
			var maybmemo = commandparsed.substring(commandparsed.lastIndexOf(' "') + 2, commandparsed.lastIndexOf('"'));
			if (maybmemo != undefined && maybmemo.length >= 2) {
				console.log("║".blue + logo + " ~ MEMO".magenta.dim + " │ ".blue + "Possible Memo Detected: " + maybmemo);
			}; //END maybememo has content
			if (maybmemo.length <= 2) {
				//  console.log("maybememo: NO MEMO");
			};
			//-----  Transaction fee
			if (commandparsed.toLowerCase().indexOf("fee") >= 0 ) {
				if (op["author"] == owner) {
					var newfee = commandparsed.split(' ', 4)[1];
					//Check if new fee is decimal
					if (newfee < 1 && newfee > 0.009) {
						protype = "feeupdate";
						var votetype = "Fee"
						profileupdate(protype, tipfee);
						qv.enqueue(confirmvote(parentAuthor, permlink, 10, votetype));
						console.log("║".blue + logo + "**".yellow + "ADMIN".white.bold.underline + " │ ".blue + "@" + author + " Set Tip Fee to " + feepercent + "%");
					};
					//Check if new fee is percent
					if (newfee.indexOf("%") >= 0 && parseFloat(newfee) > 0 && parseFloat(newfee) < 100) {
						var cleanedfee = parseFloat(newfee.replace(/\%/g, '').toLowerCase());
						tipfee = 1 - (cleanedfee / 100);
						// console.log(tipfee);
						var feepercent = parseFloat((1 - tipfee) * 100).toFixed(2);

						protype = "feeupdate";
						var votetype = "fee"
						profileupdate(protype, tipfee);
						qv.enqueue(confirmvote(parentAuthor, permlink, 10, votetype));
						console.log("║".blue + logo + "**".yellow + "ADMIN".white.bold.underline + " │ ".blue + "@" + author + " Set Tip Fee to " + feepercent + "%");
					};
					var cleanedfee = parseFloat(newfee.replace(/\%/g, '').toLowerCase());
					tipfee = 1 - (cleanedfee / 100);
					var feepercent = parseFloat((1 - tipfee) * 100).toFixed(2);
					var feepercentplus = (feepercent * 100);

					//Error handling and range enforcment
					if (newfee.indexOf("%") >= 0) {
						if (newfee > 1 && newfee.indexOf("%") == 0) {
							console.log("ERROR: @" + author + " Set Invalid Tip Fee! " + feepercentplus + "% is above accepted range!");;
						} else if (parseFloat(newfee) < 0 && newfee.indexOf("%") != 0) {
							console.log("ERROR: @" + author + " Set Invalid Tip Fee! " + feepercentplus + "% is below accepted range!");
						};
					};

					if (newfee.indexOf("%") >= 0 && newfee < 1) {
						console.log("ERROR: @" + author + " Set Invalid Tip Fee! " + feepercent + "% is below accepted range!");
					} else if (newfee.indexOf("%") >= 0 && parseFloat(newfee) > 100) {
						console.log("ERROR: @" + author + " Set Invalid Tip Fee! " + feepercent + "% is above accepted range!");;
					};
				};

			};

			//-----  showtime on
			if (commandparsed.toLowerCase().indexOf("showtime on") >= 0) {
				if (op["author"] == owner) {
					showtime = true;
					console.log("║".blue + logo + "**".yellow + "ADMIN".white.bold.underline + " │ ".blue + "@" + author + " Turned Showtime Mode: On");
					var votetype = "Showtime On"
					qv.enqueue(confirmvote(parentAuthor, permlink, 10, votetype));
				};

			};

			//-----  showtime of
			if (commandparsed.toLowerCase().indexOf("showtime off") >= 0) {
				if (op["author"] == owner) {
					showtime = false;
					console.log("║".blue + logo + "**".yellow + "ADMIN".white.bold.underline + " │ ".blue + "@" + author + " Turned Showtime Mode: On");
					var votetype = "Showtime On"
					qv.enqueue(confirmvote(parentAuthor, permlink, 10, votetype));
				};

			};

			//-----  Debugmode on
			if (commandparsed.toLowerCase().indexOf("debug on") >= 0) {
				if (op["author"] == owner) {
					debugmode = true;
					console.log("║".blue + logo + "**".yellow + "ADMIN".white.bold.underline + " │ ".blue + "@" + author + " Turned Debug Mode: On");
					var votetype = "Debug On"
					qv.enqueue(confirmvote(parentAuthor, permlink, 10, votetype));
				};

			};

			//-----  Debugmode off
			if (commandparsed.toLowerCase().indexOf("debug off") >= 0) {
				if (op["author"] == owner) {
					debugmode = false;
					console.log("║".blue + logo + "**".yellow + "ADMIN".white.bold.underline + " │ ".blue + "@" + author + " Turned Debug Mode: Off");
					var votetype = "Debug Off"
					qv.enqueue(confirmvote(parentAuthor, permlink, 10, votetype));
				};

			};

			// Check for sync status and only run if synced
			if (synced == 1) {
				//----- Stop tipping service
				if (commandparsed.toLowerCase().indexOf("service stop") >= 0) {
					if (op["author"] == owner) {
						protype = "offline";
						console.log("║".blue + logo + "**".yellow + "ADMIN".white.bold.underline + " │ ".blue + "@" + author + " Shutting Down Tipping Engine!");
						qv.enqueue(confirmvote(parentAuthor, permlink, 10, votetype));
						profileupdate(protype);
						saveblockdataheight(safestreamblock);

					};
				};
			}; //END if synced commands

			//-----  Uptimeinfo on
			if (commandparsed.toLowerCase().indexOf("uptime on") >= 0) {
				if (op["author"] == owner) {
					uptimeinfo = true;
					console.log("║".blue + logo + "**".yellow + "ADMIN".white.bold.underline + " │ ".blue + "@" + author + " Turned Uptimeinfo Mode: On");
					var votetype = "Uptimeinfo On"
					qv.enqueue(confirmvote(parentAuthor, permlink, 10, votetype));
				};

			};

			//-----  Uptimeinfo off
			if (commandparsed.toLowerCase().indexOf("uptime off") >= 0) {
				if (op["author"] == owner) {
					uptimeinfo = false;
					console.log("║".blue + logo + "**".yellow + "ADMIN".white.bold.underline + " │ ".blue + "@" + author + " Turned Uptimeinfo Mode: Off");
					var votetype = "Uptimeinfo Off"
					qv.enqueue(confirmvote(parentAuthor, permlink, 10, votetype));
				};

			};

			//-----  FLAG
			if (commandparsed.toLowerCase().indexOf("flag") >= 0 || commandparsed.toLowerCase().indexOf("-f") >= 0 ) {
			 if (op["author"] == owner) {
				var weight = -10000;
				console.log("║".blue + logo + " @ ".green.bold + "CALL".white.bold + " │".blue + " FLAG".white.bold + " from @" + parentAuthor + " on Block #" + blockprocesscommnum);
				qv.enqueue(confirmvote(op["parent_author"], op["parent_permlink"], weight, "flag"));
			 };
			}; //END FLAG

			//-----  POWERUP
			if (commandparsed.toLowerCase().indexOf("powerup") >= 0 || commandparsed.toLowerCase().indexOf("-p") >= 0 ) {
				var gifted = commandparsed.split(' ', 4)[1];
				var cleaned = gifted.replace(/\@/g, '').toLowerCase();
				var amount = commandparsed.split(' ', 4)[2];
				var amount = parseFloat(amount).toFixed(3);
				var tipcurrency = commandparsed.split(/[, ]+/).pop().toUpperCase();
				console.log("║".blue + logo + " @ ".green.bold + "CALL".white.bold + " │".blue + " POWERUP ".white.bold + " - @" + parentAuthor + " of " + amount + " " + tipcurrency + " to @" + cleaned);
				fs.existsSync(__dirname + "/db/balances/" + parentAuthor, function (exists) {
					// if not exist then add user
					if (!exists) {
						create_user(parentAuthor);
					} else {

						fs.readFile(__dirname + "/db/balances/" + parentAuthor, function (err, details) {
							if (err) return cb('Can\'t find user', null);
							info = JSON.parse(details);
							var steembalance = info.steem;
							var sbdbalance = info.sbd;
							var gifted = op["body"].split(' ', 4)[2];
							var cleaned = gifted.replace(/\@/g, '').toLowerCase();
							var amount = op["body"].split(' ', 4)[3];
							var amount = parseFloat(amount).toFixed(3);
							var tipcurrency = op["body"].split(/[, ]+/).pop().toUpperCase();

							if (tipcurrency == "STEEM") {
								if (amount <= steembalance) {
									var amountafterfee = parseFloat((amount * tipfee) + 0.000).toFixed(3);
									var fee = parseFloat(amount - amountafterfee + 0.000).toFixed(3);
									var steembalanceafter = parseFloat(steembalance - amountafterfee).toFixed(3);
									var steembalanceafter = Number(steembalanceafter - fee);
									var feepercent = parseFloat((1 - tipfee) * 100).toFixed(2);

									var info = {
										user: parentAuthor,
										steem: steembalanceafter,
										sbd: sbdbalance
									};
									// Send STEEM as STEEM Power to Target Account
									steem.broadcast.transferToVesting(bank, tippy, cleaned, amountafterfee + " " + tipcurrency, function (err, result) {
										if (err) {
											console.log("║".blue + logo + " * ".random + "WARN".red.bold + " PowerUp FAILED! ");
											if (debugmode == true) {
												console.log("║".blue + logo + "~~~DBUG ".magenta.dim + err);
											};
										};
										if (result) {
											console.log("SUCCESS: PowerUp Was Accepted!! ");
											console.log("║".blue + logo + " * ".random + 'BANK'.yellow.bgGreen + ' -  @' + parentAuthor + "'s Balance, Subtracting " + amount + " " + tipcurrency);
											fs.writeFile(__dirname + "/db/balances/" + parentAuthor, JSON.stringify(info), function (err, d) {
												if (err) {
													console.log('Save error');
												};
											});
											if (fee > 0) {
												var steemfeemessage = "🤖 @Tippy Fee: " + feepercent + "% - " + fee + " " + tipcurrency + " - Paid by @" + parentAuthor;
												qt.enqueue(transfertip(bank, tippy, owner, fee + " " + tipcurrency, steemfeemessage));
											} else {
												console.log("║".blue + logo + " * ".random + "WARN".red.bold + " PowerUp Fee Cannot Be Deducted Due to Tip Size!")
											};
											var votetype = "Powerup"
											qv.enqueue(confirmvote(parentAuthor, permlink, 10, votetype));
											console.log("║".blue + logo + " * ".random + "WIN!".green.bold + " PowerUp Success! " + amount + " " + tipcurrency + " Powerup from @" + parentAuthor + " to @" + cleaned + " Completed!");
										};
									});
								} else {
									var title = "@Tippy PowerUp Error:";
									var content = "<b>@tippy - Tip PowerUp - </b>Steemit Tip Bot<hr><h3>@tippy Error!</h3>Not enought STEEM in your account!<br>Send STEEM or SBD to @tippy to top up account!<hr><sub>@Tippy - Steemit Text-to-Tip Service - Tip Without Ever Leaving The Page!<br>" + devmsg + "</sub>";
									qc.enqueue(replycomment(wif, parentAuthor, parentPermlink, tippy, permlink, title, content, jsonMetadata));
								};
							};

							if (tipcurrency == "SBD") {
								var title = "@Tippy PowerUp Error:";
								var content = "<b>@tippy - Tip PowerUp - </b>Steemit Tip Bot<hr><h3>@tippy Error!</h3>Unfortunately You Can't PowerUp SBD! Sorry! <br>Send STEEM to @tippy to Top up Your Account to PowerUp Others!!<hr><sub>@Tippy - Steemit Text-to-Tip Service - Tip Without Ever Leaving The Page!<br>" + devmsg + "</sub>";
								qc.enqueue(replycomment(wif, parentAuthor, parentPermlink, tippy, permlink, title, content, jsonMetadata, blockprocesscommnum));
								console.log("║".blue + logo + " * ".random + "WARN".red.bold + " User @" + author + "Tried to Powerup SBD... Impossible!")
							}; //END if (tipcurrency == "SBD")

						});

					}
				});

			};

			//-----  PING FUNCTION
			if (commandparsed.toLowerCase().indexOf("ping") >= 0 || commandparsed.toLowerCase().indexOf("-o") >= 0 ) {

				fs.exists(__dirname + "/db/stats/" + "pings", function (exists) {
					// if not exist then add user
					if (!exists) {
						newfile = true;
						stattype = "pings";
						updatestat(stattype, 1, newfile);
					} else {
						newfile = null;
						stattype = "pings";
						updatestat(stattype, 1, null);

					}
				});
				var title = "@Tippy Ping:";
				var content = [
					"| <center><b>@Tippy Ping & Status</b></center>  |",
					"|:----:|",
					"",
					"<center><h3>Pong @" + parentAuthor + "!</h3></center>",
					"<center><sub>( Service is Online! )</sub></center>",
					"<hr>",
					tippyfooter
				].join("\n");

				console.log("║".blue + logo + " @ ".green.bold + "CALL".white.bold + " │".blue + " PING".white.bold + " from @" + parentAuthor + " on Block #" + blockprocesscommnum);
				qc.enqueue(replycomment(wif, parentAuthor, parentPermlink, tippy, permlink, title, content, jsonMetadata, blockprocesscommnum));
			}; //END ping

			//-----  HELP
			if (commandparsed.toLowerCase().indexOf("help") >= 0 || commandparsed.toLowerCase().indexOf("-h") >= 0 ) {
				var helptable;

				fs.exists(__dirname + "/db/stats/" + "helps", function (exists) {
					// if not exist then add user
					if (!exists) {
						newfile = true;
						stattype = "helps";
						updatestat(stattype, 1, newfile);
					} else {
						newfile = null;
						stattype = "helps";
						updatestat(stattype, 1, null);

					}
				});

				console.log("║".blue + logo + " @ ".green.bold + "CALL".white.bold + " │".blue + " HELP".white.bold + " from @" + parentAuthor + " on Block #" + blockprocesscommnum);
				if (parentAuthor == owner) {
					helptable = [
						"| <center><b>@Tippy Help & Commands</b></center>  |",
						"|:----:|",
						"",
						"| Command |  | Usage | Example |",
						"|:-------:|:--:|:---------------:|:-------------------------------:|",
						"| tip | -t | Tip a user | @tippy tip klye 1.337 STEEM |",
						"| powerup | -p | Powerup user | @tippy powerup klye 0.690 STEEM |",
						"| balance | -b | Check Balance | @tippy balance |",
						"| stats | -s | View Statistics | @tippy stats |",
						"| info | -i | More Info | @tippy info |",
						"| ping | -o | Check Status | @tippy ping |",
						"| vote | -v | Upvote post | @tippy vote |",
						"| roll | -d | Roll dice | @tippy roll 20 |",
						"",
						"| <center><b>Admin Commands</b></center>  |",
						"|:----:|",
						"",
						"| <center><b>Call</b></center> | <center><b>Usage</b></center> | <center><b>Example</b></center> |",
						"|:-------:|:--------------------:|:-------------------------------:|",
						"| flag | -f | Flag post | @tippy flag |",
						"| fee | Set Tipping Fee | @tippy fee 1% |",
						"| service stop | Shuts Down The Service | @tippy service stop |",
						"| uptime | Display Uptime Info in Console | @tippy uptime on/off |",
						"| debug | Turns Debug Output On or Off | @tippy debug on/off |",
						"<hr>",
						tippyfooter
					].join("\n");
				} else {
					helptable = [
						"| <center><b>@Tippy Help & Commands</b></center>  |",
						"|:----:|",
						"",
						"| Command |  | Usage | Example |",
						"|:-------:|:--:|:---------------:|:-------------------------------:|",
						"| tip | -t | Tip a user | @tippy tip klye 1.337 STEEM |",
						"| powerup | -p | Powerup user | @tippy powerup klye 0.690 STEEM |",
						"| balance | -b | Check Balance | @tippy balance |",
						"| stats | -s | View Statistics | @tippy stats |",
						"| info | -i | More Info | @tippy info |",
						"| ping | -o | Check Status | @tippy ping |",
						"| vote | -v | Upvote post | @tippy vote |",
						"| roll | -d | Roll dice | @tippy roll 20 |",
						"<hr>",
						tippyfooter
					].join("\n");
				};
				var title = "@Tippy Bot Help:";
				qc.enqueue(replycomment(wif, parentAuthor, parentPermlink, tippy, permlink, title, helptable, jsonMetadata, blockprocesscommnum));

			}; //END help

			//-----  INFO
			if (commandparsed.toLowerCase().indexOf("info") >= 0 || commandparsed.toLowerCase().indexOf("-i") >= 0 ) {
				console.log("║".blue + logo + " @ ".green.bold + "CALL".white.bold + " │".blue + " INFO".white.bold + " from @" + parentAuthor + " on Block #" + blockprocesscommnum);
				fs.exists(__dirname + "/db/stats/" + "infos", function (exists) {
					// if not exist then add user
					if (!exists) {
						newfile = true;
						stattype = "infos";
						updatestat(stattype, 1, newfile);
					} else {
						newfile = null;
						stattype = "infos";
						updatestat(stattype, 1, null);

					}
				});
				var title = "@Tippy Bot Info:";
				var content = [
					"| <center><b>@Tippy Information & Fees</b></center>  |",
					"|:----:|",
					"",
					"<b>This STEEM network text tipping service created by @steemtqa & @klye<br>More information to come!<hr><sub>@Tippy - Steemit Text-to-Tip Service - Tip Without Ever Leaving The Page!<br>" + devmsg + "</sub>",
					"<hr>",
					tippyfooter
				].join("\n");
				qc.enqueue(replycomment(wif, parentAuthor, parentPermlink, tippy, permlink, title, content, jsonMetadata, blockprocesscommnum));
			};

			//-----  STATS
			if (commandparsed.toLowerCase().indexOf("stats") >= 0 || commandparsed.toLowerCase().indexOf("-s") >= 0 ) {

				fs.readFile(__dirname + "/db/stats/" + "infos", function (err, details) {
					if (err) { console.log('Infos File Not Found', null) };
					var infosdata = JSON.parse(details);
					var infos = infosdata.infos;

					fs.readFile(__dirname + "/db/stats/" + "pings", function (err, details) {
						if (err) { console.log('Pings File Not Found', null) };
						var pingsdata = JSON.parse(details);
						var pings = pingsdata.pings;

						fs.readFile(__dirname + "/db/stats/" + "helps", function (err, details) {
							if (err) { console.log('Helps File Not Found', null) };
							var helpsdata = JSON.parse(details);
							var helps = helpsdata.helps;

							fs.readFile(__dirname + "/db/stats/" + "balances", function (err, details) {
								if (err) { console.log('Balances File Not Found', null) };
								var balancesdata = JSON.parse(details);
								var balances = balancesdata.balances;

								fs.readFile(__dirname + "/db/stats/" + "tips", function (err, details) {
									if (err) { console.log('Tips File Not Found', null) };
									var tipsdata = JSON.parse(details);
									var tips = tipsdata.tips;

									fs.readFile(__dirname + "/db/stats/" + "steemtipped", function (err, details) {
										if (err) { console.log('Steemtipped File Not Found', null) };
										var steemtippeddata = JSON.parse(details);
										var steemtipped = steemtippeddata.steemtipped;
										steemtipped = steemtipped.toFixed(3);

										fs.readFile(__dirname + "/db/stats/" + "sbdtipped", function (err, details) {
											if (err) { console.log('Sbdtipped File Not Found', null) };
											var sbdtippeddata = JSON.parse(details);
											var sbdtipped = sbdtippeddata.sbdtipped;
											sbdtipped = sbdtipped.toFixed(3);

											fs.readFile(__dirname + "/db/stats/" + "steemdepo", function (err, details) {
												if (err) { console.log('Steemdepo File Not Found', null) };
												var steemdepodata = JSON.parse(details);
												var steemdepo = steemdepodata.steemdepo;
												steemdepo = steemdepo.toFixed(3);

												fs.readFile(__dirname + "/db/stats/" + "sbddepo", function (err, details) {
													if (err) { console.log('Sbddepo File Not Found', null) };
													var sbddepodata = JSON.parse(details);
													var sbddepo = sbddepodata.sbddepo;
													sbddepo = sbddepo.toFixed(3);

													console.log("║".blue + logo + " @ ".green.bold + "CALL".white.bold + " │".blue + " STATS from @" + parentAuthor + " on Block #" + blockprocesscommnum);
													var title = "@Tippy Bot Stats:";
													var content = [
														"| <center><b>@Tippy Usage Statistics</b></center>  |",
														"|:----:|",
														"",
														"| Tips Statistics |  | Call Statistics |  |",
														"|-----------------|---|------------------|---|",
														"| Tips Sent | " + tips + " | Balances Checked | " + balances + " |",
														"| STEEM Tipped | " + steemtipped + " | Help Replies | " + helps + " |",
														"| SBD Tipped | " + sbdtipped + " | Infos Served | " + infos + " |",
														"| STEEM Deposited | " + steemdepo + " | Pings Recieved |  " + pings + " |",
														"| SBD Deposited | " + sbddepo + " | Stats Shared | not implemented |",
														"<hr>",
														tippyfooter
													].join("\n");
													// Send Stat Call Reply Comment
													replycomment(wif, parentAuthor, parentPermlink, tippy, permlink, title, content, jsonMetadata, blockprocesscommnum);
												});
											});
										});
									});
								});
							});
						});
					});
				});
			};

			//-----  VOTE
			if (commandparsed.toLowerCase().indexOf("vote") >= 0 || commandparsed.toLowerCase().indexOf("-v") >= 0 ) {
				var weight = random(10, 10000);
				console.log("║".blue + logo + " @ ".green.bold + "CALL".white.bold + " │".blue + " VOTE".white.bold + " from @" + parentAuthor + " on Block #" + blockprocesscommnum);
				qv.enqueue(confirmvote(op["parent_author"], op["parent_permlink"], weight, "vote"));
			}; //END vote

			//-----  TIP
			if (commandparsed.toLowerCase().indexOf("tip") >= 0 || commandparsed.toLowerCase().indexOf("-t") >= 0) {
				//Get & Set Variables From Tip Call
				var reciever = op["body"];
				var newzero = parseFloat(0.000);
				var gifted = commandparsed.split(' ', 4)[1];
				var cleaned = gifted.replace(/\@/g, '').toLowerCase();
				to = cleaned
				var chaching = parseFloat(commandparsed.split(' ', 4)[2]);
				var amount = chaching;
				var currency = commandparsed.split(' ', 4)[3];
				// var currency = commandparsed.substring(commandparsed.lastIndexOf(" ") + 1);
				var tipcurrency = currency.toUpperCase();
				//Display the Tip Call in console
				console.log("║".blue + logo + " @ ".green.bold + "CALL".white.bold + " │".blue + " TIP".white.bold + " @" + parentAuthor.white.bold + " to @" + cleaned.white.bold + " of " + amount + " " + tipcurrency + " on Block #" + blockprocesscommnum);
				//Check if user trying to tip has a balance
				fs.exists(__dirname + "/db/balances/" + parentAuthor, function (exists) {
					// if not exist then add user
					if (!exists) {
						// Create new info for new user balances file
						create_user(parentAuthor);
					} else {
						// If user balance file does exist grab the information from their balances file
						fs.readFile(__dirname + "/db/balances/" + parentAuthor, function (err, details) {
							if (err) return cb('Can\'t find user', null);
							info = JSON.parse(details);
							// Read & Store Current STEEM/SBD Balances
							var steembalance = info.steem;
							var sbdbalance = info.sbd;

							// Check if Tip Currency is STEEM
							if (tipcurrency == "STEEM") {
								// Check if Sending User has Enough STEEM in Balance
								if (amount <= steembalance) {
									// Calculate Fees and Balance Amount After Tip
									var amountafterfee = parseFloat((amount * tipfee) + 0.000).toFixed(3);
									var fee = parseFloat(amount - amountafterfee + 0.000).toFixed(3);
									var steembalanceafter = parseFloat(steembalance - amountafterfee).toFixed(3);
									var steembalanceafter = Number(steembalanceafter - fee);
									var feepercent = parseFloat((1 - tipfee) * 100).toFixed(2);
									var steemtipmessage;
									//    if (fee > 0) {
									//if a memo is found add it to tip message
									if (maybmemo != undefined && maybmemo.length >= 2) {
										steemtipmessage = maybmemo;
									}; //END maybememo has content
									if (maybmemo.length <= 2) {
										steemtipmessage = "Tip from @" + parentAuthor + " via @Tippy Text-to-Tip Service 🤖 " + feepercent + "% Fee: " + fee + " " + tipcurrency;
									};
									//  };//END if fee > 0
									if (fee < 0) {
										//if a memo is found add it to tip message
										if (maybmemo != undefined && maybmemo.length >= 2) {
											steemtipmessage = maybmemo;
										}; //END maybememo has content
										if (maybmemo.length <= 2) {
											steemtipmessage = "Tip from @" + parentAuthor + " via @Tippy Text-to-Tip Service 🤖";
										};
									}; //END if fee > 0

									// Send the STEEM Tip to Target User by Broadcasting Transfer
									qt.enqueue(transfertip(bank, tippy, to, parentAuthor, amountafterfee + " " + tipcurrency, tipcurrency, steemtipmessage, blockprocesscommnum, steembalanceafter));
									votetype = "STEEM Tip";
									qv.enqueue(confirmvote(parentAuthor, permlink, 10, votetype));
									// If This Tip Was Large Enough To Collect Service Fee
									if (fee > 0) {
										var steemfeemessage = "@Tippy Fee: " + feepercent + "% 🤖 " + fee + " " + tipcurrency + " 🤖 Paid by @" + parentAuthor;
										qt.enqueue(transfertip(bank, tippy, owner, fee + " " + tipcurrency, steemfeemessage));
									} //END if fee > 0
								} else {
									var title = "@Tippy Tip Error:";
									var content = "<b>@tippy - Tip Error - </b>Steemit Tip Bot<hr><h3>@tippy Error!</h3>Not enought STEEM in your account!<br>Send STEEM or SBD to @tippy to top up account!<br><hr>" + tippyfooter + devmsg;
									qc.enqueue(replycomment(wif, parentAuthor, parentPermlink, tippy, permlink, title, content, jsonMetadata, blockprocesscommnum));
								}; //END else
							}; //END  if (tipcurrency == "STEEM")

							if (tipcurrency == "SBD") {
								// Check if Sending User has Enough STEEM in Balance
								if (amount <= sbdbalance) {
									// Calculate Fees and Balance Amount After Tip
									var amountafterfee = parseFloat((amount * tipfee) + 0.000).toFixed(3);
									var fee = parseFloat(amount - amountafterfee + 0.000).toFixed(3);
									var sbdbalanceafter = parseFloat(sbdbalance - amountafterfee).toFixed(3);
									var sbdbalanceafter = Number(sbdbalanceafter - fee);
									var feepercent = parseFloat((1 - tipfee) * 100).toFixed(2);
									var steemtipmessage;
									console.log(fee);
									//  if (fee > 0) {
									//if a memo is found add it to tip message
									if (maybmemo != undefined && maybmemo.length >= 2) {
										steemtipmessage = maybmemo;
									}; //END maybememo has content
									if (maybmemo.length <= 2) {
										steemtipmessage = "Tip from @" + parentAuthor + " via @Tippy Text-to-Tip Service 🤖 " + feepercent + "% Fee: " + fee + " " + tipcurrency;
									};
									//      };//END if fee > 0
									if (fee < 0) {
										//if a memo is found add it to tip message
										if (maybmemo != undefined && maybmemo.length >= 2) {
											steemtipmessage = maybmemo;
										}; //END maybememo has content
										if (maybmemo.length <= 2) {
											steemtipmessage = "Tip from @" + parentAuthor + " via @Tippy Text-to-Tip Service 🤖";
										};
									}; //END if fee > 0
									// Send the STEEM Tip to Target User by Broadcasting Transfer
									qt.enqueue(transfertip(bank, tippy, to, parentAuthor, amountafterfee + " " + tipcurrency, tipcurrency, steemtipmessage, blockprocesscommnum, sbdbalanceafter));
									votetype = "STEEM Tip";
									qv.enqueue(confirmvote(parentAuthor, permlink, 10, votetype));
									// If Tip collected a fee
									if (fee > 0) {
										var steemfeemessage = "🤖 @Tippy Fee: " + feepercent + "% - " + fee + " " + tipcurrency + " - Paid by @" + parentAuthor;
										qt.enqueue(transfertip(bank, tippy, owner, fee + " " + tipcurrency, steemfeemessage));
									} //END if fee > 0
								} else {
									var title = "@Tippy Tip Error:";
									var content = "<b>@tippy - Tip Error - </b>Steemit Tip Bot<hr><h3>@tippy Error!</h3>Not enought SBD in your account!<br>Send STEEM or SBD to @tippy to top up account!<hr>" + tippyfooter + devmsg;
									qc.enqueue(replycomment(wif, parentAuthor, parentPermlink, tippy, permlink, title, content, jsonMetadata, blockprocesscommnum));
								}; //END else
							}; //END  if (tipcurrency == "SBD")
						});

					}
				});
				//	 ();
			};

			//-----  BALANCE
			if (commandparsed.toLowerCase().indexOf("balance") >= 0 || commandparsed.toLowerCase().indexOf("-b") >= 0 ) {
				console.log("║".blue + logo + " @ ".green.bold + "CALL".white.bold + " │".blue + " BALANCE".white.bold.underline + " @" + parentAuthor + " on Block #" + blockprocesscommnum);
				// check if balances stat file exists
				fs.exists(__dirname + "/db/stats/" + "balances", function (exists) {
					// if balances stat file does not exist create one
					if (!exists) {
						newfile = true;
						stattype = "balances";
						updatestat(stattype, 1, newfile);
					};
				});
				// check if user has existing balance
				fs.exists(__dirname + "/db/balances/" + parentAuthor, function (exists) {
					// if not exist then create a user balance file
					if (!exists) {
						create_user(parentAuthor);
					} else {

						fs.readFile(__dirname + "/db/balances/" + parentAuthor, function (err, details) {
							if (err) {
								console.log("ERROR on Balance Call!" + err);
								if (debugmode == true) {
									console.log("║".blue + logo + "~~~DBUG ".magenta.dim + err);
								};
							};
							if (details) {
								info = JSON.parse(details);
								var steembalance = info.steem;
								var sbdbalance = info.sbd;
								var steembalance = steembalance.toFixed(3);
								var sbdbalance = sbdbalance.toFixed(3);
								var balancetable = [
									"| <center><b>@" + parentAuthor + "'s Account Balance:</b></center> |",
									"|:----:|",
									"| <center> " + steembalance + " STEEM  </center> |",
									"| <center> $" + sbdbalance + " SBD  </center> |",
									"<hr>",
									tippyfooter
								].join("\n");
								var title = "@Tippy Bot Balance:";
								//reply comment
								qc.enqueue(replycomment(wif, parentAuthor, parentPermlink, tippy, permlink, title, balancetable, jsonMetadata, blockprocesscommnum));
								console.log("║".blue + " $ ".green.bold + "BANK".green.bold + " │".blue + ' ' + steembalance + " STEEM - $" + sbdbalance + " SBD");
							}; //END if(details)
						}); //END readfile balance/user

					} //END else
				}); //END fs.exists
			}; //END BALANCE

			//-----  ROLL
			if (commandparsed.toLowerCase().indexOf("roll") >= 0 || commandparsed.toLowerCase().indexOf("-d") >= 0 ) {
				var weight = 10000;
				var roll = commandparsed.split(' ', 4)[1];
				var rollsize = commandparsed.split(' ', 4)[1];
				if (isNaN(roll)){
					roll = Math.floor((Math.random() * 100) + 1);
					rollsize = 100;
				} else {
					roll = Math.floor((Math.random() * Number(roll)) + 1);
				}
				if (roll <= 0){
					var rollreply = [
						"| <center><b>Random Roll:</b></center> |",
						"|:----:|",
						"| <center>You Must Pick a Positive Number!</b><br><sub>( roll was not completed )</sub></center> |",
						"<hr>",
						tippyfooter
					].join("\n");
					var title = "@Tippy Random Roll:";
					//reply comment
					qc.enqueue(replycomment(wif, parentAuthor, parentPermlink, tippy, permlink, title, rollreply, jsonMetadata, blockprocesscommnum));
				}
				console.log("║".blue + logo + " @ ".green.bold + "CALL".white.bold + " │".blue + " ROLL".white.bold + " from @" + parentAuthor + " on Block #" + blockprocesscommnum);
				var rollreply = [
					"| <center><b>Random Roll:</b></center> |",
					"|:----:|",
					"| <center>@" + parentAuthor + " rolled <h3><b>" + roll + "</b></h3><br><sub>( roll was between 1 - " + rollsize + " )</sub></center> |",
					"<hr>",
					tippyfooter
				].join("\n");
				var title = "@Tippy Random Roll:";
				//reply comment
				qc.enqueue(replycomment(wif, parentAuthor, parentPermlink, tippy, permlink, title, rollreply, jsonMetadata, blockprocesscommnum));
			}; //END roll

		} //END if (commentstring.toLowerCase().indexOf("@tippy") >= 0)
	}; // END if (@tippy in commentstring)
}; // END process_comment()

//----- This process_transfer function checks transfer operations for deposits
var process_transfer = function (op, lastblocknum) {
	if (debugmode == true) {
		console.log("║".blue + logo + " ~ DBUG".magenta.dim + " │ ".blue + "function ".magenta.dim + "process_transfer".blue.bold + "(".white.dim + lastblocknum + ")".white.dim);
	};
	if (op["to"] == tippy) {

		var depositer = op["from"];
		var firstdepo = op["amount"];
		var currency = op["amount"];
		var depositmemo = op["memo"];

		var chaching = parseFloat(currency);
		var type = currency.substring(currency.lastIndexOf(" ") + 1);
		if (depositmemo == undefined) {
			console.log("║".blue + " $ ".green.bold + "BANK".green.bold + " │ ".blue + chaching + " " + type + " Deposit from @" + depositer + " at Block #" + lastblocknum);
		} else {
			console.log("║".blue + " $ ".green.bold + "BANK".green.bold + " │ ".blue + "Confirmed " + chaching + " " + type + " Deposit from @" + depositer + " at Block #" + lastblocknum);
		};
		// If users first deposit create file
		fs.exists(__dirname + "/db/balances/" + depositer, function (exists) {
			// if not exist then add user
			if (!exists) {
				if (type == "STEEM") {
					var info = {
						user: depositer,
						steem: chaching,
						sbd: 0.000
					};
				};
				if (type == "SBD") {
					var info = {
						user: depositer,
						steem: 0.000,
						sbd: chaching
					};
				};
				console.log("║".blue + " + ".green.bold + "USER".green.bold + " │".blue + ' Creating Account @' + depositer + ' with ' + firstdepo);
				fs.writeFile(__dirname + "/db/balances/" + depositer, JSON.stringify(info), function (err, d) {
					if (err) return console.log('Save error', null);
				});
			} else {
				console.log("║".blue + " $ ".green.bold + "BANK".green.bold + " │".blue + ' Adding +' + firstdepo + ' to @' + depositer + "'s Balance");
				fs.readFile(__dirname + "/db/balances/" + depositer, function (err, details) {
					if (err) return cb('Can\'t find user', null);
					info = JSON.parse(details);
					var steembalance = info.steem;
					var sbdbalance = info.sbd;

					if (type == "STEEM") {

						var newsteembalance = Number(Math.round10((steembalance + chaching), -3));
						var newsteembalance = Number(parseFloat(newsteembalance).toFixed(3));

						var info = {
							user: depositer,
							steem: newsteembalance,
							sbd: sbdbalance
						};
					};
					if (type == "SBD") {
						var newsbdbalance = Number(Math.round10((sbdbalance + chaching), -3));
						var newsbdbalance = Number(parseFloat(newsbdbalance).toFixed(3));
						var info = {
							user: depositer,
							steem: steembalance,
							sbd: newsbdbalance
						};
					};
					fs.writeFile(__dirname + "/db/balances/" + depositer, JSON.stringify(info), function (err, d) {
						if (err) {
							console.log('ERROR: Failed to Save Balance', null);
						};
						console.log("║".blue + " $ ".green.bold + "BANK".green.bold + " │".blue + " @" + depositer.white.bold + "'s Account Balance Updated!");
						saveblockdataheight(lastblocknum);
						if (type == "SBD") {
							var newsbd = Number(parseFloat(chaching).toFixed(3));
							fs.exists(__dirname + "/db/stats/" + "sbddepo", function (exists) {
								// if not exist then add user
								if (!exists) {
									newfile = true;
									stattype = "sbddepo";
									updatestat(stattype, newsbd, newfile);
								} else {
									newfile = null;
									stattype = "sbddepo";
									updatestat(stattype, newsbd, null);
								}
							});
						} //END type == sbd stat update

						if (type == "STEEM") {
							var newsteem = Number(parseFloat(chaching).toFixed(3));
							fs.exists(__dirname + "/db/stats/" + "steemdepo", function (exists) {
								// if not exist then add user
								if (!exists) {
									newfile = true;
									stattype = "steemdepo";
									updatestat(stattype, newsteem, newfile);
								} else {
									newfile = null;
									stattype = "steemdepo";
									updatestat(stattype, newsteem, null);
								}
							});
						} //END type == sbd stat update
					});
				});

			}
		});
	}
};

//----- This process_block function parses incoming block for commments and transfers
var process_block = function (block, blocknum) {
	if (debugmode == true) {
		console.log("║".blue + logo + " ~ DBUG".magenta.dim + " │ ".blue + "function ".magenta.dim + "process_block".blue.bold + "(".white.dim + blocknum + ")".white.dim);
	}; //END debugmode == true
	block.transactions.forEach((transaction) => {
		transaction.operations.forEach((op) => {
			var opType = op[0];
			var opgrab = op[1];
			if (opType == "transfer") {
				//  console.log("TRANSFER!");
				process_transfer(opgrab, blocknum);
			}
			if (opType == "comment") {
				//console.log("COMMENT");
				process_comment(opgrab, blocknum);
			}

		});
	});

}; // END function process_block();

//---- This current() function checks our current block height vs network height
function current() {
	if (debugmode == true) {
		console.log("║".blue + logo + " ~ DBUG".magenta.dim + " │ ".blue + "function ".magenta.dim + "current".blue.bold + "(".white.dim + ")".white.dim);
	};
	steem.api.getDynamicGlobalProperties(function (err, props) {
		if (err) {
			console.log("ERROR: Failed to Get Current Block!")
		};
		if (props) {
			current_block = props["last_irreversible_block_num"];
			console.log("║".blue + logo + " * ".random + "PULL".yellow + " │ ".blue + "Latest Block Height = #" + current_block + " Recheck Sync State..".white.bold);
			if (current_block == last_block) {
				// Update profile to show online
				console.log("║".blue + logo + " * ".random + "SYNC".green.dim + " │ ".blue + "Synced to Current Block Height!".bold.white + " Begin to Initialize.. ".white.bold);
				console.log("║".blue + logo + " * ".random + "INIT".green.bold + " │ ".blue + "@".green.dim + tippy.green.bold + " Service Initializing..." + " Developed by:".white + " @KLYE".green.bold);
				synced = 1;
				startsplash();
			};
			if (current_block > last_block) {
				blockdataread = true;
				catchup_block();
			};
		}; // END if(props)
	}); // END teem.api.getDynamicGlobalProperties
}; // END function current();

//----- Block Catchup Via process_block  var process_block = function(block, blockid) {
function catchup_block() {
	if (debugmode == true) {
		console.log("║".blue + logo + " ~ DBUG".magenta.dim + " │ ".blue + "function ".magenta.dim + "catchup_block".blue.bold + "(".white.dim + ")".white.dim);
	};
  blockdataread = false;
	if (blockdataread == false) {
		console.log("║".blue + logo + " O".yellow.bold + " DISK".yellow.bold + " │".blue + " Loading Blockdata File...");
		fs.readFile(__dirname + "/db/stats/blockdata", function (err, data) {
			if (err) {
				console.log("ERROR: Unable to Read Block Data File!");
			};
			if (data) {
				var bd = JSON.parse(data);
				last_block = bd.last_block;
				blockdataread = true;
				console.log("║".blue + logo + " O".green.bold + " DISK".green.bold + " │".blue + " Successfully Parsed Blockdata file! ");
			};
		});
	};
	while ((current_block - last_block) > 0) {
		last_block = (last_block + 1);
		steem.api.getBlock(last_block, function (getNextBlockerr, getNextBlock) {
			sleep(25);
			if (getNextBlockerr) console.log("ERROR: Failed to Grab Block");
			if (getNextBlock) {
				var blocksleftsync = (current_block - last_block);
				console.log("║".blue + logo + " * ".random + "SYNC".grey.dim + " │".blue + " Get Block #".white + last_block + " /".grey.dim + " #" + current_block + " - ".grey.dim + blocksleftsync + " Left to Sync");
				/*if (blocksleftsync > 1000){
					console.log("Skip maybe?");
				}*/
				if (debugmode == true) {
					console.log("║".blue + logo + " ~ DBUG".magenta.dim + " │ ".blue + "getBlock".blue.bold + "(".white.dim + last_block + ")".white.dim + " is Successful!");
				};
				process_block(getNextBlock, last_block);
				last_block++;
				if (current_block <= last_block) {
					saveblockdataheight(last_block);
					current();
				};
			};
		});

	};
}; // END function catchup_block()

//----- Begin live network streaming
function startstream() {
	if (debugmode == true) {
		console.log("║".blue + logo + " ~ DBUG".magenta.dim + " │ ".blue + time + "function ".magenta.dim + "startstream".blue.bold + "(".white.dim + ")".white.dim);
	};
	var safestreamcount = 0;
	if (setup == false) {
	//	if (synced == 1) {
			if (uptimeinfo == true) {
				console.log("Blocks Monitored this Session for @tippy mentions = " + totalblocks);
				console.log("Comments Monitored For @tippy Commands = " + totalcomment);
				if (timeonline <= 60) {
					console.log("║".blue + logo + " * ".random + "TIME".grey + " │ ".blue + "Tippy Service has Been Online for " + timeonline + " Seconds");
				};
				if (timeonline > 60) {
					var minsonline = timeonline / 60;
					console.log("║".blue + logo + " * ".random + "TIME".grey + " │ ".blue + "Tippy Service has Been Online for " + minsonline + " Minutes");
				};
			}; // END if (uptimeinfo == true)

			//----- Get last_irreversible_block in stream
			function safestream() {
				if (debugmode == true) {
					console.log("║".blue + logo + " ~ DBUG".magenta.dim + " │ ".blue + "function ".magenta.dim + "safestream".blue.bold + "(".white.dim + last_block + ")".white.dim);
				};
				steem.api.streamBlockNumber('irreversible', function (err1, newestsafeblock) {
					if (err1) {
						console.log("ERROR")
					};
					if (newestsafeblock) {
					 if (showtime == true){
						 var tnsecs = new Date().getUTCSeconds();
						 if (tnsecs == 1){
							 tnsecs = String("0" + tnsecs);
						 }
						 if (tnsecs < 10 && tnsecs > 1){
							 tnsecs = String( "0" + tnsecs);
						 }
						 if (tnsecs == 10){
							 tnsecs = 10;
						 }
						 var tnmins = new Date().getUTCMinutes();
						 if (tnmins <= 10){
							 tnmins = String("0" + tnmins);
						 }
						 if (tnmins == 10){
							 tnmins = 10;
						 }
						 var tnhours = new Date().getUTCHours();
						  time = tnhours + ":" + tnmins + ":" + tnsecs + " │ ".blue;
					};//END  if (showtime == true)
						totalblocks++;
						safestreamcount++;
						safestreamblock = newestsafeblock

						// "STEEM".blue.bold.inverse +
						console.log("║".blue + logo + " * ".random + "SCAN".grey + " │ ".blue + time + "Get ".white + "Block ".white + "#".grey.dim + newestsafeblock + " - ".grey.dim + "#" + safestreamcount + " - ".grey.dim + "Type: " + "irreversible".green.dim);
						// Save our Block height to disk
						if (safestreamcount % autosaveblock == 0) {
							saveblockdataheight(newestsafeblock);
						};

					};
				});

				steem.api.streamOperations('irreversible', function (err2, safeblockops) {
					if (err2) {
						console.log("ERROR")
					};
					if (safeblockops) {
						// get 1st item in blockops an apply to operationType variable to check type later
						var opType = safeblockops[0];
						// get 2nd item in blockops and store it later to be parsed if it's our specified type of operation
						var op = safeblockops[1];
						//check if current operation is a comment
						if (opType == "transfer") {
							process_transfer(op, safestreamblock);
						}
					};
				}); //END streamOperations irreversible!!!
			}; // END function safestream()

			//----- Get header_block in stream
			function headstream() {
				if (debugmode == true) {
					console.log("║".blue + logo + " ~ DBUG".magenta.dim + " │ ".blue + "function ".magenta.dim + "headstream".blue.bold + "()".white.dim);
				};
				var headblockcount = 0;
				steem.api.streamBlockNumber(function (err1, newestheadblock) {
					if (err1) {
						console.log("ERROR")
					};
					if (newestheadblock) {
						if (showtime == true){
							var tnsecs = new Date().getUTCSeconds();
						  if (tnsecs == 1){
						 	 tnsecs = String("0" + tnsecs);
						  }
						  if (tnsecs < 10 && tnsecs > 1){
						 	 tnsecs = String( "0" + tnsecs);
						  }
							if (tnsecs == 10){
								tnsecs = 10;
							}
						  var tnmins = new Date().getUTCMinutes();
						  if (tnmins <= 10){
						 	 tnmins = String("0" + tnmins);
						  }
							if (tnmins == 10){
								tnmins = 10;
							}
						  var tnhours = new Date().getUTCHours();
						   time = tnhours + ":" + tnmins + ":" + tnsecs + " │ ".blue;
					};//END if (showtime != false)
						totalblocks++;
						headstreamblock = newestheadblock;
						headblockcount++;
						console.log("║".blue + logo + " * ".random + "SCAN".grey + " │ ".blue + time + "Get ".white + "Block ".white + "#".grey.dim + newestheadblock + " -".grey.dim + " #" + headblockcount + " -".grey.dim + " Type:" + " head_block".yellow.dim);
					};
				});

				steem.api.streamOperations(function (err2, headblockops) {
					if (err2) {
						console.log("ERROR")
					};
					if (headblockops) {
						// get 1st item in blockops an apply to operationType variable to check type later
						var opType = headblockops[0];
						// get 2nd item in blockops and store it later to be parsed if it's our specified type of operation
						var op = headblockops[1];
						//check if current operation is a comment
						if (opType == "comment") {
							process_comment(op, headstreamblock);
						};
						if (opType == "transfer") {
							if (op["to"] == tippy) {
								console.log("║".blue + " $ ".green.bold + "BANK".green.bold + " │".blue + " Incoming " + op["amount"] + " from @" + op["from"] + " on Block #" + headstreamblock);
							};
						};
					};

				})._maxListeners = 0; // END streamOperations irreversible!!!
				safestream();
			}; // END funvtion headstream
			headstream();
	}; //END function startstream();

}; //END   if (setup == false);

// Live BLock Sreaming start up page
function startsplash() {
	if (debugmode == true) {
		console.log("║".blue + logo + " ~ DBUG".magenta.dim + " │ ".blue + "function ".magenta.dim + "startsplash".blue.bold + "(".white.dim + ")".white.dim);
	};
 if (synced == 1) {
		// Show the start page
		if (logo == true && showtime == true) {
			console.log("╠".blue + "══════════════╧═══════════════════════════════════════════════════".bold.blue + "╗".blue);
			console.log("║".blue + "** ".blue.bold + "SUCCESS:".green.bold + " Blockchain Syncing Completed: Starting Service Now" + "  **".blue.bold + "║".blue);
			console.log("╟".blue + "╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌".bold.blue + "╢".blue);
			console.log("║".blue + "    ACTION      TIME(UTC)      BLOCK #        COUNT# TYPE OF BLOCK       ".white.bold.underline + "║".blue);
			console.log("╠".blue + "══════════════╤══════════╤════════════════════════════════════════".bold.blue + "╝".blue);
		};
		if (logo == false && showtime == true) {
			console.log("╠".blue + "════════╧═════════════════════════════════════════════════════════".bold.blue + "╗".blue);
			console.log("║".blue + "** ".blue.bold + "SUCCESS:".green.bold + " Blockchain Syncing Completed: Starting Service Now" + "  **".blue.bold + "║".blue);
			console.log("╟".blue + "╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌╼╌".bold.blue + "╢".blue);
			console.log("║".blue + " ACTION   TIME(UTC)      BLOCK #       #    TYPE OF BLOCK                ".white.bold.underline + "║".blue);
			console.log("╠".blue + "════════╤══════════╤══════════════════════════════════════════════".bold.blue + "╝".blue);
		};
		//start the block stream scanners
		startstream();
 	} else {
 		console.log("something went wrong. Please Restart!");
 	}
};

//----- Number rounding because javascript is a whore with numbers
(function () {
	/**
	 * Decimal adjustment of a number.
	 *
	 * @param {String}  type  The type of adjustment.
	 * @param {Number}  value The number.
	 * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
	 * @returns {Number} The adjusted value.
	 */
	function decimalAdjust(type, value, exp) {
		// If the exp is undefined or zero...
		if (typeof exp === 'undefined' || +exp === 0) {
			return Math[type](value);
		}
		value = +value;
		exp = +exp;
		// If the value is not a number or the exp is not an integer...
		if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
			return NaN;
		}
		// If the value is negative...
		if (value < 0) {
			return -decimalAdjust(type, -value, exp);
		}
		// Shift
		value = value.toString().split('e');
		value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
		// Shift back
		value = value.toString().split('e');
		return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
	}

	// Decimal round
	if (!Math.round10) {
		Math.round10 = function (value, exp) {
			return decimalAdjust('round', value, exp);
		};
	}
	// Decimal floor
	if (!Math.floor10) {
		Math.floor10 = function (value, exp) {
			return decimalAdjust('floor', value, exp);
		};
	}
	// Decimal ceil
	if (!Math.ceil10) {
		Math.ceil10 = function (value, exp) {
			return decimalAdjust('ceil', value, exp);
		};
	}
})();

//----- SLEEP Function to unfuck some nodeJS things - NO modify
function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds) {
			break;
		}
	}
};

//----- Get Command in string
function getcommand(str) {
	return str.split(/\s+/).slice(1).join(" ");
};

//----- Ctrl+c in console save blockchain state and exit
process.on('SIGINT', function () {
	console.log("║".blue + logo + " X STOP".red.bold + " │ ".blue + "SIGINT Call via Console is Shutting Down Tipping Engine!");
	protype = "offline";
	// save last scanned irreversible block
	saveblockdataheight(safestreamblock);
	// update profile to offline mode and shut down
	profileupdate(protype);
});

process.on('uncaughtException', function (err) {
	console.log("║".blue + logo + " ERROR".red.bold + " │ ".blue + "Service Encountered an Uncaught Exeption.. Exiting Now!");
	sleep(1000);
  console.log(err);
})
