const express = require("express");
const cors = require("cors");
const si = require("systeminformation");
const os = require("os");

const app = express();

app.use(cors());

app.get("/metrics", async (req, res) => {

    try {

        const load = await si.currentLoad();
        const mem = await si.mem();
        const disks = await si.fsSize();
        const network = await si.networkStats();

        res.json({

            cpu: load.currentLoad.toFixed(2),

            ram: (
                (mem.used / mem.total) * 100
            ).toFixed(2),

            disk: disks[0].use.toFixed(2),

            network: (
                network[0]?.rx_sec || 0
            ).toFixed(2),

            uptime: os.uptime(),

            hostname: os.hostname(),

            platform: os.platform(),

            totalDisk: disks[0].size,

            usedDisk: disks[0].used,

            freeDisk:
                disks[0].size -
                disks[0].used
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

app.listen(3000, () => {

    console.log(
        "🚀 Server running on http://localhost:3000"
    );

});