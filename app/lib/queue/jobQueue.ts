// /app/lib/queue/jobQueue.ts
type Job = () => Promise<void>;

const queue: Job[] = [];
let isRunning = false;

export function enqueue(job: Job) {
  queue.push(job);
  runQueue();
}

async function runQueue() {
  if (isRunning) return;
  isRunning = true;

  while (queue.length > 0) {
    const job = queue.shift();
    if (!job) continue;

    try {
      await job();
    } catch (err) {
      console.error("[Queue] Job failed:", err);
      // Optional: requeue or store error
    }
  }

  isRunning = false;
}
