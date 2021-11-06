$("input[type='checkbox']").on("load ready change", function () {
    if(this.value === "on") {
        labels = document.getElementsByTagName("label");
        for (var i = 0; i < labels.length; i++) {
            if(labels[i].id === this.id) {
                labels[i].style.textDecoration = "line-through";
            }
        }
        this.value = "off";
    } else {
        labels = document.getElementsByTagName("label");
        for (var i = 0; i < labels.length; i++) {
            if(labels[i].id === this.id) {
                labels[i].style.textDecoration = "None";
            }
        }
        this.value = "on";
    }
});

$("button[type='button']").on("click", function() {
    invisibles = document.getElementsByClassName("editMenu");
    for (var i = 0; i < invisibles.length; i++) {
        if (invisibles[i].id === this.id) {
            console.log(invisibles[i].style.display);
            if (invisibles[i].style.display === "" || invisibles[i].style.display === "none") {
                invisibles[i].style.display = "flex";
            } else {
                invisibles[i].style.display = "none";
            }
        }
    }
});