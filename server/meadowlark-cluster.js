const cluster = require('cluster');

function startWorker () {
  const worker = cluster.fork();
  console.log(`new worker initialized with ID: ${worker.id}`);
}

if (cluster.isMaster) {
  require('os').cpus().forEach(startWorker);

  cluster.on('disconnect', (worker) => {
    console.log(`Worker with id: ${worker.id} disconnected.`);
  });
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker with ID: ${worker.id} exited. Code: ${code}, Signal: ${signal}`);
    startWorker();
  });
} else {
  const port = process.env.PORT || 3000;
  require('./meadowlark').listen(port, () => {
    console.log(`A worker with id: ${cluster.worker.id} is listening at port: ${port}`);
  });
}
