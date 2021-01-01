var person = {
    firstName  : "John",
    lastName   : "Doe",
    id     : 5566,
    myFunction() {
      return this; 
    }
};
const hobbies = ['khana', 'uthna', 'baithna'];
hobbies.push('jana');

//destructring the object



//will work because array is reference type means hobbies is a pointer so i am changing value at
//pointer not pointer


for (const hobby of hobbies) {
  console.log(hobby);
}


//map to use to go through each elemenr and make the same changes
// to every element but older array remains same it return new array
//syntax :- array.map(function(currentValue, index, arr), thisValue)
 
console.log(hobbies.map((hobby)=> 'hobby: '+ hobby));


//spread operator ...
//to clone same things of object
//it will just copy the things inside the object
//to pull out

const copiedHobbies = [...hobbies];
console.log(copiedHobbies);

//can be used to give arguments in a function
function myFunction(v, w, x, y, z) { }
let args = [0, 1];
myFunction(-1, ...args, 2, ...[3]);



//rest operator for parameters
//args is array here
const toarray = (...args)=>{
  return args;
}

console.log(toarray(1,2,3,4,56,7,89))
//new things 
//1. Synchrounous and asynchrounous code in js
//2. callback and Promise
//3. destructuring the array and objects.
const [hobby1, hobby2] = hobbies;
console.log(hobby1);

const {id} = person;
console.log(id)