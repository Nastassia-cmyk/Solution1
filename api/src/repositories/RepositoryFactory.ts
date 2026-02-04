import { ITaskRepository } from './TaskRepository';
import { InMemoryTaskRepository } from './InMemoryTaskRepository';
import { JsonTaskRepository } from './JsonTaskRepository';

/**
 * Factory for creating TaskRepository instances
 * Instantiates the appropriate repository implementation based on environment configuration
 * 
 * Environment variable: TASK_REPO
 * - "memory" (default): In-memory storage using Maps (data lost on restart)
 * - "json": Persistent JSON file storage at api/data/tasks.json
 */
export class RepositoryFactory {
  /**
   * Create and return a TaskRepository instance based on configuration
   * 
   * @param repoType - Optional override for repository type ("memory" or "json")
   * @returns Configured repository instance
   * @throws Error if invalid repository type is specified
   */
  static createRepository(repoType?: string): ITaskRepository {
    const type = repoType || process.env.TASK_REPO || 'memory';
    
    switch (type.toLowerCase()) {
      case 'memory':
        console.log('[Repository] Using InMemoryTaskRepository');
        return new InMemoryTaskRepository();
      
      case 'json':
        console.log('[Repository] Using JsonTaskRepository');
        return new JsonTaskRepository();
      
      default:
        throw new Error(
          `Invalid TASK_REPO value: "${type}". Must be "memory" or "json".`
        );
    }
  }
}
