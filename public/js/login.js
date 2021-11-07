$("#username").on("change keyup", function () {
	if (this.value.length > 0) {
		$.post("/check", { "user": this.value }, function (result) {
			$("#login").prop("disabled", !result);
		});
	} else {
		$("#login").prop("disabled", result);
	}
});
