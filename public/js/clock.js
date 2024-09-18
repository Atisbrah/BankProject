export function updateClock() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.textContent = formattedTime;
    } else {
        console.error('Element with id "clock" not found');
    }
}

export function startClock() {
    // Frissíti az órát másodpercenként
    setInterval(updateClock, 1000);
    // Az óra inicializálása az oldal betöltésekor
    updateClock();
}
