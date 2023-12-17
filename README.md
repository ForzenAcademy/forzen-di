# forzen-di

# A simple service locator DI library for JS

### Usage

`DI.provide()` is the function that provides objects into the graph.

`DI.get()` is the function that gets objects from the graph.
Each of these functions can take an optional string name to differentiate between different class types in the graph. The class name of the types must also be added a string due to limitations with JS typing.

`DI.clear()` remove all modules and provided objects from this scope.

`DI.addModule()` adds a module to the graph with the given string name. To reference a module it must be added first.

`DI.scope()` gets a module with the given string name.

These functions return a module that can then be used for DI with `provide`, `get`, `addModule`, `scope` and `clear` calls.
