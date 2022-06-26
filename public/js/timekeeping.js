function showStartWorkForm(name) {
  const form = document.getElementById("startWorkForm");
  form.innerHTML =
    `<div class="card" style="width: 200px">
    <div class="card-body">
      <p>Họ tên: ` +
    name +
    `</p>
    <form action="/add-timekeeping" method="post">
      <label for="workPlace">Nơi làm:</label>
      <select name="workPlace" id="workPlace" class="form-control" style="width: 150px">
          <option value="Công ty" selected>Công ty</option>
          <option value="Nhà">Nhà</option>
          <option value="Khách hàng">Khách hàng</option>
      </select><br>
      <button type="submit" class="btn btn-primary" >Bắt đầu làm</button>
    </form>
    </div>
  </div>`;
}

function formTemperature() {
  const form = document.getElementById("formTemperature");
  if (form.innerHTML === "") {
    form.innerHTML = `<form action="/registerBodyTemperature" method="post">
    Nhiệt độ:
    <input type="number" step="0.1" name="temperature" class="form-control">
    <button type="submit" class="btn btn-primary">Đăng ký</button>
  </form>`;
  } else {
    form.innerHTML = "";
  }
}

function formVaccine() {
  const form = document.getElementById("formVaccine");
  if (form.innerHTML === "") {
    form.innerHTML = `<form action="/registerVaccine" method="post">
  Loại vaccine:
  <input type="text" name="typeOfVaccine" class="form-control">
  Ngày tiêm:
  <input type="date" name="date" class="form-control">
  Lần tiêm thứ:
  <input type="number" name="serial" class="form-control">
  <button type="submit" class="btn btn-primary">Đăng ký</button>
</form>`;
  } else {
    form.innerHTML = "";
  }
}

function formCovid() {
  const form = document.getElementById("formCovid");
  if (form.innerHTML === "") {
    form.innerHTML = `<form action="/registerCovid" method="post">
  Ngày:
  <input type="date" name="date" class="form-control">
  <div class="form-check">
    <input type="checkbox" id="status" name="status" class="form-check-input">
    <label class="form-check-label" for="status"> Mắc covid/ đã khỏi</label>
  </div>
  <button type="submit" class="btn btn-primary">Đăng ký</button>
</form>`;
  } else {
    form.innerHTML = "";
  }
}
