// Check whether username already exists or not, if yes, then allow login
// if not keep login button disabled
$("#username").on("change keyup", function () {
	if (this.value.length > 0) {
		$.post("/check", { "user": this.value }, function (result) {
			$("#login").prop("disabled", !result);
		});
	} else {
		$("#login").prop("disabled", result);
	}
});
