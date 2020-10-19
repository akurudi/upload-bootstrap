$(document).ready(function () {
  getImages();
  $("input:file").change(handleFileChange);
  $("#uploadForm").submit(handleUpload);
});
function getImages() {
  fetch("https://h04op1jbs4.execute-api.us-west-2.amazonaws.com/files")
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      renderImgList(result);
    })
    .catch((error) => console.log("error", error));
}

function renderImgList(result) {
  let imageList = $("#imageList");
  let listItems = result.map((image) => {
    return `
    <div class="list-group-item justify-content-between">
      <div class="row">
        <div class="col-auto">${image.Key}</div>
        <div class="col-2">
          <img src="https://s3-us-west-1.amazonaws.com/anukurudi.com/${image.Key}" alt="${image.name}" class="img-thumbnail">
        </div>
        <div class="col-auto">
          <a href="https://s3-us-west-1.amazonaws.com/anukurudi.com/${image.Key}" target="_blank">
            <img src="/images/box-arrow-up-right.svg" alt="" width="32" height="32" title="Bootstrap">
          </a>
        </div>
        <div class="col-auto">
          <input type="image" src="/images/trash.svg" onClick="handleDelete('${image.Key}')">
        </div>
      </div>
    </div>
    `;
  });
  imageList.html(listItems);
}

function handleDelete(key) {
  let deleteData = {
    key: key,
  };
  fetch("https://h04op1jbs4.execute-api.us-west-2.amazonaws.com/files", {
    method: "DELETE",
    body: JSON.stringify(deleteData),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .then(() => getImages())
    .catch((err) => console.log(err));
}

function handleFileChange(e) {
  var file = $("input:file")[0].files[0];
  $("#fileName").val(file.name);
  $("#fileNameDiv").show();
}

function handleUpload(e) {
  e.preventDefault();
  var file = $("input:file")[0].files[0];
  var fileName = $("#fileName").val()
    ? $("#fileName").val()
    : $("input:file")[0].files[0].name;
  getBase64(file).then((data) => {
    let postData = {
      file: data,
      name: fileName,
    };
    fetch("https://h04op1jbs4.execute-api.us-west-2.amazonaws.com/files", {
      method: "POST",
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .then(() => getImages())
      .catch((err) => console.log(err));
  });
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => {
      let binaryString = event.target.result;
      resolve(btoa(binaryString));
    };
    reader.onerror = (error) => reject(error);
  });
}
