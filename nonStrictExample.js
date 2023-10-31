"use strict";

function calculateTotal(price, quantity) {
    total = price * quantity;
    return total;
}

let result = calculateTotal(10, 3);
console.log(total); // total instead of result

/* Here we see an example of where we're not using strict mode. 

So, we specify a total without the let keyword and we return the total. We store this in result on line 8. And then in line 9, we try to log total that's out of scope because it's defined inside the function in line 3. 

Since we're not using strict mode, this will actually work. As you can see, it prints 30, which is the value of total.  // output: 30

But let's say that we were calling this function again, and then we store a different value in total. Then the console is going to print something fully different so that's definitely a problem that we want to see. Otherwise, we get some sort of logical error that we don't get instead of a reference error that we would want to get. So as you can see, when we enable strict mode, you see that it says total is not defined on line 3. 
*/
calculateTotal(5, 3);
console.log(total);

/* output: 

    total = price * quantity;
          ^

ReferenceError: total is not defined

*/

/* So, let's start by adding let here and run it again. Again, you will see the total is not defined, but this time on line 8. And this is where we make the actual hiccup we should have resolved here. And then if we run it right now, now it works just fine. And you can see that the value is 30 again. */

/*

And that's one of the reasons why you want to use JavaScript in strict mode because getting a reference error or a type error is actually quite helpful. Without those, we could get a logical problem, and those require a different approach. */

