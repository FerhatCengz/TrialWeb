const firebaseConfig = {
  apiKey: "AIzaSyDynIybVY8crJF1R6GjEX13c8R5_v5oxho",
  authDomain: "trialfirebase-ffa81.firebaseapp.com",
  databaseURL: "https://trialfirebase-ffa81-default-rtdb.firebaseio.com",
  projectId: "trialfirebase-ffa81",
  storageBucket: "trialfirebase-ffa81.appspot.com",
  messagingSenderId: "47869559881",
  appId: "1:47869559881:web:58ba54e4454758dbddeb98",
  measurementId: "G-3NYE2FLZPT",
};

localStorage.setItem("db", "false");
firebase.initializeApp(firebaseConfig);
let db = firebase.database();

//Modal İçinde ki -101 Buttonuna Click Olduğunda

//Kuzenlerin İsmini Direk Ata
let getCousinName = () => {
  $("#kuzenlerleBtn").click(function (e) {
    $("#input_Oyuncu1").val("Ferhat");
    $("#input_Oyuncu2").val("İbrahim");
    $("#input_Oyuncu3").val("Hakan");
    $("#input_Oyuncu4").val("Eyüp");
  });
};
getCousinName();
let refreshGame = () => {
  $("#refreshGame").click((e) => {
    db.ref("Okey/").on("value", (data) => {
      Object.keys(data.val()).forEach((e) => {
        db.ref("Okey/" + e).set(null);
      });
    });
    window.location.reload();
  });
};

let dataConvertToColumn = (s1) => {
  let newHtml;

  let sutun1 = 0;
  let sutun2 = 1;
  let sutun3 = 2;
  let sutun4 = 3;
  let totalNumberSkorArray = [0, 0, 0, 0];

  for (let i = 0; i < s1.length / 4; i++) {
    totalNumberSkorArray[0] += Number(s1[sutun1]);
    totalNumberSkorArray[1] += Number(s1[sutun2]);
    totalNumberSkorArray[2] += Number(s1[sutun3]);
    totalNumberSkorArray[3] += Number(s1[sutun4]);
    newHtml =
      "<tr><td class='w-25'><div class='w-100'><input disabled value='" +
      s1[sutun1] +
      "' class=' text-center form-control text-center'/></div></td><td class='w-25'><div class='w-100'><input disabled value='" +
      s1[sutun2] +
      "' class=' text-center form-control'/></div></td><td class='w-25'><div class='w-100'><input disabled value='" +
      s1[sutun3] +
      "' class=' text-center form-control'/></div></td><td class='w-25'><div class='w-100'><input disabled value='" +
      s1[sutun4] +
      "' class=' text-center form-control'/></div></td></tr>";
    sutun1 += 4;
    sutun2 += 4;
    sutun3 += 4;
    sutun4 += 4;

    $("#dataTable").append(newHtml);
  }

  for (let i = 1; i <= 4; i++) {
    $("#spn_" + i).text(totalNumberSkorArray[i - 1]);
  }
};

let modalHtmlButton = (buttonValue, buttonId, buttonClass) => {
  let btnModalButton = `
  <div class="d-flex justify-content-end">
    <input type="radio"  class="${
      buttonId + "" + buttonClass
    } mr-2" id="${buttonId}" value="${buttonValue}"/>
  </div>
    `;
  return btnModalButton;
};

let modalHtml = () => {
  let valuePlayerString = `
    
    <input id="in_p1" class="form-control mt-2" placeholder="${localStorage.getItem(
      "oyuncu1"
    )}'ın Puanı" />
        
        <input id="in_p2" class="form-control mt-2" placeholder="${localStorage.getItem(
          "oyuncu2"
        )}'ın Puanı" />
        

    <input id="in_p3" class="form-control mt-2" placeholder="${localStorage.getItem(
      "oyuncu3"
    )}'ın Puanı" />
    
    <input id="in_p4" class="form-control mt-2" placeholder="${localStorage.getItem(
      "oyuncu4"
    )}'ın Puanı" />
   

   `;
  return valuePlayerString;
};

//Oyuncu Puanlarını Database Göndermek
$("#gameSkor").click(function (e) {
  Swal.fire({
    title: "Oyuncuların Puanlarını Yazınız",
    html: modalHtml(),
    inputAttributes: {
      autocapitalize: "off",
    },
    confirmButtonText: "Oyunu Kaydet",
    showLoaderOnConfirm: true,
    preConfirm: (login) => {
      for (let i = 1; i <= 4; i++) {
        let valP = $("#in_p" + i).val();
        let idKey = db.ref().child("Okey").push().key;
        db.ref("Okey/" + idKey).set(valP);
      }

      newHtml =
        "<tr><td class='w-25'><div class='w-100'><input value='" +
        $("#in_p1").val() +
        "' class='text-center form-control'disabled/></div></td><td class='w-25'><div class='w-100'><input value='" +
        $("#in_p2").val() +
        "' class='text-center form-control'disabled/></div></td><td class='w-25'><div class='w-100'><input value='" +
        $("#in_p3").val() +
        "' class='text-center form-control'disabled/></div></td><td class='w-25'><div class='w-100'><input value='" +
        $("#in_p4").val() +
        "' class='text-center form-control'disabled/></div></td></tr>";

      $("#dataTable").append(newHtml);
    },
  });
});

// Oyuncu Ekleme İşlemi
let insertToLocalPlayer = (islem = "") => {
  for (let i = 1; i <= 4; i++) {
    if (islem == "SaveUpdate") {
      localStorage.setItem("oyuncu" + i, $("#input_Oyuncu" + i).val());
      $("#th_Oyuncu" + i).text(localStorage.getItem("oyuncu" + i));
    } else {
      $("#th_Oyuncu" + i).text(localStorage.getItem("oyuncu" + i));
    }
  }
};

//Sayfa Başladığında
$(document).ready(function () {
  refreshGame();
  insertToLocalPlayer();
  $("#btnSetPlayer").click(function (e) {
    insertToLocalPlayer("SaveUpdate");
  });
});

const getDataToDatabase = (async () => {
  let arrayData = [];
  await db.ref("Okey/").on("value", (data) => {
    Object.keys(data.val()).forEach((e) => {
      arrayData.push(data.val()[e]);
      localStorage.setItem("db", "true");
    });
  });
  return arrayData;
})();

//Kontrol

const controlDb = setInterval(() => {
  if (localStorage.getItem("db") == "false") {
    console.log("Hazır Değil");
  } else {
    getDataToDatabase.then((e) => dataConvertToColumn(e));
    clearInterval(controlDb);
  }
}, 100);
