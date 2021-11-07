$("#username").on("change keyup", function () {
    if (this.value.length > 0) {
        $.post("/check", { "user": this.value }, function (result) {
            $("#register").prop("disabled", result);
        });
    } else {
        $("#register").prop("disabled", true);
    }
});


$(function () {
    var $password = $(".form-control[type='password']");
    var $passwordAlert = $(".password-alert");
    var $requirements = $(".requirements");
    var leng, upperCaseLetter, num, specialChar;
    var $leng = $(".leng");
    var $upperCaseLetter = $(".uppercase-letter");
    var $num = $(".num");
    var $specialChar = $(".special-char");
    var specialChars = "!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?`~";
    var numbers = "0123456789";

    $requirements.addClass("wrong");
    $password.on("focus", function () { $passwordAlert.show(); });

    $password.on("input blur", function (e) {
        var el = $(this);
        var val = el.val();
        $passwordAlert.show();

        if (val.length < 8) {
            leng = false;
        } else if (val.length > 7) {
            leng = true;
        }


        if (val.toLowerCase() == val) {
            upperCaseLetter = false;
        } else { upperCaseLetter = true; }

        num = false;
        for (var i = 0; i < val.length; i++) {
            for (var j = 0; j < numbers.length; j++) {
                if (val[i] == numbers[j]) {
                    num = true;
                }
            }
        }

        specialChar = false;
        for (var i = 0; i < val.length; i++) {
            for (var j = 0; j < specialChars.length; j++) {
                if (val[i] == specialChars[j]) {
                    specialChar = true;
                }
            }
        }

        if (leng == true && upperCaseLetter == true && num == true && specialChar == true) {
            $(this).addClass("valid").removeClass("invalid");
            $requirements.removeClass("wrong").addClass("good");
            $passwordAlert.removeClass("alert-warning").addClass("alert-success");
            $passwordAlert.hide();
        } else {
            $(this).addClass("invalid").removeClass("valid");
            $passwordAlert.removeClass("alert-success").addClass("alert-warning");

            if (leng == false) {
                $leng.addClass("wrong").removeClass("good");
            } else {
                $leng.addClass("good").removeClass("wrong");
            }

            if (upperCaseLetter == false) {
                $upperCaseLetter.addClass("wrong").removeClass("good");
            } else {
                $upperCaseLetter.addClass("good").removeClass("wrong");
            }

            if (num == false) {
                $num.addClass("wrong").removeClass("good");
            } else {
                $num.addClass("good").removeClass("wrong");
            }

            if (specialChar == false) {
                $specialChar.addClass("wrong").removeClass("good");
            } else {
                $specialChar.addClass("good").removeClass("wrong");
            }
        }
    });
});
