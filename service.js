const Service = require('node-windows').Service;

// Create a new service object
const svc = new Service({
  name: 'carjunk',
  description: 'Next.js and Node.js app running as Windows service',
  script: 'C:\\carjunk\\CAR_JUNK\\server.js' // Path to your main Node.js app file (adjust as needed)
});

// Listen for the "install" event, which indicates the process is available as a service.
svc.on('install', () => {
  svc.start();
  console.log('Service installed and started!');
});

// Install the service
svc.install();
