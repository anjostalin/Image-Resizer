// Hide the Resize By label and dropdown initially
document.getElementById('resizeTypeLabel').style.display = 'none';
document.getElementById('resizeType').style.display = 'none';

document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            document.getElementById('previewImage').setAttribute('src', e.target.result);
            document.getElementById('imageDimensions').innerText = `Dimensions: ${img.width} x ${img.height}`;
            document.getElementById('previewContainer').style.display = 'block';
            document.getElementById('resizeDimensions').style.display = 'block';
            document.getElementById('resizeDimensions2').style.display = 'block';
            document.getElementById('aspectRatioCheckbox').style.display = 'inline-block';
            document.getElementById('resizeButton').style.display = 'inline-block';

            // Display the Resize By label and dropdown after image upload
            document.getElementById('resizeTypeLabel').style.display = 'inline';
            document.getElementById('resizeType').style.display = 'inline';

            // Show Lock Aspect Ratio label
            document.getElementById('aspectRatioLabel').style.display = 'inline';

            // Set initial default values for width and height input boxes
            document.getElementById('widthInput').value = img.naturalWidth;
            document.getElementById('heightInput').value = img.naturalHeight;

            document.getElementById('fileInput').style.display = 'none';

            //window.open('', '_blank');  PLACE YOUR AD OR WEBSITE TO REDIRECT HERE
        }
        img.src = e.target.result;
    }
    reader.readAsDataURL(file);
});

document.getElementById('aspectRatioCheckbox').addEventListener('change', function () {
    //window.open('', '_blank');  PLACE YOUR AD OR WEBSITE TO REDIRECT HERE
    const lockAspectRatio = this.checked;
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    const img = document.getElementById('previewImage');
    const aspectRatio = img.naturalWidth / img.naturalHeight;

    if (lockAspectRatio) {
        widthInput.addEventListener('input', maintainAspectRatio);
        heightInput.addEventListener('input', maintainAspectRatio);
        maintainAspectRatio(); // Trigger initially to set correct values
    } else {
        widthInput.removeEventListener('input', maintainAspectRatio);
        heightInput.removeEventListener('input', maintainAspectRatio);
    }
});

function maintainAspectRatio() {
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    const img = document.getElementById('previewImage');
    const aspectRatio = img.naturalWidth / img.naturalHeight;

    if (document.getElementById('aspectRatioCheckbox').checked) {
        if (widthInput === document.activeElement) {
            // Adjust height based on width and aspect ratio
            heightInput.value = Math.round(widthInput.value / aspectRatio);
        } else if (heightInput === document.activeElement) {
            // Adjust width based on height and aspect ratio
            widthInput.value = Math.round(heightInput.value * aspectRatio);
        } else {
            // If neither width nor height input is active, update width to match aspect ratio
            widthInput.value = Math.round(heightInput.value * aspectRatio);
        }
    }
}

document.getElementById('resizeButton').addEventListener('click', function () {
    const file = document.getElementById('fileInput').files[0];
    const width = parseInt(document.getElementById('widthInput').value);
    const height = parseInt(document.getElementById('heightInput').value);
    const isPercentage = document.getElementById('resizeType').value === 'percentage';

    if (file && ((width && height && !isPercentage) || (isPercentage && (width || height)))) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let targetWidth = width;
                let targetHeight = height;

                if (isPercentage) {
                    let percentage = document.getElementById('percentageInput').value;
                    percentage = percentage / 100;

                    const aspectRatio = img.width / img.height;

                    // Calculate target dimensions using factors
                    targetWidth = Math.round(img.width * percentage);
                    targetHeight = Math.round(img.height * percentage);
                }

                canvas.width = targetWidth;
                canvas.height = targetHeight;

                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

                const resizedDataURL = canvas.toDataURL('image/jpeg');

                const link = document.createElement('a');
                link.href = resizedDataURL;
                link.download = 'resized_image.jpg';
                link.click();
                //window.open('', '_blank');  PLACE YOUR AD OR WEBSITE TO REDIRECT HERE
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(file);
    } else {
        alert('Please select an image and provide valid width and height.');
        //window.open('', '_blank');  PLACE YOUR AD OR WEBSITE TO REDIRECT HERE
    }
});

document.getElementById('resizeType').addEventListener('change', function () {
    //window.open('', '_blank');  PLACE YOUR AD OR WEBSITE TO REDIRECT HERE
    const resizeType = this.value;
    if (resizeType === 'dimensions') {
        document.getElementById('resizeDimensions').style.display = 'block';
        document.getElementById('resizeDimensions2').style.display = 'block';
        document.getElementById('resizePercentage').style.display = 'none';
        document.getElementById('aspectRatioCheckbox').style.display = 'inline-block'; // Show aspect ratio checkbox
        document.getElementById('aspectRatioLabel').style.display = 'inline-block'; // Show aspect ratio label
    } else {
        document.getElementById('resizeDimensions').style.display = 'none';
        document.getElementById('resizeDimensions2').style.display = 'block';
        document.getElementById('resizePercentage').style.display = 'block';
        document.getElementById('aspectRatioCheckbox').style.display = 'none'; // Hide aspect ratio checkbox
        document.getElementById('aspectRatioLabel').style.display = 'none'; // Hide aspect ratio label
    }
});

function updatePreviewSize(width, height) {
    const img = document.getElementById('previewImage');
    img.style.width = width + 'px';
    img.style.height = height + 'px';
}