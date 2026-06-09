let cpuHistory = [];
let ramHistory = [];

/* ---------------------------
   CPU Chart
--------------------------- */

const cpuChart = new Chart(
    document.getElementById("cpuChart"),
    {
        type: "line",
        data: {
            labels: [],
            datasets: [
                {
                    label: "CPU %",
                    data: [],
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true
        }
    }
);

/* ---------------------------
   RAM Chart
--------------------------- */

const ramChart = new Chart(
    document.getElementById("ramChart"),
    {
        type: "line",
        data: {
            labels: [],
            datasets: [
                {
                    label: "RAM %",
                    data: [],
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true
        }
    }
);

/* ---------------------------
   Status Logic
--------------------------- */

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

/* ---------------------------
   Update Metric Card
--------------------------- */

function updateMetric(
    valueId,
    barId,
    statusId,
    value,
    suffix = "%"
) {

    document.getElementById(
        valueId
    ).innerText =
        value + suffix;

    const status =
        getStatus(value);

    document.getElementById(
        barId
    ).style.width =
        value + "%";

    document.getElementById(
        barId
    ).style.background =
        status.color;

    document.getElementById(
        statusId
    ).innerText =
        status.text;

    document.getElementById(
        statusId
    ).style.color =
        status.color;
}

/* ---------------------------
   Dashboard Update
--------------------------- */

async function updateDashboard() {

    try {

        const response =
            await fetch(
                "http://localhost:3000/metrics"
            );

        const data =
            await response.json();

        const cpu =
            Math.round(data.cpu);

        const ram =
            Math.round(data.ram);

        const disk =
            Math.round(data.disk);

        /* CPU */

        updateMetric(
            "cpuValue",
            "cpuBar",
            "cpuStatus",
            cpu
        );

        /* RAM */

        updateMetric(
            "ramValue",
            "ramBar",
            "ramStatus",
            ram
        );

        /* DISK */

        updateMetric(
            "diskValue",
            "diskBar",
            "diskStatus",
            disk
        );

        /* NETWORK */

        const network =
            Math.round(
                data.network / 1024
            );

        document.getElementById(
            "networkValue"
        ).innerText =
            network + " KB/s";

        const networkStatus =
            getStatus(
                Math.min(
                    network / 10,
                    100
                )
            );

        document.getElementById(
            "networkBar"
        ).style.width =
            Math.min(
                network / 10,
                100
            ) + "%";

        document.getElementById(
            "networkBar"
        ).style.background =
            networkStatus.color;

        document.getElementById(
            "networkStatus"
        ).innerText =
            networkStatus.text;

        document.getElementById(
            "networkStatus"
        ).style.color =
            networkStatus.color;

        /* UPTIME */

        const hours =
            Math.floor(
                data.uptime / 3600
            );

        const minutes =
            Math.floor(
                (data.uptime % 3600) / 60
            );

        document.getElementById(
            "uptimeValue"
        ).innerText =
            `${hours}h ${minutes}m`;

        /* HOST INFO */

        document.getElementById(
            "hostInfo"
        ).innerHTML =

            `
            Hostname:
            ${data.hostname}

            <br><br>

            Platform:
            ${data.platform}
            `;

        /* DISK DETAILS */

        document.getElementById(
            "diskDetails"
        ).innerHTML =

            `
            Used:
            ${(data.usedDisk / 1e9).toFixed(1)} GB

            <br>

            Free:
            ${(data.freeDisk / 1e9).toFixed(1)} GB

            <br>

            Total:
            ${(data.totalDisk / 1e9).toFixed(1)} GB
            `;

        /* CHARTS */

        cpuHistory.push(cpu);
        ramHistory.push(ram);

        if (
            cpuHistory.length > 15
        ) {

            cpuHistory.shift();
            ramHistory.shift();
        }

        cpuChart.data.labels =
            cpuHistory.map(
                (_, i) => i + 1
            );

        cpuChart.data.datasets[0].data =
            cpuHistory;

        cpuChart.update();

        ramChart.data.labels =
            ramHistory.map(
                (_, i) => i + 1
            );

        ramChart.data.datasets[0].data =
            ramHistory;

        ramChart.update();

        /* LAST UPDATED */

        document.getElementById(
            "time"
        ).innerText =
            new Date()
                .toLocaleTimeString();

    }

    catch (error) {

        console.error(
            "Error fetching metrics:",
            error
        );

    }

}

/* ---------------------------
   Theme Toggle
--------------------------- */

const themeBtn =
document.getElementById(
    "themeToggle"
);

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light-theme"
        );

        if(
            document.body.classList.contains(
                "light-theme"
            )
        ){

            themeBtn.innerHTML =
                "☀️ Light Mode";

        } else {

            themeBtn.innerHTML =
                "🌙 Dark Mode";

        }

    }
);
/* ---------------------------
   Auto Refresh
--------------------------- */

updateDashboard();

setInterval(
    updateDashboard,
    2000
);