/*
filedrag.js - HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net
*/
(function() {

	// getElementById
	function $id(id) {
		return document.getElementById(id);
	}


	// output information
	function Output(msg) {
		var m = $id("messages");
		m.innerHTML = msg + m.innerHTML;
	}


	// file drag hover
	function FileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "hover" : "");
	}


	// file selection
	function FileSelectHandler(e) {

		// cancel event and hover styling
		FileDragHover(e);

		// fetch FileList object
		var files = e.target.files || e.dataTransfer.files;

		// process all File objects
		for (var i = 0, f; f = files[i]; i++) {
			ParseFile(f);
			UploadFile(f);
		}

	}


	// output file information
	function ParseFile(file) {
		var fs = Math.round ( file.size / 1024 , 2 ) + ''
		Output(
			"<p>Información del archivo: <strong>" + file.name +
			"</strong> Tipo: <strong>" + file.type +
			"</strong> Tamaño: <strong>" + separarMiles ( fs , ',' ) +
			"</strong> Kb</p>"
		);

		// display an image
		if (file.type.indexOf("image") == 0) {
			var reader = new FileReader();
			reader.onload = function(e) {
				Output(
					"<p><strong>" + file.name + ":</strong><br />" +
					'<img src="' + e.target.result + '" /></p>'
				);
			}
			reader.readAsDataURL(file);
		}

		// display text
		if (file.type.indexOf("text") == 0) {
			var reader = new FileReader();
			reader.onload = function(e) {
				Output(
					"<p><strong>" + file.name + ":</strong></p><pre>" +
					e.target.result.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
					"</pre>"
				);
			}
			reader.readAsText(file);
		}

	}


	// upload JPEG files
	function UploadFile(file) {
		if ( file.size <= ( $id("MAX_FILE_SIZE").value * 1024 * 1024 ) ) {
//$id("upload").submit()
//return
/*
		//if (xhr.upload && file.type == "image/jpeg" && file.size <= $id("MAX_FILE_SIZE").value) {
//alert('a')
			// create progress bar
			var o = $id("progress");
			var progress = o.appendChild(document.createElement("p"));
			progress.appendChild(document.createTextNode("upload " + file.name));


			// progress bar
			xhr.upload.addEventListener("progress", function(e) {
				var pc = parseInt(100 - (e.loaded / e.total * 100));
				progress.style.backgroundPosition = pc + "% 0";
			}, false);

			// file received/failed
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState == 4) {
					progress.className = (xhr.status == 200 ? "success" : "failure");
				}
			};
			
*/			
			// create progress bar
			var o = $id("progress");
			var progress = o.appendChild(document.createElement("p"));
			progress.appendChild(document.createTextNode("upload " + file.name));
var data = new FormData();
data.append('file', file);
/*
$.each($(':file')[0].files, function(i, file) {
    data.append('file-'+i, file);
	alert('a')
});
*/
var date = new Date();
var components = [
    date.getFullYear(),
    ("0"+(date.getMonth()*1+1*1)).slice(-2),
    ("0"+date.getDate()).slice(-2),
    ("0"+date.getHours()).slice(-2),
    ("0"+date.getMinutes()).slice(-2),
    ("0"+date.getSeconds()).slice(-2),
    ("00"+date.getMilliseconds()).slice(-3),
];
//console.log(components)
var id = components.join("");
var filename = $(document).data("pars").nombrearchivo + "_" + id + "_" + file.name
var originalfilename = file.name
var dir = $(document).data("pars").dir //"c:\\data\\documentos\\usersUploads"

$.ajax({
    url: 'upload.asp',
    data: data,
    cache: false,
    contentType: false,
    processData: false,
	headers: { "XFILENAME" : filename, "XDIR" : dir },
    type: 'POST',
	xhr: function()
	{
		var xhr = new window.XMLHttpRequest();
		//Upload progress
		xhr.upload.addEventListener("progress", function(e){
			if (e.lengthComputable) {
						var pc = parseInt(100 - (e.loaded / e.total * 100));
						progress.style.backgroundPosition = pc + "% 0";
						if(pc==100){
						}
			}
		}, false);
		//Download progress
		/*
		xhr.addEventListener("progress", function(evt){
			if (evt.lengthComputable) {
				var percentComplete = evt.loaded / evt.total;
				//Do something with download progress
				console.log(percentComplete);
				}
			}, false);
		*/
		/*
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState == 4) {
					progress.className = (xhr.status == 200 ? "success" : "failure");
					alert('a');
				}
				var readystatehook = xhr.onreadystatechange;
				readystatehook.apply(this, []);
			};
		*/
		return xhr;
	},    
	success: function(data){
					$(document).data("pars").callbackFn(filename,originalfilename);
					if(data=='1'){
						progress.className = "success";
					}else{
						progress.className = "failed";
						console.log(data);
					}
					
    },
	error: function(data){
					$(document).data("pars").callbackFn(filename,originalfilename);
					progress.className = "failed";
					console.log(data);
    }
	});

/*
			// start upload
			xhr.open("POST", $id("upload").action, true);
			console.log (file.name)
			xhr.setRequestHeader("XFILENAME", file.name);
			xhr.send(file);
*/
	}else{
		alert("No se pueden subir archivos de más de 10Mb.")
	}

	}


	// initialize
	function Init() {

		var fileselect = $id("fileselect"),
			filedrag = $id("filedrag"),
			submitbutton = $id("submitbutton");

		// file select
		fileselect.addEventListener("change", FileSelectHandler, false);

		// is XHR2 available?
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {

			// file drop
			filedrag.addEventListener("dragover", FileDragHover, false);
			filedrag.addEventListener("dragleave", FileDragHover, false);
			filedrag.addEventListener("drop", FileSelectHandler, false);
			filedrag.style.display = "block";

			// remove submit button
			submitbutton.style.display = "none";
		}

	}

	// call initialization file
	if (window.File && window.FileList && window.FileReader) {
		Init();
	}


})();