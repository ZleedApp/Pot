import Status from '../enum/status';
import Method from '../enum/method';

interface OpenApi {
  paths: PathSpec;
  schemas: { [key: string]: OpenApiSchema };
}

interface OpenApiRes {
  description: string;
  content: {
    [key: string]: {
      schema: {
        $ref: string;
      };
    };
  };
}

interface PathSpec {
  [path: string]: {
    description: string;
    responses: { [key: string]: OpenApiRes };
  };
}

interface OpenApiSchema {
  type: 'string' | 'integer' | 'boolean' | 'object' | 'array';
  properties?: { [key: string]: OpenApiSchema } | { $ref: string };
  items?: OpenApiSchema | { $ref: string };
}

class OpenApiBuilder {
  private _methods: { [key: string]: OpenApiMethod } = {};
  private _schemas: { [key: string]: OpenApiSchema } = {};

  constructor() {}

  addMethod(method: Method, spec: OpenApiMethod): OpenApiBuilder {
    this._methods[method.toLowerCase()] = spec;
    return this;
  }

  build(): OpenApi {
    const paths: PathSpec = {};
    const schemas: { [key: string]: OpenApiSchema } = {};

    Object.entries(this._methods).forEach(
      ([key, method]: [string, OpenApiMethod]) => {
        paths[key] = method.build();

        const methodSchemas = method.collectSchemas();

        Object.assign(schemas, methodSchemas);
      }
    );

    return {
      paths,
      schemas
    };
  }
}

class OpenApiMethod {
  private _description?: string;
  private _responses: { [key: string]: OpenApiResponse<unknown> } = {};

  constructor() {}

  description(description: string): OpenApiMethod {
    this._description = description;
    return this;
  }

  addResponse(code: Status, response: OpenApiResponse<unknown>): OpenApiMethod {
    this._responses[code.toString()] = response;
    return this;
  }

  build(): { description: string; responses: { [key: string]: OpenApiRes } } {
    const responses: { [key: string]: OpenApiRes } = {};

    Object.entries(this._responses).forEach(
      ([key, response]: [string, OpenApiResponse<unknown>]) => {
        responses[key] = response.build();
      }
    );

    return {
      description: this._description || '',
      responses
    };
  }

  collectSchemas(): { [key: string]: OpenApiSchema } {
    const schemas: { [key: string]: OpenApiSchema } = {};

    Object.values(this._responses).forEach(
      (response: OpenApiResponse<unknown>) => {
        const schema = response.buildSchema();

        if (schema && response.getName()) {
          schemas[response.getName()!] = schema;
        }
      }
    );

    return schemas;
  }
}

class OpenApiResponse<T> {
  private _description?: string;
  private _name?: string;
  private _schema?: OpenApiSchema;
  private _type?: 'application/json' | 'text/plain';

  constructor() {}

  description(description: string): OpenApiResponse<T> {
    this._description = description;
    return this;
  }

  name(name: string): OpenApiResponse<T> {
    this._name = name;
    return this;
  }

  type(type: 'application/json' | 'text/plain'): OpenApiResponse<T> {
    this._type = type;

    return this;
  }

  schema(schema: OpenApiSchema): OpenApiResponse<T> {
    this._schema = schema;
    return this;
  }

  build(): OpenApiRes {
    const res: OpenApiRes = {
      description: this._description || '',
      content: {}
    };

    res.content[this._type || 'application/json'] = {
      schema: {
        $ref: `#/components/schemas/${this._name!}`
      }
    };

    return res;
  }

  buildSchema(): OpenApiSchema {
    return this._schema || { type: 'object' };
  }

  getName(): string | undefined {
    return this._name;
  }
}

export { OpenApiBuilder, OpenApiMethod, OpenApiResponse };
export type { OpenApi, OpenApiSchema };
