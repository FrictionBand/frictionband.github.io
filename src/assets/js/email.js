var emailLinks = document.getElementsByClassName('email');
for (var i = 0; i < emailLinks.length; i++) {
    emailLinks[i].addEventListener('click', function () {
        var user = "friction.helsinki";
        var domain = "gmail.com";
        window.location.href = "mailto:" + user + "@" + domain;
    });
    emailLinks[i].classList.remove("hidden")
}
