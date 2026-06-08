function getStatus(value) {

    if (value <= 50) {
        return {
            text: "🟢 Healthy",
            color: "#22c55e"
        };
    }

    if (value <= 80) {
        return {
            text: "🟡 Warning",
            color: "#facc15"
        };
    }

    return {
        text: "🔴 Critical",
        color: "#ef4444"
    };
}

function updateMetric(valueId, barId, statusId, value, suffix = "%") {

    document.getElementById(valueId).innerText =
        value + suffix;

    const status = getStatus(value);

    document.getElementById(barId).style.width =
        value + "%";

    document.getElementById(barId).style.background =
        status.color;

    document.getElementById(statusId).innerText =
        status.text;

    document.getElementById(statusId).style.color =
        status.color;
}

function updateDashboard() {

    const cpu = Math.floor(Math.random() * 100);
    const ram = Math.floor(Math.random() * 100);
    const disk = Math.floor(Math.random() * 100);
    const network = Math.floor(Math.random() * 100);

    updateMetric(
        "cpuValue",
        "cpuBar",
        "cpuStatus",
        cpu
    );

    updateMetric(
        "ramValue",
        "ramBar",
        "ramStatus",
        ram
    );

    updateMetric(
        "diskValue",
        "diskBar",
        "diskStatus",
        disk
    );

    document.getElementById("networkValue").innerText =
        network + " Mbps";

    const networkStatus = getStatus(network);

    document.getElementById("networkBar").style.width =
        network + "%";

    document.getElementById("networkBar").style.background =
        networkStatus.color;

    document.getElementById("networkStatus").innerText =
        networkStatus.text;

    document.getElementById("networkStatus").style.color =
        networkStatus.color;

    document.getElementById("time").innerText =
        new Date().toLocaleTimeString();
}

updateDashboard();

setInterval(updateDashboard, 2000);