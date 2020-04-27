AOS.init({
    duration: 800,
    easing: 'slide'
});

$(function () {

    var navMain = $("#ftco-nav");
    var navbarToggler = document.getElementById("navbar-toggler");
    var menuBackdrop = document.getElementById("menu-backdrop");
    var navbar = document.getElementById("ftco-navbar");

    function closeMenu() {
        menuBackdrop.style.display = 'none';
        navbar.removeAttribute('style');
        navbarToggler.classList.remove("menuopen");
        navMain.collapse('hide');
    }

    function openMenu() {
        menuBackdrop.style.display = 'block';
        navbar.setAttribute('style', 'background: #fff !important');
        navbarToggler.classList.add("menuopen");
    }

    navMain.on("click", "a", null, function () {
        closeMenu();
    });

    $("#navbar-toggler").on("click", function () {
        var navbarToggler = document.getElementById("navbar-toggler");
        var menuBackdrop = document.getElementById("menu-backdrop");
        var navbar = document.getElementById("ftco-navbar");
        var isVisible = menuBackdrop.style.display !== "none";

        if (isVisible) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    var scrollWindow = function () {
        $(window).scroll(function () {
            var $w = $(this),
                st = $w.scrollTop(),
                navbar = $('.ftco_navbar'),
                sd = $('.js-scroll-wrap');

            if (st > 150) {
                if (!navbar.hasClass('scrolled')) {
                    navbar.addClass('scrolled');
                }
            }
            if (st < 150) {
                if (navbar.hasClass('scrolled')) {
                    navbar.removeClass('scrolled sleep');
                }
            }
            if (st > 350) {
                if (!navbar.hasClass('awake')) {
                    navbar.addClass('awake');
                }

                if (sd.length > 0) {
                    sd.addClass('sleep');
                }
            }
            if (st < 350) {
                if (navbar.hasClass('awake')) {
                    navbar.removeClass('awake');
                    navbar.addClass('sleep');
                }
                if (sd.length > 0) {
                    sd.removeClass('sleep');
                }
            }
        });
    };
    scrollWindow();
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePresentkortBestallning(mottagareNamn, mottagarePostadress, bestallareEmail, bestallareTel, betalsatt) {
    var errors = [];
    if (!mottagareNamn) {
        errors.push("Ange mottagare namn");
    }

    if (!mottagarePostadress) {
        errors.push("Ange mottagare postadress");
    }

    if (validateEmail(mottagarePostadress)) {
        errors.push("Ange mottagare postadress INTE e-postadress");
    }

    if (!bestallareEmail || validateEmail(bestallareEmail) === false) {
        errors.push("Ange en giltig email för beställare");
    }

    if (!bestallareTel) {
        errors.push("Ange beställare telefonnummer");
    }

    var isValid = errors.length === 0;

    if (isValid === false) {
        var errorMessage = errors.join("\n");
        alert(errorMessage);
    }

    return isValid;
}

function emailSent() {
    var presentkortForm = document.getElementById("presentkort-form");
    presentkortForm.style.display = 'none';

    var presentkortTackElement = document.getElementById("presentkort-tack-element");
    presentkortTackElement.style.display = 'block';

    var tackPosition = presentkortTackElement.getBoundingClientRect().top + document.documentElement.scrollTop - 100;
    window.scrollTo(0, tackPosition);
}

function sendEmail() {
    var mottagareNamn = document.getElementById("mottagare-namn-input").value;
    var mottagarePostadress = document.getElementById("mottagare-postadress-input").value;
    var bestallareEmail = document.getElementById("bestallare-email-input").value;
    var bestallareTel = document.getElementById("bestallare-tel-input").value;
    var betalsatt = document.getElementById("betalsatt-input").value;

    $.get("email/emailtemplate.html")
        .done((templateData) => {

            templateData = templateData.replace("#MOTTAGARENAMN#", mottagareNamn);
            templateData = templateData.replace("#MOTTAGAREADRESS#", mottagarePostadress);
            templateData = templateData.replace("#BESTALLAREEMAIL#", bestallareEmail);
            templateData = templateData.replace("#BESTALLARETEL#", bestallareTel);
            templateData = templateData.replace("#BETALSATT#", betalsatt);

            $.ajax({
                url: "https://api.smtp2go.com/v3/email/send",
                method: 'POST',
                headers: { 'Content-Type': "application/json" },
                data: JSON.stringify({
                    'api_key': "api-86B895CC88B711EA85B8F23C91BBF4A0",
                    'to': [
                        bestallareEmail
                    ],
                    'sender': "info@tant-gron.nu",
                    'subject': "Bekräftelse beställning av presentkort",
                    'html_body': templateData,
                }),
            })
                .done(function (result) {
                    emailSent();
                })
                .fail(function (err) {
                    alert("Något gick fel, försök igen och kontakta oss ifall felet kvarstår");
                    throw err;
                });
        })
        .fail(function (err) {
            alert("Något gick fel, försök igen och kontakta oss ifall felet kvarstår");
            throw err;
        });;
}

function bestallPresentkort(event) {

    var mottagareNamn = document.getElementById("mottagare-namn-input").value;
    var mottagarePostadress = document.getElementById("mottagare-postadress-input").value;
    var bestallareEmail = document.getElementById("bestallare-email-input").value;
    var bestallareTel = document.getElementById("bestallare-tel-input").value;
    var betalsatt = document.getElementById("betalsatt-input").value;
    var bestallBtn = document.getElementById("bestall-btn");

    var isValid = validatePresentkortBestallning(mottagareNamn, mottagarePostadress, bestallareEmail, bestallareTel, betalsatt);

    if (isValid) {
        bestallBtn.disabled = true;
        bestallBtn.innerHTML = "Beställer...";
        sendEmail();
    }

    event.preventDefault();
    return false;

}
