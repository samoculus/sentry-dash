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

document.getElementById('email-btn').disabled = true;
document.getElementById('payment-btn').disabled = true;

let card = elements.create("card", { style: style });
let emailInput = document.getElementById('email-input');

card.mount("#card-element");

card.addEventListener('change', function({error}){
    displayError(error)
});

emailInput.addEventListener('input', function(){
    if (emailInput.value.length > 0) {
        document.getElementById('email-btn').disabled = false;
    } else { 
        document.getElementById('email-btn').disabled = true;
    }
});

card.on('change', function(event) {
    document.getElementById('payment-btn').disabled = event.empty;
    document.querySelector('#card-errors').textContent = event.error ? event.error.message : "";
});

let form = document.getElementById('update-payment');

form.addEventListener('submit', (event) => {
    event.preventDefault(); 
  
  let email = document.getElementById('user-email').value;
  
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
function displayError(error) {
    var cardError = document.getElementById('card-errors');
    cardError.textContent = error ? error.message : '';
};

function stripePaymentMethodHandler(paymentMethod) {
    loading(true);

    fetch('/api/account/update-payment', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: document.getElementById('user-email').value,
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
        card.clear()
        var cardError = document.getElementById('card-errors');
        cardError.textContent = error;
      } else {
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
        card.clear()
        var cardSuccess = document.getElementById('card-success');
        cardSuccess.innerHTML = 'Success. Payment method updated!';    
      }
    }).catch((err) => {
      console.error('Error creating subscription:', err);
      displayError(err);
    });
};

let loading = function(isLoading) {
    if (isLoading) {
      // Disable the button and show a spinner
      document.getElementById('payment-btn').disabled = true;
      document.querySelector("#spinner").classList.remove("hidden");
      document.querySelector("#button-text").classList.add("hidden");
    } else {
      document.getElementById('payment-btn').disabled = false;
      document.querySelector("#spinner").classList.add("hidden");
      document.querySelector("#button-text").classList.remove("hidden");
    }
};