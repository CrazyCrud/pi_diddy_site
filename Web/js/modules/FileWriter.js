var FileWriter = (function(){
	var _fileEntry = null,
		_fileWriter = null,
	init = function(){
		navigator.webkitPersistentStorage.requestQuota(10240 * 10240, function() {
			window.webkitRequestFileSystem(window.PERSISTENT , 10240 * 10240, onInitFileSystem, onError);
		});
	},
	onInitFileSystem = function(localStorage){
		var date = new Date();
		var fileName = date.getDate() + "_" + date.getMonth();
		localStorage.root.getFile(fileName + '.txt', {create: true, exclusive: false}, function(fileEntry){
			_fileEntry = fileEntry;
			_fileEntry.createWriter(function(fileWriter){
				_fileWriter = fileWriter;
				var blob = new Blob(['time,trackindId,distance,qr\n'], {type: 'text/plain'});
				_fileWriter.write(blob);
				_fileWriter.onwriteend = function(e){
					console.log("Write completed");
				};
				_fileWriter.onerror = function(e){
					console.log("Write failed: " + e.toString());
				};
			});
		}, onError);
	},
	write = function(data){
		if(_.isNull(_fileWriter) || _.isNull(data)){
			return;
		}else{
			data.trackingId = 0 || data.trackingId;
			data.distance = 0 || data.distance;
			data.qr = 0 || data.qr;
			var date = new Date(),
				timeStamp = date.getDate() + "-" + date.getSeconds(),
				row = timeStamp + "," + data.trackingId + "," + data.distance + "," + data.qr,
				blob = new Blob([row + '\n'], {type: 'text/plain'});
			_fileWriter.seek(_fileWriter.length);
			_fileWriter.write(blob);
		}
	},
	onError = function(e){
		var msg = '';
		switch (e.code) {
			case FileError.QUOTA_EXCEEDED_ERR:
			  msg = 'QUOTA_EXCEEDED_ERR';
			  break;
			case FileError.NOT_FOUND_ERR:
			  msg = 'NOT_FOUND_ERR';
			  break;
			case FileError.SECURITY_ERR:
			  msg = 'SECURITY_ERR';
			  break;
			case FileError.INVALID_MODIFICATION_ERR:
			  msg = 'INVALID_MODIFICATION_ERR';
			  break;
			case FileError.INVALID_STATE_ERR:
			  msg = 'INVALID_STATE_ERR';
			  break;
			default:
			  msg = 'Unknown Error';
			  break;
		};
		console.log('Error: ' + msg);
	};
	return {
		init: init,
		write: write
	}
})();

FileWriter.init();

// filesystem:http://localhost/persistent/15_1.txt
// time, trackingId, distance, qr