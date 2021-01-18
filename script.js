'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-01-13T14:43:26.374Z',
    '2021-01-17T18:49:59.371Z',
    '2021-01-18T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90, -33, 222, 33],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2021-01-18T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account5 = {
  owner: 'Shuvasish Talukder Shuvo',
  movements: [14000, -2000, -4500, 700, 50, 90, 3, 4444],
  interestRate: 1.4,
  pin: 5555,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2021-01-13T14:43:26.374Z',
    '2021-01-17T18:49:59.371Z',
    '2021-01-18T12:01:20.894Z',
  ],
  currency: 'BDT',
  locale: 'bn-bd',
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const formatMovmentdate = function (date, local) {
  const calcDaysPassed = function (date1, date2) {
    return Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  };
  const daysPassed = calcDaysPassed(date, new Date());
  if (daysPassed === 0) return 'Today';

  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(local).format(date);
  // else {
  //   // console.log(daysPassed);
  //   // const day = `${date.getDate()}`.padStart(2, 0);
  //   // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  //   // const year = date.getFullYear();

  //   // return `${day}/${month}/${year}`;
  // }
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    // console.log(date);
    const displayDate = formatMovmentdate(date, acc.locale);
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
    // console.log(html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = acc => {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income.toFixed(2)}€`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsers = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(n => n[0])
      .join('');
  });
};

createUsers(accounts);

// ----------------------------------------------
const eurToUSD = 1.1;
const totalDipositesUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUSD)
  .reduce((acc, mov) => acc + mov);
const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};
//event listender
//experment

