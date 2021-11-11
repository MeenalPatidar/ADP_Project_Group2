// this is required for the edit list item option
// if one clicks on the edit button, then the corresponding edit form becomes visible
$("button[type='button']").on("click", function () {
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
