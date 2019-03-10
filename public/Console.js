/* CONSOLE PRINT FUNCTIONS */

/* Contains the various functions
 *	and properties dictating the
 *	debugging console.
 *
 * NOTE: This console is purely for
 *	debugging purposes only, and is,
 *	thus, should only be for use
 *	during development.
 */

var dev_console_line_cnt = 0;
var MAX_LINE_CNT = 400;
var dev_console = document.getElementById("console");
var println = function (inStr) {
	dev_console.value += ">" + inStr + "\n";
	dev_console.scrollTop = dev_console.scrollHeight;
	dev_console_line_cnt++;
	if(dev_console_line_cnt > MAX_LINE_CNT){
		dev_console_cleanup(true);
	}
};

var print = function (inStr) {
	dev_console.value += ">" + inStr;
	dev_console.scrollTop = dev_console.scrollHeight;
	dev_console_line_cnt++;
	if(dev_console_line_cnt > MAX_LINE_CNT){
		dev_console_cleanup(true);
	}
};

var printEmpty = function() {
	dev_console.value += "\n"
	dev_console.scrollTop = dev_console.scrollHeight;
	dev_console_line_cnt++;
	if(dev_console_line_cnt > MAX_LINE_CNT){
		dev_console_cleanup(true);
	}
};

/* If flag == true, then the console is doing an auto
 *	cleanup, deleting the oldest line. Otherwise, it
 *	will clean the entire console.
 */
var dev_console_cleanup = function(flag){
	if(flag){
		dev_console_line_cnt--;
		dev_console.value = dev_console.value.substring(dev_console.value.indexOf("\n") + 1);
	}
	else{
		dev_console_line_cnt = 0;
		dev_console.value = "";
	}
}

var clear_console = function(){
	dev_console_cleanup(false);
}

var export_console = function(){
	// TODO...
}