//fake login
let currentAccount;
// currentAccount = account5;
// updateUI(currentAccount);

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    //clear input

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // inputLoginUsername.focus();
    //displaying movments
    const now = new Date();
    const option = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    const locale = Navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      option
    ).format(now);
    // containerApp.style.opacity = 1;
    //     const day = `${now.getDate()}`.padStart(2, 0);
    //     const month = `${now.getMonth() + 1}`.padStart(2, 0);
    //     const year = now.getFullYear();
    //     const hour = `${now.getHours() % 12}`.padStart(2, 0);
    //     const min = `${now.getMinutes()}`.padStart(2, 0);
    //     const aMpM = now.getHours() > 12 ? 'PM' : 'AM';
    // console.log(now.getHours());

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiveAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  inputTransferTo.value = inputTransferAmount.value = '';
  if (
    amount > 0 &&
    receiveAcc &&
    amount <= currentAccount.balance &&
    receiveAcc?.userName !== currentAccount.userName
  ) {
    //doing the transfer of money
    // console.log(amount, receiveAcc);
    currentAccount.movements.push(-amount);
    //update user interface
    receiveAcc.movements.push(amount);
    //update time
    currentAccount.movementsDates.push(new Date().toISOString());
    receiveAcc.movementsDates.push(new Date().toISOString());
    //update ui
    updateUI(currentAccount);
    inputTransferAmount.blur();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // console.log('granted');
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const user = inputCloseUsername.value;
  const pin = +inputClosePin.value;
  inputCloseUsername.value = inputClosePin.value = '';
  if (user === currentAccount.userName && pin === currentAccount.pin) {
    console.log('deleted');
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    console.log(index);
    accounts.splice(index, 1);
    //hiding ui
    containerApp.style.opacity = 0;
  }
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// const deposits = movements.filter(mov => mov > 0);
// const withdrawals = movements.filter(mov => mov < 0);
// console.log(movements);
// console.log(deposits);
// console.log(withdrawals);

// const balance = movements.reduce((acc, cur, i, arr) => acc + cur, 0);
// console.log(balance);

// const eurToUsd = 1.1;
// const movementsUSD = movements.map(mov => Math.round(mov * eurToUsd));
// console.log(movementsUSD);
// account4.forEach(function (i) {
//   console.log(i);
// });
// for (const i of account4.entries()) {
//   console.log(i);
// }
// Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// § Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
// const checkDogs = function (dogsJulia, dogsKate) {
//   // console.log(dogsJulia, dogsKate);

//   const showData = function (dogList) {
//     console.log(`new one`);
//     dogList.forEach(function (dogAge, index) {
//       const type = dogAge < 3 ? 'puppy' : 'adult';
//       // console.log(dogAge, type);
//       if (dogAge < 3) {
//         console.log(`Dog number ${index + 1} is still a puppy 🐶`);
//       } else {
//         console.log(
//           `Dog number ${index + 1} is an adult, and is ${dogAge} years old`
//         );
//       }
//     });
//   };
//   showData(dogsJulia);
//   showData(dogsKate);
// };

// const juliasData = [3, 5, 2, 12, 7];
// const katesData = [4, 1, 15, 8, 3];
// const juliasDataTwo = [9, 16, 6, 8, 3];
// const katesDataTwo = [10, 5, 6, 1, 4];
// const updatedJuliasData = juliasData.slice();
// // console.log(updatedJuliasData.splice(1, 2));
// //"Dog number 1 is an adult, and is 5 years old"
// //Dog number 2 is still a puppy 🐶
// checkDogs(updatedJuliasData.splice(1, 2), katesData);
// checkDogs(juliasDataTwo, katesDataTwo);
// checkDogs(updatedJuliasData.splice(1, 2),katesData)
// console.log(juliasData);
// chal - 2;
// const mo = movements.reduce((bg, cur) => (bg < cur ? cur : bg), movements[0]);
// console.log(mo);

// const dogData = [5, 2, 4, 1, 15, 8, 3];
// const dogDataTwo = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanAge = data => {
//   const avg = data
//     .map(age => (age < 3 ? age * 2 : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, cur, i, arr) => (acc += cur / arr.length), 0);

//   return Math.round(avg);
// };
// // const adultDog = ;

// // const avgAge = adultDog.reduce((acc, cur) => acc + cur, 0) / adultDog.length;
// console.log(calcAverageHumanAge(dogData));
// console.log(calcAverageHumanAge(dogDataTwo));
//cl3
// console.log(movements.find(mov => mov > 0));

// const account = accounts.find(
//   arr => arr.owner.toLowerCase() === 'Shuvasish Talukder Shuvo'.toLowerCase()
// );
// console.log(account);

// const acc = function (accounts) {
//   for (const tar of accounts) {
//     // console.log(tar.owner);
//     if (tar.userName === 'js') {
//       // console.log('mt');

//       return tar;
//     }
//   }
// };
// console.log(acc(accounts));
// const arr = [[2, 3, 4], [2, 3], 4, 5];
// console.log(arr.flat());
// const allbal = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((mov, cur) => mov + cur, 0);
// console.log(allbal);
// const arr2 = [[2, 3], [1, 2], 2];
// console.log(arr2.flatMap(a => a));

// const arr = ['shuvo', 'dipu', 'topu'];
// const arr2 = [1, 4, 3, 1, 2];
// console.log(arr.sort());
// console.log(arr2.map(a => a).sort(1));
// console.log(arr, arr2);
// console.log(movements.sort());

// arr2.sort((a, b) => {
//   console.log(a, b);
//   return b - a;
// });

// console.log(arr2);

// const arr = ['32', '222', '52', '0', '-33', '-555', 3];
// arr.sort((a, b) => a - b);
// console.log(...arr);
// const x = new Array(7, 3);
// console.log(x);
// const diceRoll = Array.from({ length: 200 }, (_, i) =>
//   Math.floor(Math.random() * 6 + 1)
// );
// console.log(...diceRoll);

// labelBalance.addEventListener('click', function () {
//   const movUI = Array.from(document.querySelectorAll('.movements__value'), el =>
//     Number(el.textContent.replace('€', ''))
//   );
//   console.log(movUI.reduce((acc, cur) => acc + cur));
// });
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];
// //chal-1
// dogs.forEach(function (dog) {
//   // console.log(dog);
//   dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
//   // console.log(dog.recommendedFood);
// });
// //chal-2
// const sarah = dogs.find(dog => {
//   // console.log(dog.owners);
//   return dog.owners.includes('Sarah');
// });
// const footCalc = function (obj) {
//   if (obj.curFood > obj.recommendedFood * 0.9) {
//     console.log('it is eating to much');
//   } else if (obj.curFood < obj.recommendedFood * 1.1) {
//     console.log('it is eating to little');
//   } else {
//     console.log('its under control');
//   }
// };
// footCalc(sarah);

