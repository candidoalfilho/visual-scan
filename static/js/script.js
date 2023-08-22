const inputCheck = document.querySelector("#modo-noturno");
const elemento = document.querySelector("body");

inputCheck.addEventListener("click", () => {
    const modo = inputCheck.checked ? "dark" : "light";
    elemento.setAttribute("data-bs-theme", modo);
});

document.addEventListener('DOMContentLoaded', function () {
    const cameraFeed = document.getElementById('cameraFeed');
    const captureButton = document.getElementById('captureButton');
    const photoCanvas = document.getElementById('photoCanvas');
    const capturedPhoto = document.getElementById('capturedPhoto');
    const fotoOriginal = document.getElementById('cameraPlaceholder');

    const idade = document.getElementById('ageHolder');
    const genero = document.getElementById('genderHolder');
    const etnia = document.getElementById('raceDiv');


    fotoOriginal.addEventListener('click', () => {
        fotoOriginal.style.display = 'none';
        // Acessar a câmera
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                cameraFeed.srcObject = stream;
            })
            .catch(error => console.error('Erro ao acessar a câmera:', error));
    });

    captureButton.addEventListener('click', () => {
        photoCanvas.width = cameraFeed.videoWidth;
        photoCanvas.height = cameraFeed.videoHeight;
        photoCanvas.getContext('2d').drawImage(cameraFeed, 0, 0, photoCanvas.width, photoCanvas.height);
        capturedPhoto.src = photoCanvas.toDataURL('image/png');
        capturedPhoto.style.display = 'block';

        // Enviar foto para o Flask
        const formData = new FormData();
        formData.append('photo', capturedPhoto.src);
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Resposta do Flask:', data);
            console.log(data['age'])
            idade.innerHTML = "Idade: " + data['age']
            genero.innerHTML = "Gênero: " + data['gender']
            etnia.innerHTML = "Etnia: " + data['race']

        })
        .catch(error => console.error('Erro ao enviar foto:', error));
    });
});
