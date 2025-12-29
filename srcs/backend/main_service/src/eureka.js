const { Eureka } = require("eureka-js-client");

function startEureka({ appName, port }) {
  const client = new Eureka({
    instance: {
      app: appName.toUpperCase(),
      hostName: process.env.HOSTNAME || "localhost",
      ipAddr: process.env.HOST_IP || "127.0.0.1",
      statusPageUrl: `http://${process.env.HOSTNAME || "localhost"}:${port}/info`,
      healthCheckUrl: `http://${process.env.HOSTNAME || "localhost"}:${port}/api/health`,
      port: {
        $: port,
        "@enabled": true
      },
      vipAddress: appName,
      dataCenterInfo: {
        "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
        name: "MyOwn"
      }
    },
    eureka: {
      serviceUrls: {
        default: [process.env.EUREKA_URL]
      }
    }
  });

  client.start((error) => {
    if (error) {
      console.error("❌ Eureka registration failed", error);
    } else {
      console.log(`✅ Registered with Eureka as ${appName}`);
    }
  });

  return client;
}

module.exports = startEureka;
