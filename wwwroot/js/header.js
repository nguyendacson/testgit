document.addEventListener("DOMContentLoaded", function () {

    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('clock').innerHTML =
            `${h}<span class="colon"> : </span>${m}`;

        console.log(`Clock updated: ${h}:${m}`);    
    }
    updateClock();
    setInterval(updateClock, 60000);
});