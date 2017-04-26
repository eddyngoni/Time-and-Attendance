function showToast(message) {
    var toast = document.getElementById("toast");

    toast.innerHTML = message; 
    toast.className = "show";
    setTimeout( function(){ 
        toast.className = toast.className.replace("show", "");
    }, 3000);
}