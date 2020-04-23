AOS.init({
    duration: 800,
    easing: 'slide'
});

$(function() {
    var navMain = $("#ftco-nav");
    navMain.on("click", "a", null, function() {
        navMain.collapse('hide');
    });

    navMain.on("click", "a", null, function() {
        navMain.collapse('hide');
    });

    $("#navbar-toggler").on("click", function() {
        var navbarToggler = document.getElementById("navbar-toggler");
        var menuBackdrop = document.getElementById("menu-backdrop");
        var navbar = document.getElementById("ftco-navbar");
        var isVisible = menuBackdrop.style.display !== "none";

        if (isVisible) {
            menuBackdrop.style.display = 'none';
            navbar.removeAttribute('style');
            navbarToggler.classList.remove("menuopen");
        } else {
            menuBackdrop.style.display = 'block';
            navbar.setAttribute('style', 'background: #fff !important');
            navbarToggler.classList.add("menuopen");
        }
    });

    var scrollWindow = function() {
        $(window).scroll(function() {
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

function bestallPresentkort(event) {

    var mottagareNamn = document.getElementById("mottagare-namn-input").value;
    var mottagarePostadress = document.getElementById("mottagare-postadress-input").value;
    var bestallareEmail = document.getElementById("bestallare-email-input").value;
    var bestallareTel = document.getElementById("bestallare-tel-input").value;
    var betalsatt = document.getElementById("betalsatt-input").value;

    var isValid = validatePresentkortBestallning(mottagareNamn, mottagarePostadress, bestallareEmail, bestallareTel, betalsatt);

    if (isValid) {

        var message = "<h1>Ny beställning av presentkort</h1>" +
            "Mottagare namn: " + mottagareNamn + "<br/>" +
            "Mottagare postadress: " + mottagarePostadress + "<br/>" +
            "Beställare email: " + bestallareEmail + "<br/>" +
            "Beställare tel: " + bestallareTel + "<br/>" +
            "Betalsätt: " + betalsatt + "<br/>";

        //sendemail

        var presentkortForm = document.getElementById("presentkort-form");
        presentkortForm.style.display = 'none';

        var presentkortTackElement = document.getElementById("presentkort-tack-element");
        presentkortTackElement.style.display = 'block';

        var tackPosition = presentkortTackElement.getBoundingClientRect().top + document.documentElement.scrollTop - 100;
        window.scrollTo(0, tackPosition);
    }


    event.preventDefault();
    return false;

}