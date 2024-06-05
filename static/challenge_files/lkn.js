"use strict";

function initCookieBanner(cookieGroups) {
    const cookiegroups = cookieGroups;
    const _keyValue = document.cookie.match('(^|;) ?cookiebanner=([^;]*)(;|$)');
    const cookiebannerCookie = _keyValue ? decodeURIComponent(_keyValue[2]) : null;
    const cookiebannerModal = document.getElementById("cookiebannerModal");

    document.addEventListener("DOMContentLoaded", function () {
        if (!cookiebannerCookie) cookiebannerModal.classList.remove('hidden');
    });

    new IntersectionObserver(([e]) => {
        if (cookiebannerCookie) {
            try {
                cookiebannerCookie.split(',').forEach((sec) =>
                    document.querySelector(`input[name="${sec}"]`).checked = true
                )
            } catch {
                console.warn("having trouble parsing the cookiebannerCookie or settings the checkboxes")
            }
        }

        const cookieBannerCollapsibleLinksSelector = "a[data-toggle='cookiebannerCollapse']";

        document.querySelectorAll(cookieBannerCollapsibleLinksSelector).forEach((a) => {
            $(a).off("click");
            $(a).on("click", function () {
                document.querySelectorAll(cookieBannerCollapsibleLinksSelector).forEach(
                    (aToBeClosed) => {
                        if (aToBeClosed.hash !== a.hash) {
                            document.querySelector(aToBeClosed.hash).classList.remove('show');
                        }
                    });
                document.querySelector(a.hash).classList.toggle('show');
            })
        })

        document.querySelectorAll("input.cookiebannerSubmit").forEach((inp) => {
            inp.addEventListener("click", () => {
                let enable_cookies;

                if (inp.name === 'close') {
                    closeCookieSettings();
                    return;
                }

                if (inp.name === 'necessary_only') {
                    enable_cookies = cookiegroups.filter((x) => x.id === "essential").map((x) => x.id);
                } else {
                    let checked_cookiegroups = Array.from(document.querySelector("#cookiebannerForm"))
                        .filter((x) => x.checked).map((x) => x.name);
                    enable_cookies = cookiegroups
                        .filter((x) => {
                            return checked_cookiegroups.includes(x.id) ? x : !x.optional;
                        })
                        .map((x) => x.id);
                }
                const max_age = (365 * 24 * 60 * 60);
                const secure = window.location.hostname === 'localhost' ? "" : "secure";
                document.cookie = `cookiebanner=${encodeURIComponent(enable_cookies)}; path=/; max-age=${max_age}; ${secure}`;
                location.reload();
            })
        })
    }).observe(cookiebannerModal);

}

function setUpCookieSettings() {
    const _keyValue = document.cookie.match('(^|;) ?cookiebanner=([^;]*)(;|$)');
    const cookiebannerCookie = _keyValue ? decodeURIComponent(_keyValue[2]) : null;

    if (cookiebannerCookie) {
        let selectedCookies = cookiebannerCookie.split(",");

        document.querySelectorAll("input[type='checkbox']").forEach(function(cookieInputChecker) {
            if (selectedCookies.includes($(cookieInputChecker).prop("name"))) {
                $(cookieInputChecker).prop("checked", true);
            } else {
                $(cookieInputChecker).prop("checked", false);
            }
        });
    }
}

function openCookieSettings() {
    cookiebannerModal.classList.remove('hidden');
    let closeModalBtn = document.querySelector("input.cookiebannerSubmit[name='close']");
    closeModalBtn.classList.remove('hidden');
    setUpCookieSettings();
}

function closeCookieSettings() {
    cookiebannerModal.classList.add('hidden');
    let closeModalBtn = document.querySelector("input.cookiebannerSubmit[name='close']");
    closeModalBtn.classList.add('hidden');
}