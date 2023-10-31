# [Debugging JavsScript Applications](https://app.pluralsight.com/library/courses/javascript-debugging-applications/table-of-contents)

## Debugging the backend

 - Get VS Code ready for debugging
 - Set breakpoints
 - Step through the code
 - Inspect variables
 - Use logpoints to log messages without stopping the code and auto attach to a process for debugging 

 ## Debugging the frontend

 - Debugging JavaScript in the browser
 - Chrome DevTools
 - Different parts of Chrome DevTools 

    ### Panels (Chrome DevTools)
    - Elements
    - Console
    - Sources
    - Network
    - Performance
    - Memory 
    - Application

## Finding common bugs

 - Reference and type errors 
   * Reference errors
        * Using an identifier that has not  been defined
   * Type errors 
        * Performing an operation that is not available on a certain type. When we misuse a data type.
 - Logical problems
 - Undefined behaviour
 - Browser compatibility
 - Performance, page loading, and timing issues
 - Failed requests to the backend
 - Failed imports
 - Problems with UI events
 - Callbacks, promises, and async/await issues

 ### Fixing a reference and a type error

 - Approach for solving
    * Checking the console
    * Solving the problem

### Logical error

 - Approach for solving
    * Setting breakpoints in the Sources panel of Chrome DevTools
    * And then, inspecting the code's flow and state at each step

 - Clicking a button that doesn't work
    * Approach to solving
        * Elements panel to see event listeners
        * Sources panel as backup plan
        * Fix the code

***
> Resources:

>> [Compatibility](https://caniuse.com/)
