# [Debugging JavsScript Applications](https://app.pluralsight.com/library/courses/javascript-debugging-applications/table-of-contents)
*by [Maaike van Putten](https://nl.linkedin.com/in/maaikevanputten)*

> [Certificate](https://app.pluralsight.com/achievements/share/8a2fd209-acc1-4254-b27e-717eed838b2c).

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
 - Browser compatibility[^1]
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

### Failed Requests

- Aproach to solving
    * Chech the console firts
    * Navigate to network panel
    * Inspect Failed requests
    * Fix the problem

### Failed Imports

> They often occur due to :
    - Incorrect paths
    - Not available or installed modules (nmp install) 
    - Syntax errors in the imported modules   
    

  * Scenario: After importing a module, our application is broken
      * Aproach to solving
          * Check the console
          * Check the import in our code
          * See if the module is available
          * Fix the problem

### Problems with UI Events

 * Scenario: Button is not working
    * Aproach to solving
        * Check the event listener in the Element panel
        * Additionally, check the console and sources
        * Identify the problem and solve it

### Debugging Callbacks, Promises and State

 * Scenario: Fetching skills and assume a value in .then block gets set
    * Aproach to solving
        * Check the panels
        * Identify the problem and solve it

### Debugging Async/Await issues

- Common Issues
    - Unhandled rejections
    - Unresolved promises
    - Problems with the sync code surrounding the async/await 

 * Scenario: Skills are not loading as they should
    * Aproach to solving
        * Check the console panel
        * Use the sources panel and set breackpoints
            * Once the breakpoints are set, we're going to reload, and it will pause the execution at those breakpoints. That allows us to step through, and we can inspect our variables and, in this way, identify and solve the problem

***

<dl>
  <dt>Summary:</dt>
<br>
  <dd>Many common bugs.</dd>
  <dd>Using Chrome DevTools for frontend.</dd>
  <dd>Using VS Code for backend and other scripts.</dd>
  <dd>Debugging happens throughout the entire software lifecycle.</dd>
</dl>

***

## Final Points:

- VS Code and Chrome DevTools comparison
- Best practices for debugging

***

[^1]: [Compatibility](https://caniuse.com/)
