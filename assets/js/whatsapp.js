// WhatsApp Form Scripts
document.addEventListener('DOMContentLoaded', function() {
    // Contact form submission
    document.getElementById("whatsappForm").addEventListener("submit", function(event) {
        event.preventDefault();
        sendWhatsAppMessage("name", "email", "message");
    });

    // Floating form submission
    document.getElementById("whatsapp-floating-form").addEventListener("submit", function(event) {
        event.preventDefault();
        sendWhatsAppMessage("floating-name", "floating-email", "floating-message");
        this.reset();
        this.style.display = "none";
    });

    // Common WhatsApp message sender function
    function sendWhatsAppMessage(nameId, emailId, messageId) {
        const name = document.getElementById(nameId).value;
        const email = document.getElementById(emailId).value;
        const message = document.getElementById(messageId).value;

        const whatsappMessage = `Hello, my name is ${name}. My email is ${email}. Message: ${message}`;
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappNumber = "917870660390";
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        window.open(whatsappURL, "_blank");
    }

    // Floating button hover functionality
    const floatingBtn = document.getElementById("whatsapp-floating-btn");
    const floatingForm = document.getElementById("whatsapp-floating-form");
    let timeoutId;

    if (!floatingBtn || !floatingForm) return;

    floatingBtn.addEventListener("mouseenter", function() {
        clearTimeout(timeoutId);
        floatingForm.style.display = "block";
    });

    floatingForm.addEventListener("mouseenter", function() {
        clearTimeout(timeoutId);
    });

    floatingBtn.addEventListener("mouseleave", function() {
        timeoutId = setTimeout(() => {
            if (!floatingForm.matches(':hover')) {
                floatingForm.style.display = "none";
            }
        }, 200);
    });

    floatingForm.addEventListener("mouseleave", function() {
        timeoutId = setTimeout(() => {
            if (!floatingBtn.matches(':hover')) {
                floatingForm.style.display = "none";
            }
        }, 200);
    });
});