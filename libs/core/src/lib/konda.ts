import 'reflect-metadata';
import { ServerAdapter } from './server-adapter';

import { IOC } from './ioc';
import { KondaContext } from './konda.context';
import { PluginManager } from './plugin.manager';
import { IKondaContext, IKondaOptions } from './types';

export abstract class Konda {
  protected readonly port: number = Number(process.env.PORT) || 5000;

  private readonly _server: ServerAdapter;
  private readonly _context: IKondaContext;
  private readonly _pluginManager: PluginManager;

  constructor(options: IKondaOptions) {
    this._server = options.server;

    this._context = new KondaContext(options.server, new IOC());
    this._pluginManager = new PluginManager(options.plugins);

    this.initialize();
  }

  public abstract configureServices(services: IOC): Promise<void>;
  public abstract setup(context: IKondaContext): Promise<void>;

  private async initialize() {
    await this.configureServices(this._context.ioc);
    await this._pluginManager.install(this._context);
    await this.setup(this._context);

    if (process.env.NODE_ENV !== 'test') {
      this._server.run(this.port);
    }
  }

  public getContext() {
    return this._context;
  }
}