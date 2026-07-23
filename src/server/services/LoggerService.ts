export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  requestId?: string;
  step: string;
  message: string;
  details?: any;
}

class LoggerService {
  private logs: LogEntry[] = [];
  private maxLogs = 500;

  public log(level: 'INFO' | 'WARN' | 'ERROR', step: string, message: string, requestId?: string, details?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      step,
      message,
      requestId,
      details,
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    const reqTag = requestId ? `[Req: ${requestId}]` : '';
    console.log(`[${entry.timestamp}] [PROVISION:${level}] ${reqTag} [${step}] ${message}`, details || '');
  }

  public info(step: string, message: string, requestId?: string, details?: any) {
    this.log('INFO', step, message, requestId, details);
  }

  public warn(step: string, message: string, requestId?: string, details?: any) {
    this.log('WARN', step, message, requestId, details);
  }

  public error(step: string, message: string, requestId?: string, details?: any) {
    this.log('ERROR', step, message, requestId, details);
  }

  public getRecentLogs(limit = 100): LogEntry[] {
    return this.logs.slice(0, limit);
  }

  public clearLogs() {
    this.logs = [];
  }
}

export const logger = new LoggerService();
