'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('result.json');
let results = JSON.parse(rawdata);
//console.log(results);
createVTT(results);
function createVTT(results){
  let VTT = "";
  let counter = 0;
  let phraseCounter = 0;
  let startTime = "00:00:00";
  let endTime = "00:00:00";
  let phrase = "";
  let phraseLength =10;
console.log("first: "+JSON.stringify(results[0].alternatives[0])+"\n");
let words = JSON.stringify(results[0].alternatives[0].words[0].startTime.seconds);
console.log("words" + words + results[0].alternatives[0].words.length);
 


  //console.log("transcript: +" +JSON.stringify(results[0].alternatives[0].transcript));


  //for each tracnscript
  for(var i=0; i<results.length;i++){
	//write full transcript
	//console.log("transcript:  " + JSON.stringify(results[i].alternatives[0].transcript));
	//loop through each word in each transcript
	for(var j=0; j< results[i].alternatives[0].words.length; j++){
		
		//write start, end time
		//remove the quotes
		let start = (JSON.stringify(results[i].alternatives[0].words[j].startTime.seconds));
		start = start.slice(1, start.length - 1)
		let end = (JSON.stringify(results[i].alternatives[0].words[j].endTime.seconds));
		end = end.slice(1, end.length - 1)
		let word = JSON.stringify(results[i].alternatives[0].words[j].word);
		word = word.slice(1, word.length - 1)
		
		if (counter % phraseLength == 1){
			//first entry in the phrase
			startTime = secondsToFormat(start);
			phrase = word;
			//console.log(counter + phrase);
		}
		if (counter % phraseLength > 1){
			//addint a word
			phrase  = phrase.concat(" "+ word);
			//console.log(counter + phrase);
		}
		if (counter % phraseLength == 0){
			//end of entry
			phrase  = phrase.concat(" ", word);
			endTime = secondsToFormat(end);
			console.log(counter / phraseLength);
			console.log(startTime + " --> " +endTime);
			console.log(phrase);
			
		}
		
		//console.log(startFormat);
		//console.log("start:" + start + " end: " + end + " word " +word );
		// write word	
		//console.log(counter);
		//console.log(startTime + " --> " +endTime);
		//console.log(word);
		//console.log("\n");
		counter++;
	}	
  }
}

function secondsToFormat(seconds){
	let timeHours = Math.floor(seconds/3600).toString().padStart(2,'0');
	let timeMinutes = Math.floor(seconds/60).toString().padStart(2,'0');
	let timeSeconds = (seconds % 60).toString().padStart(2,'0');
	
	let formattedTime = timeHours+":"+timeMinutes+":"+timeSeconds;
	return formattedTime;
}