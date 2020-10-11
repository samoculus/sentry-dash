//const { parse } = require("path");

const stripe = Stripe(publishable_key);
const elements = stripe.elements();

let style = {
    base: {
        iconColor: '#ffffff',
        color: '#ffffff',
        font: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          iconColor: '#ffffff',
          color: '#ffffff',
        },
    },
    invalid: {
        fontFamily: 'Arial, sans-serif',
        color: "#fa755a",
    }
};

document.querySelector("button").disabled = true;

let card = elements.create("card", { style: style });

card.mount("#card-element");

card.addEventListener('change', function({error}){
    displayError(error)
});

card.on('change', function(event) {
    document.querySelector('button').disabled = event.empty;
    document.querySelector('#card-errors').textContent = event.error ? event.error.message : "";
});

let form = document.getElementById('sign-up');

form.addEventListener('submit', (event) => {
  event.preventDefault(); 

let email = document.getElementById('email').value;

stripe.createPaymentMethod({
    type: 'card',
    card: card,
    billing_details: {
        email: email,
    },
    }).then((result) => {
        if (result.error) {
            displayError(result.error);
        } else {
            console.log(result.paymentMethod);
            stripePaymentMethodHandler(result.paymentMethod);
        }
    });
});

// Functions
function stripePaymentMethodHandler(paymentMethod) {
    loading(true);

    fetch('/api/create-customer', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        paymentMethodId: paymentMethod.id,
        last4: paymentMethod.card.last4,
        brand: paymentMethod.card.brand
      }),
    }).then((response) => {
       return response.json();
    }).then((parsedResponse) => {

      if(parsedResponse.error != undefined){
        const error = parsedResponse.error;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
        var cardError = document.getElementById('card-errors');
        cardError.textContent = error;
      } else {
        orderComplete();
      }
    }).catch((err) => {
      console.error('Error creating subscription:', err);
      displayError(err);
    });
};

let loading = function(isLoading) {
    if (isLoading) {
      // Disable the button and show a spinner
      document.querySelector("button").disabled = true;
      document.querySelector("#spinner").classList.remove("hidden");
      document.querySelector("#button-text").classList.add("hidden");
    } else {
      document.querySelector("button").disabled = false;
      document.querySelector("#spinner").classList.add("hidden");
      document.querySelector("#button-text").classList.remove("hidden");
    }
};

let orderComplete = function() {
  loading(false);

  document.querySelector("#sign-up").classList.add("hidden");
  document.querySelector(".result-message").classList.remove("hidden");
  document.querySelector("button").disabled = true;
};

function displayError(error) {
    var cardError = document.getElementById('card-errors');
    cardError.textContent = error ? error.message : '';
};