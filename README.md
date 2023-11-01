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

### Performance Issues

- Various reasons
- Inefficient code
- Unnecessary computations
- Memory leaks

    * Happens when our program holds onto memory that is no longer needed.
    * In JS it often happens because objects have a reachable reference, and the garbage collector cannot reclaim the memory.
        * Garbage Collector: 
            * algorithm that runs and cleans up objects that are no longer used.
            * Objects are no longer used, if there are no references to this object.
            * In JS, memory is automatically allocated when things are created like objects, arrays, variables, etc. But it does not automatically gets deallocated when it's no longer needed.
            * This is what the Garbage Collector does. It takes care of deallocation. 

            > When an object or a variable is no longer reachable, meaning that there is no way for the rest of the code to access or use it, it's considered garbage. So, this garbage on the memory is removed by the garbage collector. It's its job to periodically check for this garbage and deallocate the memory that was used to store it. This prevents memory leaks and helps ensure the efficient use of memory in our applications. So, when references are held unnecessary, over time, these leaks can cause the app to slow down and eventually crash as they accumulate and consume more and more memory. And that's simply because the garbage collector cannot remove it when there is an unnecessary reference to it. 
    
    * Scenario: Our app is running slower than expected
        * Aproach to solving
            * Suspecting a memory leak or inefficient function
            * We'll use the performance and memory panels for debugging

### Page Loading and Timing Issues

- Resource‑heavy applications where loading large files like images or videos can cause significant slowdowns 
    * (we could opt to compress the image or if we need it in its size, we could load it asynchronously to enhance the page load speed)
- Server delays, or inefficient load order
- Network panel can be used to inspect
    > We can use the Network tab to inspect the load times of different resources

    * Scenario: Sudden increase of the loading time
        * Aproach to solving
            * Network panel
            * Reproduce the problem
            * Disable cache
            * See the network requests 
            * Identify and fix the problems

### Failed requests

- Aproach to solving
    * Chech the console firts
    * Navigate to network panel
    * Inspect Failed requests
    * Fix the problem

***
> Resources:

>> [Compatibility](https://caniuse.com/)
