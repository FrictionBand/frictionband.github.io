var emailLinks = document.getElementsByClassName('email');
for (var i = 0; i < emailLinks.length; i++) {
    // Make link visible (if JS enabled)
    if (emailLinks[i].classList.contains('hidden')) {
        emailLinks[i].classList.remove('hidden');
    }
    emailLinks[i].addEventListener('click', function () {
        var user = "friction.helsinki";
        var domain = "gmail.com";
        window.location.href = "mailto:" + user + "@" + domain;
    });
    emailLinks[i].classList.remove("hidden")
}
