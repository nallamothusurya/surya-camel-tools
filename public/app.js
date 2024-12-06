const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const borderSize = document.getElementById("borderSize");
const controls = document.getElementById("controls");
const downloadButton = document.getElementById("downloadButton");

imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.style.display = "block";
      controls.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

borderSize.addEventListener("input", () => {
  preview.style.borderWidth = `${borderSize.value}px`;
});

downloadButton.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width + borderSize.value * 2;
    canvas.height = img.height + borderSize.value * 2;
    ctx.fillStyle = "white"; // Border color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, borderSize.value, borderSize.value);
    const link = document.createElement("a");
    link.download = "image_with_border.png";
    link.href = canvas.toDataURL();
    link.click();
    uploadToGoogleDrive(link.href);
  };
  img.src = preview.src;
});

function uploadToGoogleDrive(dataUrl) {
  // Send the image data to the server for uploading to Google Drive
  fetch("/upload", {
    method: "POST",
    body: JSON.stringify({ image: dataUrl }),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => alert(`Image uploaded: ${data.fileUrl}`))
    .catch((err) => console.error("Upload failed", err));
}
