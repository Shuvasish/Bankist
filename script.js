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
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
const account5 = {
  owner: 'Shuvasish Talukder Shuvo',
  movements: [14000, -2000, -4500, 700, 50, 90],
  interestRate: 1.4,
  pin: 5555,
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

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
    // console.log(html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = (movements, intRate) => {
  const income = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;
  const out = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * intRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
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
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc.movements, currentAccount.interestRate);
};
//event listender
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    //clear input

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // inputLoginUsername.focus();
    //displaying movments
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
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
    console.log(amount, receiveAcc);
    currentAccount.movements.push(-amount);
    //update user interface
    receiveAcc.movements.push(amount);
    //update ui
    updateUI(currentAccount);
    inputTransferAmount.blur();
  }
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
