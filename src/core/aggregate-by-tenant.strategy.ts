import {
  ContextId,
  ContextIdFactory,
  ContextIdResolver,
  ContextIdResolverFn,
  ContextIdStrategy,
  HostComponentInfo,
} from '@nestjs/core';

export class AggregateByTenantContextIdStrategy implements ContextIdStrategy {
  // A collection of context Identifiers representing separate DI subtrees per tenant.
  private readonly tenants = new Map<string, ContextId>();

  attach(
    contextId: ContextId,
    request: Request,
  ): ContextIdResolverFn | ContextIdResolver | undefined {
    const tenantId = request.headers['x-tenant-id'] as string;
    if (!tenantId) {
      // OR log error depending on whatt we want to accomplish
      return () => contextId;
    }

    let tenantSubtreeId: ContextId;
    if (this.tenants.has(tenantId)) {
      tenantSubtreeId = this.tenants.get(tenantId);
    } else {
      // Construct a new contextId for the tenant
      tenantSubtreeId = ContextIdFactory.create();
      this.tenants.set(tenantId, tenantSubtreeId);
    }
    setTimeout(() => this.tenants.delete(tenantId), 3000);

    // const connectionName = `${db_schema_name}_connection`;
    // try {
    //   return getConnection(connectionName);
    // } catch (e) {
    //   const options = Object.assign({}, this.configService.get('DB_INFOS'));
    //   options.name = connectionName;
    //   options.database = `yourdb_${db_schema_name}`;
    //
    //   return await createConnection(options);
    // }
    return {
      payload: { tenantId },
      resolve: (info: HostComponentInfo) =>
        info.isTreeDurable ? tenantSubtreeId : contextId,
    };
  }
}
