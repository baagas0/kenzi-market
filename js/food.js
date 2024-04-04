$(document).ready(function() {
    const foods = [
        {
            img: 'images/produk1.png',
            title: 'Rainbow Vegetable Sandwich',
            desc: 'Waktu Penyajian: 15 - 20 Menit',
            price: 'Rp. 25.000',
            old_price: 'Rp. 30.000'
        },
        {
            img: 'images/produk2.png',
            title: 'Asninan Buah Kuah Lemon',
            desc: 'Waktu Penyajian: 15 - 20 Menit',
            price: 'Rp. 25.000',
            old_price: 'Rp. 30.000'
        },
        {
            img: 'images/produk3.png',
            title: 'Cincau Gula Aren',
            desc: 'Waktu Penyajian: 15 - 20 Menit',
            price: 'Rp. 25.000',
            old_price: 'Rp. 30.000'
        },
    ];

    let index = 0
    for (const food of foods) {
        let food_dom = `
            <div class="col-md-4">
                <div class="card card-product">
                    <div class="img-wrap"><img src="${food.img}" alt="img"></div>
                    <div class="info-wrap">
                        <h4 class="title">${food.title}</h4>
                        <p class="desc">${food.desc}</p>
                        <div class="price-wrap h3">
                            <span class="price-new">${food.price}</span> <del class="price-old ${food.old_price ? '' : 'd-none'}">${food.old_price}</del>
                        </div>
                    </div>
                    <div class="bottom-wrap">
                        <a href="" class="btn btn-sm btn-primary float-right" data-toggle="modal"
                            data-target="#modalContactForm" data-index="${index}">Pesan Sekarang</a>
                    </div>
                </div>
            </div>
        `

        $('#foods-container').append(food_dom)
        $('select[name="food"]').append(`<option value="${index}"> ${food.title} </option>`)
        index++
    }

    $('#modalContactForm').on('shown.bs.modal', function (e) {
        
        if (!e.relatedTarget.dataset.index) {
            alert('Tidak dapat menemukan makanan.')
        }

        const index = e.relatedTarget.dataset.index
        $('select[name="food"]').val(index).change()
        console.log(index)
    })

    $('form[name="order"]').on('submit', function(e) {
        e.preventDefault()
        const name = $('input[name="name"]').val()
        const food_index = $('select[name="food"]').val()
        const food = foods[food_index]
        
        let whatsapp = $('input[name="whatsapp"]').val().toString()
        whatsapp = whatsapp.replace(/\D/g, '');
        if (whatsapp.startsWith('0')) {
            whatsapp = '62' + whatsapp.substr(1);
        }
        let regex = /^\+62\d{9,14}$/;
        if (whatsapp.length >= 10 && whatsapp.length <= 14) {
            console.log("Nomor telepon valid");
        } else {
            // console.log("Nomor telepon tidak valid");
            Swal.fire({
                title: "Order Gagal",
                text: "Nomor telepon tidak valid",
                icon: "error"
            });
            return;
        }
        

        const notifikasi = "Halo kak " + name + ",\n\n" +
                   "Terima kasih telah berbelanja di Kenzi Market! Kami informasikan bahwa pesanan Anda sedang dalam proses pengolahan.\n\n" +
                   "Detail Pesanan:\n" +
                   "- Nama Pelanggan: " + name + "\n" +
                   "- No Telepon: " + whatsapp + "\n" +
                   "- Makanan yang Dipesan: " + food.title + "\n\n" +
                   "Mohon menunggu beberapa saat hingga pesanan Anda selesai diproses. Kami akan segera menghubungi Anda jika ada informasi tambahan atau konfirmasi pengiriman.\n\n" +
                   "Terima kasih atas kepercayaan Anda kepada Kenzi Market. Kami berkomitmen untuk memberikan pelayanan terbaik.\n\n" +
                   "Hormat kami,\n" +
                   "Tim Kenzi Market";
        
        $.ajax({
            type: "GET",
            url: "https://baagas0-wa-api-v2.hf.space/api/sendText",
            data: {
                phone: whatsapp,
                text: notifikasi,
                session: 'default'
            },
            cache: false,
            success: function(data){
                Swal.fire({
                    title: "Order Berhasil",
                    text: "Periksa whatsapp anda",
                    icon: "success"
                });
            },
            error: function(err) {
                Swal.fire({
                    title: "Order Gagal",
                    text: "Terjadi kesalahan saat memproses pesanan anda",
                    icon: "error"
                }); 
            }
        });
        

    })
})