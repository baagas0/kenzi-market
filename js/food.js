$(document).ready(function () {
  const foods = [
    {
      img: "images/produk1.png",
      title: "Minuman Ximilu Dessert",
      desc: "Waktu: 15 - 20 Menit | Melayani : 1",
      size_food1: "Medium",
      size_food2: "Large",
      price1: "Rp.25.000",
      price2: "Rp.50.000",
    },
    {
      img: "images/produk2.png",
      title: "Asinan Buah Kuah Lemon",
      desc: "Waktu: 15 - 20 Menit | Melayani : 1",
      size_food1: "400 ml",
      size_food2: "1 ltr",
      price1: "Rp.25.000",
      price2: "Rp.75.000",
    },
    {
      img: "images/produk3.png",
      title: "Puding Mangga Salad Buah Box",
      desc: "Waktu: 15 - 20 Menit | Melayani : 1",
      size_food1: "",
      size_food2: "",
      price1: "Rp.30.000",
      price2: "<del>Rp.40.000</del>",
    },
  ];

  let index = 0;
  for (const food of foods) {
    let food_dom = `
            <div class="col-md-4">
                <div class="card card-product">
                    <div class="img-wrap"><img src="${food.img}" alt="img"></div>
                    <div class="info-wrap">
                        <h4 class="title">${food.title}</h4>
                        <p class="desc">${food.desc}</p>
                        <div class="price-wrap h3">
                            <p class="size_food">${food.size_food1} &emsp; &emsp; &emsp; &emsp; &nbsp ${food.size_food2}
                            </p>
                            <span class="price-new">${food.price1} &emsp;${food.price2}
                            </span>
                        </div>
                    </div>
                    <div class="bottom-wrap">
                        <a href="" class="btn btn-sm btn-primary float-right" data-toggle="modal"
                            data-target="#modalContactForm" data-index="${index}">Order Now <i class="fa fa-shopping-basket" aria-hidden="true"></i></a>
                    </div>
                </div>
            </div>
        `;

    $("#foods-container").append(food_dom);

    index++;
  }

  $("#modalContactForm").on("shown.bs.modal", function (e) {
    if (!e.relatedTarget.dataset.index) {
      alert("Tidak dapat menemukan makanan.");
    }
    const index = e.relatedTarget.dataset.index;

    const food = foods[index];
    $('select[name="food"]').empty().val("0").change();
    if (!food.size_food2 || !food.price2) {
      $('select[name="food"]').append(
        `<option value="${index}" selected> ${food.title} - ${food.price1} </option>`
      );
    } else {
      $('select[name="food"]').append(
        `<option value="${index}|1" selected> ${food.title} (${food.size_food1}) - ${food.price1} </option>`
      );
      $('select[name="food"]').append(
        `<option value="${index}|2"> ${food.title} (${food.size_food2}) - ${food.price2} </option>`
      );
    }

    // $('select[name="food"]').val(index).change();
    // console.log(index);
  });

  $("#modalContactForm").on("hidden.bs.modal", function () {
    $('form[name="order"]')[0].reset();

    $("#order-button").prop("disabled", false);
    $("#order-button").html('Pesan <i class="fa fa-paper-plane-o"></i>');
  });

  $('form[name="order"]').on("submit", function (e) {
    e.preventDefault();

    console.log("submited");

    const name = $('input[name="name"]').val();
    const f = $('select[name="food"]').val();
    const f_real = f.includes("|") ? f.split("|") : [f, 1];
    const food = foods[f_real[0]];

    let whatsapp = $('input[name="whatsapp"]').val().toString();
    whatsapp = whatsapp.replace(/\D/g, "");
    if (whatsapp.startsWith("0")) {
      whatsapp = "62" + whatsapp.substr(1);
    }
    let regex = /^\+62\d{9,14}$/;
    if (whatsapp.length >= 10 && whatsapp.length <= 14) {
      console.log("Nomor telepon valid");
    } else {
      // console.log("Nomor telepon tidak valid");
      Swal.fire({
        title: "Order Gagal",
        text: "Nomor telepon tidak valid",
        icon: "error",
      });
      return;
    }

    const notifikasi =
      "Halo kak " +
      name +
      ",\n\n" +
      "Terima kasih telah berbelanja di Kenzi Market! Kami informasikan bahwa pesanan Anda sedang dalam proses pengolahan.\n\n" +
      "Detail Pesanan:\n" +
      "- Nama Pelanggan: " +
      name +
      "\n" +
      "- No Telepon: " +
      whatsapp +
      "\n" +
      "- Makanan yang Dipesan: " +
      food.title +
      (f.includes("|") ? ` (${food[`size_food${f_real[1]}`]})` : ``) +
      " - " +
      food[`price${f_real[1]}`] +
      "\n\n" +
      "Mohon menunggu beberapa saat hingga pesanan Anda selesai diproses. Kami akan segera menghubungi Anda jika ada informasi tambahan atau konfirmasi pengiriman.\n\n" +
      "Terima kasih atas kepercayaan Anda kepada Kenzi Market. Kami berkomitmen untuk memberikan pelayanan terbaik.\n\n" +
      "Hormat kami,\n" +
      "Tim Kenzi Market";

    console.log(notifikasi);
    // return;

    $("#order-button").prop("disabled", true);
    $("#order-button").text("Menunggu ...");

    $.ajax({
      type: "GET",
      url: "https://baagas0-wa-api-v2.hf.space/api/sendText",
      data: {
        phone: whatsapp,
        text: notifikasi,
        session: "default",
      },
      cache: false,
      success: function (data) {
        $("#modalContactForm").modal("hide");
        Swal.fire({
          title: "Order Berhasil",
          text: "Periksa whatsapp anda",
          icon: "success",
        });
      },
      error: function (err) {
        $("#modalContactForm").modal("hide");
        Swal.fire({
          title: "Order Gagal",
          text: "Terjadi kesalahan saat memproses pesanan anda",
          icon: "error",
        });
      },
    });
  });
});
