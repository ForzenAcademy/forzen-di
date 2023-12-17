const GLOBAL_NAME_KEY = '___GLOBAL___';

type KeyMap = {
  [key: string]: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [innerKey: string]: any;
  };
};

class ScopedProvider {
  private objectMap: KeyMap = {};
  private scopeMap: { [key: string]: ScopedProvider } = {};

  /**
   * Add a new module to the current scope with the given name.
   *
   * @param name The name of the new module to add
   * @param overwrite Whether the module should be overwritten if it exists
   */
  public addModule(name: string, overwrite: boolean = false): ScopedProvider {
    if (!overwrite && name in this.scopeMap) {
      throw `Attempting to create scope '${name}' that already exists in this scope!`;
    }
    this.scopeMap[name] = new ScopedProvider();
    return this.scopeMap[name];
  }

  /**
   * Find a scope from the current scope with the given name argument. This function
   * will return that scope or throw if a scope with the given name does not exist
   * from the current scope.
   *
   * @param name The name of the scope to look for in the graph
   * @returns The scope object named with the given name from the current scope,
   * or throws if it is not able to be found
   */
  public scope(name: string): ScopedProvider {
    if (!(name in this.scopeMap)) {
      throw `Attempting to access scope '${name}' that does not exist in this scope!`;
    }
    return this.scopeMap[name];
  }

  /**
   * Provide an object into the current scope with the given class name and optional
   * string name that is used to differentiate between multiple provided objects of the same
   * class type.
   * @param obj The object to provide
   * @param className A string representation of the class name of the object
   * @param name An optional name for the object to differentiate between multiple
   * provided objects of the name class type.
   */
  public provide<T>(obj: T, className: string, name?: string) {
    if (!(className in this.objectMap)) {
      this.objectMap[className] = {};
    } else {
      // In here, we know we have multiples of the same class
      if ((name ?? GLOBAL_NAME_KEY) in this.objectMap[className]) {
        throw 'Two objects with the same class type and key name were provided in this scope!';
      }
    }
    this.objectMap[className][name ?? GLOBAL_NAME_KEY] = obj;
  }

  /**
   * Get an injectable object from the DI graph. Required is the name of
   * the class as a string and the optional name that would have been given
   * as the class was provided to differentiate two of the same class types in the graph.
   *
   * @param className The string name of the class you want to inject
   * @param name The optional name to differentiate two of the same provided class types
   * @returns The found object in the DI graph, or throws
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public get(className: string, name?: string): any {
    const value = this.objectMap[className][name ?? GLOBAL_NAME_KEY];
    if (value === undefined)
      throw 'Could not find the object with the given name in the current scope!';
    return value;
  }

  /**
   * Clear the provided objects and scopes from this ScopedProvider
   */
  public clear() {
    this.objectMap = {};
    this.scopeMap = {};
  }
}

export class DI {
  private static _global = new ScopedProvider();

  /**
   * Add a new module to the current scope with the given name.
   *
   * @param name The name of the new module to add
   * @param overwrite Whether the module should be overwritten if it exists
   */
  static addModule(name: string, overwrite: boolean = false): ScopedProvider {
    return DI._global.addModule(name, overwrite);
  }

  /**
   * Find a scope from the current scope with the given name argument. This function
   * will return that scope or throw if a scope with the given name does not exist
   * from the current scope.
   *
   * @param name The name of the scope to look for in the graph
   * @returns The scope object named with the given name from the current scope,
   * or throws if it is not able to be found
   */
  static scope(name: string): ScopedProvider {
    return DI._global.scope(name);
  }

  /**
   * Provide an object into the current scope with the given class name and optional
   * string name that is used to differentiate between multiple provided objects of the same
   * class type.
   * @param obj The object to provide
   * @param className A string representation of the class name of the object
   * @param name An optional name for the object to differentiate between multiple
   * provided objects of the name class type.
   */
  static provide<T>(obj: T, className: string, name?: string) {
    DI._global.provide(obj, className, name);
  }

  /**
   * Get an injectable object from the DI graph. Required is the name of
   * the class as a string and the optional name that would have been given
   * as the class was provided to differentiate two of the same class types in the graph.
   *
   * @param className The string name of the class you want to inject
   * @param name The optional name to differentiate two of the same provided class types
   * @returns The found object in the DI graph, or throws
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static get(className: string, name?: string): any {
    return DI._global.get(className, name);
  }

  /**
   * Clear the DI graph
   */
  public static clear() {
    DI._global = new ScopedProvider();
  }
}
