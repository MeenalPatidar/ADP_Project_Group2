$("#username").on("change keyup", function () {
	if (this.value.length > 0) {
		$.post("/check", { "user": this.value }, function (result) {
			$("#register").prop("disabled", result);
		});
	} else {
		$("#register").prop("disabled", true);
	}
});
