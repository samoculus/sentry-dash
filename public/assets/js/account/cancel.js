let modal = document.getElementById('cancel-modal');
let openModal = document.getElementById('open-modal');
let closeModal = document.getElementsByClassName('close-modal')[0];
let cancel_status = document.getElementById('cstatus').value;

openModal.onclick = () => {
    modal.style.display = 'block';
};

closeModal.onclick = () => {
    modal.style.display = 'none';
};

// Close modal when user clicks anywhere outside of it.
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
};

if ( cancel_status == "true" ) {
    document.getElementById('subscribed').classList.add("hidden");
    document.getElementById('resubscribe').classList.remove("hidden");
};