// console.log(sarah);
// // chal-3
// const ownerEatTooMuch = dogs.filter(
//   dog => dog.recommendedFood + dog.recommendedFood * 0.1 < dog.curFood
// );
// const ownerEatTooLittle = dogs.filter(
//   dog => dog.recommendedFood - dog.recommendedFood * 0.1 > dog.curFood
// );
// console.log(ownerEatTooMuch);
// console.log(ownerEatTooLittle);
// //chal-4

// const displaySumMuch = function (obj) {
//   const temp2 = obj
//     .map(arr => {
//       return arr.owners;
//     })
//     .flat();
//   console.log(`${temp2.join(' and ')}'s dog eat too much`);
// };
// displaySumMuch(ownerEatTooMuch);
// const displaySumLittle = function (obj) {
//   const temp2 = obj
//     .map(arr => {
//       return arr.owners;
//     })
//     .flat();
//   console.log(`${temp2.join(' and ')}'s dog eat too Little`);
// };
// displaySumLittle(ownerEatTooLittle);

// //chal-5
// console.log(dogs.some(dog => dog.recommendedFood === dog.curFood));
// //chal-6
// const dl = function (doi) {
//   return (
//     doi.curFood > doi.recommendedFood * 0.9 &&
//     doi.curFood < doi.recommendedFood * 1.1
//   );
// };
// console.log(dogs.some(dl));

// //chal-7
// console.log(dogs.filter(dl));
// const sorteded = dogs.slice().sort((a, b) => {
//   return a.recommendedFood - b.recommendedFood;
// });
// console.log(dogs);
// console.log(sorteded);
// a = {name : 'shuvo',
//   phone: 199989}
// console.log(0.1 + 0.2);
// document
//   .querySelector('.balance__value')
//   .addEventListener('click', function () {
//     const temp = [...document.querySelectorAll('.movements__row')].forEach(
//       (row, i) => {
//         if (i % 2 === 0)
//           (row.style.backgroundColor = 'orangered'),
//             (row.style.color = 'white');
//         if (i % 3 === 0)
//           (row.style.backgroundColor = 'blue'), (row.style.color = 'white');
//       }
//     );
//   });

// console.log(temp);
// const a = new Date();
// console.log(a);
// console.log(new Date(' Jan 1 0000'));
// console.log(new Date(account1.movementsDates[0]));
// console.log(new Date(1995, 11, 9, 12, 30, 45));
// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));
// console.log(new Date(a));

// const future = new Date(2025, 11, 9, 14, 30);
// console.log(future);
// console.log(future.getFullYear(), future.getMinutes(), future.getMonth());
// const obj = {
//   myName: 'shuvo',
//   age: 12,
// };
// console.log(+new Date() - +new Date(account1.movementsDates[0]));

// const dateCounter = function (dateOne, dateTwo) {
//   const diff = dateTwo - dateOne;
//   console.log(dateOne);
//   console.log(dateTwo);
//   console.log(diff);
//   const days = Math.abs(diff / (24 * 60 * 60 * 1000));
//   const month = days / 30;
//   const year = month / 12;
//   console.log(days, month, year);
//   return days;
// };
// dateCounter(new Date(2013, 2), new Date());
