document.addEventListener("DOMContentLoaded", function () {

    // ============================================================
    // GET HTML ELEMENTS
    // ============================================================

    const loginForm = document.getElementById("workerLoginForm");
    const workerIdInput = document.getElementById("workerId");
    const passwordInput = document.getElementById("workerPassword");
    const togglePasswordButton = document.getElementById("togglePassword");
    const rememberMeInput = document.getElementById("rememberMe");
    const loginMessage = document.getElementById("loginMessage");


    // ============================================================
    // PASSWORD SHOW / HIDE
    // ============================================================

    if (togglePasswordButton && passwordInput) {

        togglePasswordButton.addEventListener("click", function () {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                togglePasswordButton.textContent = "🙈";

                togglePasswordButton.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                passwordInput.type = "password";

                togglePasswordButton.textContent = "👁";

                togglePasswordButton.setAttribute(
                    "aria-label",
                    "Show password"
                );
            }

        });
    }


    // ============================================================
    // SHOW LOGIN MESSAGE
    // ============================================================

    function showMessage(message, type = "error") {

        if (!loginMessage) {
            return;
        }

        loginMessage.textContent = message;

        loginMessage.className =
            "login-message show " + type;

        loginMessage.style.display = "block";
    }


    // ============================================================
    // CLEAR LOGIN MESSAGE
    // ============================================================

    function clearMessage() {

        if (!loginMessage) {
            return;
        }

        loginMessage.textContent = "";

        loginMessage.className = "login-message";

        loginMessage.style.display = "none";
    }


    // ============================================================
    // FORM CHECK
    // ============================================================

    if (!loginForm) {
        console.error("Worker login form not found.");
        return;
    }


    // ============================================================
    // LOGIN SUBMIT
    // ============================================================

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        clearMessage();


        // --------------------------------------------------------
        // GET VALUES
        // --------------------------------------------------------

        const workerId =
            workerIdInput
                ? workerIdInput.value.trim()
                : "";

        const password =
            passwordInput
                ? passwordInput.value
                : "";

        const rememberMe =
            rememberMeInput
                ? rememberMeInput.checked
                : false;


        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------

        if (!workerId) {

            showMessage(
                "Please enter your Worker ID.",
                "error"
            );

            if (workerIdInput) {
                workerIdInput.focus();
            }

            return;
        }


        if (!password) {

            showMessage(
                "Please enter your password.",
                "error"
            );

            if (passwordInput) {
                passwordInput.focus();
            }

            return;
        }


        // --------------------------------------------------------
        // LOGIN BUTTON
        // --------------------------------------------------------

        const loginButton =
            loginForm.querySelector(
                "button[type='submit']"
            );

        let originalButtonHTML = "";

        if (loginButton) {

            originalButtonHTML =
                loginButton.innerHTML;

            loginButton.disabled = true;

            loginButton.innerHTML =
                "<span>LOGGING IN...</span><strong>⏳</strong>";
        }


        // ========================================================
        // SEND LOGIN REQUEST
        // ========================================================

        try {

            const response = await fetch(
                "/worker-login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json",

                        "X-Requested-With":
                            "XMLHttpRequest"
                    },

                    credentials: "same-origin",

                    body: JSON.stringify({

                        workerId: workerId,

                        password: password,

                        remember: rememberMe

                    })
                }
            );


            // ----------------------------------------------------
            // READ RESPONSE
            // ----------------------------------------------------

            const contentType =
                response.headers.get(
                    "content-type"
                ) || "";


            let data;


            if (
                contentType.includes(
                    "application/json"
                )
            ) {

                data = await response.json();

            } else {

                const text =
                    await response.text();

                data = {
                    success: response.ok,
                    message: text
                };
            }


            // ====================================================
            // SUCCESS
            // ====================================================

            if (
                response.ok &&
                data &&
                data.success
            ) {

                showMessage(
                    "Login successful. Redirecting...",
                    "success"
                );


                // Small delay so user can see success
                setTimeout(function () {

                    window.location.href =
                        data.redirect ||
                        "/worker-dashboard";

                }, 300);


                return;
            }


            // ====================================================
            // LOGIN FAILED
            // ====================================================

            showMessage(

                data.message ||
                data.error ||
                "Invalid Worker ID or password.",

                "error"

            );


        } catch (error) {

            console.error(
                "Worker login error:",
                error
            );


            showMessage(
                "Unable to connect to the server. Please try again.",
                "error"
            );


        } finally {

            if (loginButton) {

                loginButton.disabled = false;

                loginButton.innerHTML =
                    originalButtonHTML;
            }
        }

    });

});
