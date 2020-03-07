async function main() {

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const fs = require('fs');

// Creates a client
const client = new speech.SpeechClient();
//cloud storage
const {Storage} = require('@google-cloud/storage');


/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */

// const filename = 'Local path to audio file, e.g. /path/to/audio.raw';
//const filename = 'audio000.mp3';
//const filename ='gs://video-text-files/sample.mp3';
const gcsUri = 'gs://video-text-files/sample.mp3';
// const encoding = 'Encoding of the audio file, e.g. LINEAR16';
const encoding ='mp3';
// const sampleRateHertz = 16000;
const sampleRateHertz = 16000;
const enableWordTimeOffsets = true;
// const languageCode = 'BCP-47 language code, e.g. en-US';
 const languageCode = 'en-US';
const config = {
  encoding: encoding,
  sampleRateHertz: sampleRateHertz,
  languageCode: languageCode,
  enableWordTimeOffsets: enableWordTimeOffsets,
};
const audio = {
	uri: gcsUri,
};

const request = {
  config: config,
  audio: audio,
};

// Detects speech in the audio file. This creates a recognition job that you
// can wait for now, or get its result later.
const [operation] = await client.longRunningRecognize(request);

// Get a Promise representation of the final result of the job
const [response] = await operation.promise();
const transcription = response.results
  .map(result => result.alternatives[0].transcript)
  .join('\n');
 // console.log(`results:` + JSON.stringify(response.results));
 //console.log(`Transcription: ${transcription}`);
  createVTT(response.results);
}
main().catch(console.error);



function createVTT(results){
  let VTT = "";
  let counter = 0;
  let phraseCounter = 0;
  let startTime = "00:00:00";
  let endTime = "00:00:00";
  let phrase = "";
  let phraseLength =10;



//testing
//  console.log("first: "+JSON.stringify(results));
//console.log("first: "+JSON.stringify(results[0].alternatives[0])+"\n");
//console.log("first Time: "+JSON.stringify(results[0].alternatives[0].words[0].startTime.seconds)+"\n");
//let words = JSON.stringify(results[0].alternatives[0].words);
//console.log("words" +words.startTime.seconds + results[0].alternatives[0].words.length);
//console.log("transcript: +" +JSON.stringify(results[0].alternatives[0].transcript));

console.log("WEBVTT\n");
  //for each tracnscript
  for(var i=0; i<results.length;i++){
	//write full transcript
	//console.log("transcript:  " + JSON.stringify(results[i].alternatives[0].transcript));
	//loop through each word in each transcript
	for(var j=0;  j< results[i].alternatives[0].words.length; j++){
		
		//write start, end time
		//remove the quotes
		//the .low does not appear until you drill down and was causing crazy errors.
		//when I save the JSON and run it - the JSON does not save that deeply
		let start 	= (JSON.stringify(results[i].alternatives[0].words[j].startTime.seconds.low));
		//start = start.slice(1, start.length - 1)
		let end 	= (JSON.stringify(results[i].alternatives[0].words[j].endTime.seconds.low));
		//end = end.slice(1, end.length - 1)
		let word 	= (JSON.stringify(results[i].alternatives[0].words[j].word));
		word = word.slice(1, word.length - 1)
		
		if (counter % phraseLength == 1){
			//first entry in the phrase
			//console.log(start);
			
			startTime = secondsToFormat(start);
			//console.log((JSON.stringify(results[i].alternatives[0].words[j].startTime.seconds.low)));
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
			console.log(phrase+"\n");
			
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
	
	let formattedTime = timeHours+":"+timeMinutes+":"+timeSeconds+".000";
	return formattedTime;
}

