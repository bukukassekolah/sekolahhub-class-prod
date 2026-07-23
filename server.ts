import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { QueueProvisioningService } from './src/server/services/QueueProvisioningService';
import { FirestoreService } from './src/server/services/FirestoreService';
import { logger } from './src/server/services/LoggerService';
import { authenticateUser, requireDeveloper } from './src/server/middleware/authMiddleware';

export { authenticateUser, requireDeveloper };


async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes FIRST
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'SekolahHub Class Backend Provisioning Service',
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * Endpoint for Developer Dashboard to fetch all ImplementationRequests safely via Firebase Admin SDK
   */
  app.get('/api/developer/implementation-requests', authenticateUser, requireDeveloper, async (_req, res) => {
    try {
      const requests = await FirestoreService.getAllRequests();
      res.json({
        success: true,
        data: requests,
      });
    } catch (err: any) {
      logger.error('API', `Failed to fetch implementation requests via Admin SDK: ${err.message}`);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  });

  /**
   * Endpoint to trigger queue processing
   */
  app.post('/api/backend/provision/run', async (_req, res) => {
    try {
      logger.info('API', 'Manual provisioning queue trigger received.');
      const result = await QueueProvisioningService.processQueue();
      res.json({
        success: true,
        message: 'Queue processing executed',
        result,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  });

  /**
   * Endpoint to retry failed requests
   */
  app.post('/api/backend/provision/retry', async (_req, res) => {
    try {
      logger.info('API', 'Manual retry failed provisioning trigger received.');
      const result = await QueueProvisioningService.retryFailedProvisioning();
      res.json({
        success: true,
        message: 'Retry provisioning executed',
        result,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  });

  /**
   * Endpoint to inspect provisioning status & logs
   */
  app.get('/api/backend/provision/status', async (_req, res) => {
    try {
      const queuedDocs = await FirestoreService.getQueuedRequests();
      const failedDocs = await FirestoreService.getFailedRequests();
      const recentLogs = logger.getRecentLogs(50);

      res.json({
        success: true,
        summary: {
          queuedCount: queuedDocs.length,
          failedCount: failedDocs.length,
        },
        queuedRequests: queuedDocs.map((d) => ({
          id: d.id,
          requestId: d.requestId,
          schoolName: d.schoolName,
          email: d.email,
          plan: d.plan,
          status: d.status,
          authProvisioning: d.authProvisioning,
          submittedAt: d.submittedAt,
        })),
        failedRequests: failedDocs.map((d) => ({
          id: d.id,
          requestId: d.requestId,
          schoolName: d.schoolName,
          email: d.email,
          errorCode: d.errorCode,
          errorMessage: d.errorMessage,
          failedAt: d.failedAt,
        })),
        logs: recentLogs,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  });

  // Background Queue Poll Interval (every 30 seconds)
  setInterval(() => {
    QueueProvisioningService.processQueue().catch((err) => {
      logger.error('BackgroundWorker', `Queue auto-poll error: ${err.message}`);
    });
  }, 30000);

  // Initial trigger on server startup
  setTimeout(() => {
    QueueProvisioningService.processQueue().catch(() => {});
  }, 3000);

  // Vite Middleware for Development / Static serving for Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SekolahHub Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
