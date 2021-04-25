import { Konda, AppContext, IOC } from '@konda/core'
import { json } from 'express'
import { UserService } from './user.service'
import { AuthService } from './auth.service'
import { NestedService } from './nested.service'

import './app.controller'
import './user.controller'

export class Application extends Konda {
  protected async configureServices(services: IOC) {
    services.setDefaultScope('singleton')

    services.register(AuthService)
    services.register(UserService)
    services.register(NestedService)
  }

  protected async setup(context: AppContext) {
    console.log(context.ioc)
    context.server.use(json())
  }
}
