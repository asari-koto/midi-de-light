navigator.requestMIDIAccess().then(onMIDISuccess,onMIDIFailure);

var midiKey = [];

function onMIDISuccess(midi){
//	midi = m;
//	var it = midi.inputs.values();
//	for(var o = it.next(); !o.done; o = it.next()){
//		inputs.push(o.value);
//	}
//
//	for(var cnt=0;cnt < inputs.length;cnt++){
//		inputs[cnt].onmidimessage = onMIDIEvent;
//	}

	midi.inputs.values().next().value.onmidimessage = onMIDIEvent;
}

function onMIDIFailure(msg){
	alert(msg);
}

function onMIDIEvent(e){
	if (e.data[0] != 254)
		console.log(e.data);
		
	if(e.data[2] != undefined && (e.data[0] == 144 || e.data[0] == 128)){

		var keyCode = e.data[1];
		var velocity = e.data[2];

		midiKey[keyCode] = velocity;
	}
}
